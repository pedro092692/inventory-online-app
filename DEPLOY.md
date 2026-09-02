# Desplegar Nexastock en Fly.io

Guía paso a paso para desplegar el backend (Express) y el frontend (Next.js) como dos apps
separadas en Fly.io, con Postgres administrado por Fly. Pensada para hacerse **antes** de
tener el dominio propio comprado, y luego migrar a él sin volver a tocar código.

## 0. Antes de empezar

- Crea una cuenta en https://fly.io y agrega un método de pago (Fly pide tarjeta incluso para
  el plan gratuito/de bajo costo).
- Instala `flyctl`:
  - Windows (PowerShell): `pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"`
  - o revisa https://fly.io/docs/flyctl/install/ si prefieres otro método.
- `fly auth login` — te abre el navegador para autenticarte.
- Ten a mano los valores reales de tu `.env` (backend) y `.env.local` (frontend) — los vas a
  necesitar para los pasos de `fly secrets set`, pero **nunca los pegues en el chat conmigo**;
  esta guía solo usa los *nombres* de las variables, no los valores.

Cada comando de esta guía se corre **en tu máquina** (PowerShell/terminal), no aquí — yo no
tengo acceso para ejecutar `fly` por ti, solo preparé los archivos.

## 1. Base de datos: Postgres en Fly

```powershell
fly postgres create --name nexastock-db --region iad --vm-size shared-cpu-1x --initial-cluster-size 1 --volume-size 3
```

- `--region iad` (Virginia, EE.UU.) — nos dijiste que un servidor en USA está bien. Cualquier
  región de Fly sirve, pero usa la MISMA región para la base de datos, el backend y el
  frontend para minimizar latencia.
- Este tamaño (`shared-cpu-1x`, 1 nodo, 3GB de disco) ronda los $2-5/mes — dentro de tu
  presupuesto.
- Al final del comando, Fly te muestra credenciales de conexión — **no las necesitas copiar a
  mano**, `fly postgres attach` (paso 3) las inyecta automáticamente.

## 2. Backend: crear la app

Desde `packages/backend`:

```powershell
cd packages/backend
fly launch --no-deploy
```

- Te va a preguntar el nombre de la app (ej. `nexastock-api`), la región (usa la misma que la
  base de datos), y si quieres una base de datos Postgres — dile que **no** (ya la creaste en
  el paso 1, la vas a conectar tú mismo).
- Detecta el `Dockerfile` que ya te dejé en `packages/backend/Dockerfile` y genera un
  `fly.toml` en esa carpeta.
- Abre el `fly.toml` generado y confirma que `internal_port` dentro de `[http_service]` sea
  `8080` (así lo dejé configurado en el Dockerfile vía `ENV PORT=8080`).

### 2.1 Conectar la base de datos

```powershell
fly postgres attach nexastock-db --app nexastock-api
```

Esto crea automáticamente el secret `DATABASE_URL` en la app del backend — por eso ya te
agregué el parseo de `DATABASE_URL` en `config.js`, no hace falta que configures
`DB_USER`/`DB_PASSWORD`/etc. a mano.

### 2.2 Configurar los demás secrets

Mirando tu `.env` local, estas son las variables que le faltan (con sus **nombres**, pon tú
los valores reales):

```powershell
fly secrets set --app nexastock-api `
  DB_USERTETANT="tenant" `
  SALT_ROUNDS="10" `
  JWT_SECRET="..." `
  REFRESH_JWT_SECRET="..." `
  PIN_SECRET_SALT="..." `
  ADMIN_PASS="..." `
  ADMIN_ROLE="1" `
  ADMIN_TENANT="1" `
  ADMIN_EMAIL="..." `
  CREDIT_METHOD_ID="99" `
  R2_ACCOUNT_ID="..." `
  R2_ACCESS_KEY_ID="..." `
  R2_SECRET_ACCESS_KEY="..." `
  R2_BUCKET_NAME="..." `
  SUBSCRIPTION_PRICE_USD="20" `
  NODE_ENV="production" `
  FRONTEND_URL="https://<nombre-que-le-des-a-la-app-del-frontend>.fly.dev" `
  DB_POOL_MAX="10"
```

**Importante — `JWT_SECRET` debe ser IDÉNTICO entre backend y frontend.** Vi que tu
`.env.local` del frontend también tiene su propio `JWT_SECRET` (lo usa `middleware.ts` para
verificar el token sin llamar al backend) — usa el mismo valor exacto en ambos lados.

**`FRONTEND_URL` todavía no la sabes** hasta que despliegues el frontend (paso 3) y tengas su
URL real de `*.fly.dev`. Puedes dejarla pendiente y volver a este comando después, o
desplegar primero el frontend y volver aquí.

**Temporal, mientras no tengas el dominio propio:**
```powershell
fly secrets set --app nexastock-api COOKIE_SAME_SITE="none"
```
Sin esto, el login va a "funcionar" (te llega 200 y la cookie se guarda) pero cualquier
petición protegida después te va a dar 401, porque `*.fly.dev` de cada app cuenta como un
sitio distinto para el navegador y `sameSite:'strict'` nunca deja salir la cookie entre
ellos. Ver el paso 5 para cuando ya tengas el dominio y puedas quitar esto.

### 2.3 Migraciones del schema público al desplegar

Las migraciones de tenant (por tienda) ya las corre la app sola en tiempo de ejecución
(`TenantConnection`). Pero las migraciones del schema **público** (roles, usuarios, stores,
etc., las que corres tú con `sequelize-cli`) necesitan correr una vez contra la base de datos
de producción. Agrega esto a tu `fly.toml` (dentro de la sección raíz, no dentro de
`[http_service]`):

```toml
[deploy]
  release_command = "npm run migrate"
```

Esto hace que Fly corra `sequelize-cli db:migrate` automáticamente antes de cada deploy, con
las mismas variables de entorno/secrets ya configuradas — así nunca te vas a olvidar de
correrlas a mano.

### 2.4 Desplegar

```powershell
fly deploy --app nexastock-api
```

Espera a que termine y prueba: `fly status --app nexastock-api` te da la URL pública
(`https://nexastock-api.fly.dev`). `fly logs --app nexastock-api` para ver qué está pasando
si algo falla.

## 3. Frontend: crear la app

Desde `packages/frontend/inventory-online-app`:

```powershell
cd ../packages/frontend/inventory-online-app
fly launch --no-deploy
```

- Nombre de la app (ej. `nexastock-app`), misma región que las otras dos.
- Detecta el `Dockerfile` que te dejé ahí.
- Revisa `internal_port = 8080` en el `fly.toml` generado, igual que con el backend.

### 3.1 Variables públicas (van "horneadas" en el build, no son secrets)

Tu `.env.local` tiene `NEXT_PUBLIC_*` — Next.js las incrusta en el JavaScript que corre en el
navegador **durante el build**, así que no sirve configurarlas solo como secret en tiempo de
ejecución; hay que pasarlas como build args. Agrega esto al `fly.toml` del frontend:

```toml
[build.args]
  NEXT_PUBLIC_API_BASE_URL = "https://nexastock-api.fly.dev"
  NEXT_PUBLIC_DASHBOARD = "/store"
  NEXT_PUBLIC_WHATSAPP_NUMBER = "+34690279281"
  NEXT_PUBLIC_STORE_CREDIT_ID = "99"
```

(usa la URL real que te dio `fly status --app nexastock-api` en el paso 2.4, y tus propios
valores). Como terminan en el bundle del navegador de todas formas, no pasa nada por tenerlos
en texto plano en el `fly.toml`.

### 3.2 Secrets en tiempo de ejecución (server-side, no van al navegador)

```powershell
fly secrets set --app nexastock-app `
  JWT_SECRET="..." `
  API_BASE_URL="https://nexastock-api.fly.dev"
```

`JWT_SECRET` — el mismo valor exacto que le pusiste al backend (paso 2.2).

### 3.3 Desplegar

```powershell
fly deploy --app nexastock-app
```

`fly status --app nexastock-app` te da su URL pública.

## 4. Cerrar el círculo: FRONTEND_URL del backend

Ahora que ya tienes la URL real del frontend, vuelve al backend y termina de setear
`FRONTEND_URL` si lo dejaste pendiente:

```powershell
fly secrets set --app nexastock-api FRONTEND_URL="https://nexastock-app.fly.dev"
```

Esto reinicia la app del backend automáticamente con el nuevo valor — no hace falta
redeploy.

## 5. Cuando tengas el dominio propio

1. Compra el dominio (Namecheap, Cloudflare Registrar, lo que prefieras).
2. `fly certs add app.tudominio.com --app nexastock-app` y `fly certs add api.tudominio.com --app nexastock-api`
   — Fly te da los registros DNS exactos que hay que agregar (usualmente un CNAME por app).
3. Agrega esos registros en el panel DNS de tu proveedor de dominio. Puede tardar unos
   minutos/horas en propagar. `fly certs show <dominio> --app <app>` te dice cuándo el
   certificado HTTPS quedó listo.
4. Actualiza los secrets/build args para que apunten a los dominios nuevos en vez de
   `*.fly.dev`:
   ```powershell
   fly secrets set --app nexastock-api FRONTEND_URL="https://app.tudominio.com"
   fly secrets set --app nexastock-app API_BASE_URL="https://api.tudominio.com"
   # y actualiza NEXT_PUBLIC_API_BASE_URL en [build.args] del fly.toml del frontend,
   # luego: fly deploy --app nexastock-app
   ```
5. **Quita el `COOKIE_SAME_SITE=none`** del backend (o ponlo explícitamente en `strict`):
   ```powershell
   fly secrets unset --app nexastock-api COOKIE_SAME_SITE
   ```
   Como `app.tudominio.com` y `api.tudominio.com` son subdominios del mismo dominio
   registrable, ya cuentan como el mismo "site" para el navegador — `sameSite:'strict'`
   (el default del código si no seteas la variable) vuelve a funcionar sin tocar nada más.

## 6. Verificación rápida post-deploy

- `fly status --app nexastock-api` y `fly status --app nexastock-app` — ambas apps "started".
- Abre la URL del frontend, intenta hacer login con un usuario admin ya existente.
- Revisa `fly logs --app nexastock-api` durante el login — deberías ver los logs de
  `[tenant migrations]` si es la primera vez que se toca ese tenant en este proceso.
- Prueba crear una tienda nueva end-to-end (el flujo que estuvimos depurando) contra la base
  de datos de producción.

## Nota sobre lo que no pude probar yo

Preparé y revisé el `Dockerfile` de ambas apps a mano y verifiqué la sintaxis de cada archivo
que edité, pero no pude correr `docker build` de punta a punta en mi entorno porque no tengo
acceso a Docker Hub desde aquí (red restringida). `fly deploy` construye la imagen en los
servidores de Fly (sin esa restricción), así que ese va a ser el primer build real — si algo
falla, pégame el log de `fly deploy` o `fly logs` y lo resolvemos.
