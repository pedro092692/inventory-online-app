########################################
# Nexastock backend — production image
########################################
# node:20-slim — matches the Node version pinned in the repo's .nvmrc. Debian-based (not
# Alpine) on purpose: bcrypt is a native module and Alpine's musl libc needs extra build
# tooling to compile/rebuild it; the Debian-based slim image avoids that entirely since
# prebuilt binaries for glibc are readily available.
FROM node:20-slim

WORKDIR /app

# Install dependencies first, in their own layer — this layer is only rebuilt when
# package*.json actually changes, not on every source edit, which keeps `fly deploy` fast
# after the first build.
COPY package*.json ./
RUN npm install --omit=dev

# Now the rest of the source (respects .dockerignore below).
COPY . .

# Fly.io provides PORT at runtime; app.js already reads process.env.PORT (see src/app.js).
# This just documents/sets the default the container listens on — must match
# http_service.internal_port in fly.toml.
ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
