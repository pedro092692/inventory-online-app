import Database from '../database/database.js'
import { Store } from '../models/StoreModel.js'
import pkg from '../config/config.js'
import process from 'process'

/**
 * One-off script that runs any pending tenant-schema migrations (src/migrations/tenant_migrations)
 * against EVERY existing tenant right now, instead of waiting for each store to log in and
 * trigger it lazily on its own next request (see TenantConnection._registerTenant/newMigration
 * in tenant_connection.js — that's what normally applies tenant migrations, one tenant at a
 * time, whenever that tenant happens to make its first request in a given server process).
 *
 * Use this after adding a new tenant migration when you want it applied to every store
 * immediately (e.g. right after a deploy) instead of one at a time as stores happen to log in.
 * A tenant that's already cached in the running server's memory (tenantRegister, in
 * tenant_connection.js) won't get re-checked for pending migrations until the process
 * restarts — and even then, only the FIRST request each tenant makes after that restart
 * triggers it, so a store that doesn't log back in soon just stays on the old schema. This
 * script migrates every tenant deterministically, right now, without depending on traffic.
 *
 * Run it from the backend package:
 *   npm run migrate:tenants
 *
 * Or against the deployed app (Fly.io), using the app's real production secrets, from your
 * own machine (no need to set any env vars yourself):
 *   fly ssh console -a nexastock-api -C "npm run migrate:tenants"
 */
async function migrateAllTenants() {
    const db = new Database()
    const sequelize = db.sequelize
    const currentEnv = process.env.NODE_ENV || 'development'
    const { db_user_tenant } = pkg[currentEnv]

    await sequelize.authenticate()

    const stores = await Store.findAll({ attributes: ['tenant_id', 'name'] })
    console.log(`Found ${stores.length} tenant(s).`)

    const failures = []

    for (const store of stores) {
        const tenantId = store.tenant_id
        // Same special case as TenantConnection.TenantConnection() (tenant_connection.js) —
        // kept here for consistency, though no real store should ever have tenant_id === 1.
        const schema = tenantId === 1 ? 'test_schema' : `${db_user_tenant}_${tenantId}`

        console.log(`\n[tenant ${tenantId}] "${store.name}" — schema "${schema}"`)
        try {
            // schema might not exist yet for a tenant that has never logged in — same
            // as _registerTenant() does before running migrations for a brand-new tenant.
            await db.tenant.createNewShema(schema)
            await db.tenant.newMigration(schema, sequelize)
        } catch (error) {
            console.error(`[tenant ${tenantId}] FAILED:`, error.message)
            failures.push({ tenantId, name: store.name, schema, error: error.message })
        }
    }

    console.log('\n--- Summary ---')
    console.log(`Total: ${stores.length} | OK: ${stores.length - failures.length} | Failed: ${failures.length}`)
    if (failures.length > 0) {
        console.log('Failed tenants:', JSON.stringify(failures, null, 2))
    }

    await sequelize.close()

    if (failures.length > 0) {
        throw new Error(`${failures.length} tenant(s) failed to migrate — see log above.`)
    }
}

migrateAllTenants()
    .then(() => {
        console.log('\nDone.')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\nFatal error running tenant migrations:', error.message)
        process.exit(1)
    })
