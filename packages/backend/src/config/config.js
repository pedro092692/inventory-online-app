/* eslint-disable no-undef */
require('dotenv').config()

// Fly Postgres (via `fly postgres attach`) — and most managed Postgres providers — inject a
// single DATABASE_URL secret instead of separate host/user/password/database vars. Parse it
// when present so deployment doesn't require manually splitting it into DB_* secrets; local
// dev (which sets DB_USER/DB_PASSWORD/etc. individually in .env) keeps working unchanged since
// DATABASE_URL simply isn't set there.
let dbConfig
if (process.env.DATABASE_URL) {
    const dbUrl = new URL(process.env.DATABASE_URL)
    dbConfig = {
        username: decodeURIComponent(dbUrl.username),
        password: decodeURIComponent(dbUrl.password),
        database: dbUrl.pathname.replace(/^\//, ''),
        host: dbUrl.hostname,
        port: dbUrl.port ? parseInt(dbUrl.port, 10) : 5432,
        dialect: 'postgres',
        db_user_tenant: process.env.DB_USERTETANT
    }
} else {
    dbConfig = {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        db_user_tenant: process.env.DB_USERTETANT
    }
}

const appConfig = {
    saltRounds: parseInt(process.env.SALT_ROUNDS, 10),
    jtw_secret: process.env.JWT_SECRET,
    // Falls back to JWT_SECRET if not set, so the app keeps working without a new .env
    // entry — but a separate secret is recommended so a leaked access-token secret alone
    // doesn't also let an attacker mint refresh tokens.
    refresh_jwt_secret: process.env.REFRESH_JWT_SECRET || process.env.JWT_SECRET,
    admin_user: process.env.ADMIN_EMAIL,
    admin_pass: process.env.ADMIN_PASS,
    admin_role: process.env.ADMIN_ROLE,
    admin_tenant: process.env.ADMIN_TENANT,
    credit_method_id: process.env.CREDIT_METHOD_ID,
    subscription_price_usd: parseFloat(process.env.SUBSCRIPTION_PRICE_USD) || 20,
    r2_account_id: process.env.R2_ACCOUNT_ID,
    r2_access_key_id: process.env.R2_ACCESS_KEY_ID,
    r2_secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
    r2_bucket_name: process.env.R2_BUCKET_NAME,
}

module.exports = {
    development: {...dbConfig, ...appConfig},
    production: {...dbConfig, ...appConfig},
}