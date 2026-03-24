/**
 * apply-schema.mjs
 *
 * Connects directly to the Supabase PostgreSQL database and runs
 * schema.sql followed by seed.sql.
 *
 * Usage:  node apply-schema.mjs
 *
 * Requires .env.local with:
 *   NEXT_PUBLIC_SUPABASE_URL   (used to derive the host)
 *   SUPABASE_SERVICE_ROLE_KEY  (not used for PG — we use the DB password)
 */

import { readFileSync } from "fs";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!SUPABASE_URL) {
    console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
    process.exit(1);
}

// Supabase DB password — the user must set this in .env.local
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;
const ref = new URL(SUPABASE_URL).hostname.split(".")[0];

// Build connection string
// Supabase direct connection: postgresql://postgres.[ref]:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
// Or session mode:            postgresql://postgres.[ref]:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
// Or direct:                  postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres
const connectionString = DB_PASSWORD
    ? `postgresql://postgres:${DB_PASSWORD}@db.${ref}.supabase.co:5432/postgres`
    : null;

// Alternative: use the Supabase REST SQL endpoint with service role key
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runViaREST(label, sql) {
    console.log(`\n⏳  Running ${label} via REST …`);

    // Try the /rest/v1/rpc approach — create a temp function
    // Actually, let's try the SQL endpoint that Supabase exposes
    // Actually, let's try the SQL endpoint that Supabase exposes

    // Use the standard Supabase approach: split SQL into statements and run via service role
    // The supabase-js client can execute raw SQL via .rpc() if we create a helper function
    // But the simplest: use the /pg endpoint or fall back to manual

    const res = await fetch(`${SUPABASE_URL}/pg/query`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SERVICE_KEY}`,
            "apikey": SERVICE_KEY,
        },
        body: JSON.stringify({ query: sql }),
    });

    if (res.ok) {
        console.log(`✅  ${label} applied successfully via REST`);
        return true;
    }

    console.log(`⚠️  REST endpoint returned ${res.status}, trying alternative…`);
    return false;
}

async function runViaPG(label, sql) {
    if (!connectionString) {
        return false;
    }
    console.log(`\n⏳  Running ${label} via direct PG …`);

    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        await client.query(sql);
        console.log(`✅  ${label} applied successfully via PG`);
        return true;
    } catch (err) {
        console.error(`❌  ${label} PG error:`, err.message);
        return false;
    } finally {
        await client.end();
    }
}

async function verifyViaPG() {
    if (!connectionString) return false;

    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
        await client.connect();
        const { rows } = await client.query(`
      SELECT
        (SELECT count(*) FROM public.competitions)::int    AS competitions,
        (SELECT count(*) FROM public.seasons)::int         AS seasons,
        (SELECT count(*) FROM public.categories)::int      AS categories,
        (SELECT count(*) FROM public.levels)::int          AS levels,
        (SELECT count(*) FROM public.checklist_items)::int AS checklist_items,
        (SELECT count(*) FROM public.quizzes)::int         AS quizzes
    `);
        return rows[0];
    } catch (err) {
        console.error("❌  Verify error:", err.message);
        return null;
    } finally {
        await client.end();
    }
}

async function main() {
    console.log("═══════════════════════════════════════");
    console.log(" Tagylym — Apply Database Schema + Seed");
    console.log(`  Project ref: ${ref}`);
    console.log("═══════════════════════════════════════");

    const schemaSql = readFileSync("schema.sql", "utf-8");
    const seedSql = readFileSync("seed.sql", "utf-8");

    // Try direct PG first, then REST fallback
    let schemaOk = await runViaPG("schema.sql", schemaSql);
    if (!schemaOk) {
        schemaOk = await runViaREST("schema.sql", schemaSql);
    }
    if (!schemaOk) {
        console.error("\n❌  Could not apply schema via PG or REST.");
        console.error("    Please set SUPABASE_DB_PASSWORD in .env.local");
        console.error("    (find it in Supabase Dashboard → Settings → Database → Connection string)");
        console.error("    Or copy schema.sql into the Supabase SQL Editor manually.");
        process.exit(1);
    }

    let seedOk = await runViaPG("seed.sql", seedSql);
    if (!seedOk) {
        seedOk = await runViaREST("seed.sql", seedSql);
    }
    if (!seedOk) {
        console.error("\n❌  Could not apply seed.");
        process.exit(1);
    }

    // Verify
    console.log("\n🔍  Verifying row counts …");
    const counts = await verifyViaPG();
    if (counts) {
        console.log("\n╔═══════════════════════════════════╗");
        console.log("║       TABLE ROW COUNTS            ║");
        console.log("╠═══════════════════════════════════╣");
        for (const [table, count] of Object.entries(counts)) {
            console.log(`║  ${table.padEnd(18)} ${String(count).padStart(4)}       ║`);
        }
        console.log("╚═══════════════════════════════════╝");
    } else {
        console.log("⚠️  Could not verify via PG. Check the Supabase dashboard.");
    }

    console.log("\n🎉  All done!");
}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
