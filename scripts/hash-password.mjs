import crypto from "node:crypto";

const [, , password, role = "admin", displayName = "Admin", username = "admin"] = process.argv;

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password> [role=admin|player] [displayName] [username]");
  console.error('Example: node scripts/hash-password.mjs "s3cret-pw" admin "M0RU.ID" moru');
  process.exit(1);
}

if (role !== "admin" && role !== "player") {
  console.error('role must be "admin" or "player"');
  process.exit(1);
}

const ITERATIONS = 100_000;
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.pbkdf2Sync(password, Buffer.from(salt, "hex"), ITERATIONS, 32, "sha256").toString("hex");

const sql = `INSERT INTO users (username, password_hash, password_salt, role, display_name) VALUES ('${username}', '${hash}', '${salt}', '${role}', '${displayName}');`;

console.log("Run this against your D1 database:\n");
console.log(`wrangler d1 execute 4cwc-db --remote --command "${sql.replace(/"/g, '\\"')}"\n`);
console.log("Or paste the SQL below into a .sql file and run it with --file:\n");
console.log(sql);
