const requiredPublic = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];

const requiredServer = ["SUPABASE_SERVICE_ROLE_KEY"];
const missing = [...requiredPublic, ...requiredServer].filter((key) => !process.env[key]?.trim());

const errors = [];
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const publishable = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const service = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (url && !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)) {
  errors.push("NEXT_PUBLIC_SUPABASE_URL is not a valid Supabase project URL.");
}
if (publishable && !(publishable.startsWith("sb_publishable_") || publishable.startsWith("eyJ"))) {
  errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY must be a publishable key or legacy anon JWT.");
}
if (service && !(service.startsWith("sb_secret_") || service.startsWith("eyJ"))) {
  errors.push("SUPABASE_SERVICE_ROLE_KEY must be a secret key or legacy service-role JWT.");
}
if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
  errors.push("Remove NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY immediately. Server secrets must never be public.");
}

if (missing.length || errors.length) {
  console.error("VYNTEX environment verification failed.");
  if (missing.length) console.error(`Missing: ${missing.join(", ")}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("VYNTEX environment verification passed.");
console.log(`Supabase project: ${url}`);
console.log("Public key configured: yes");
console.log("Server secret configured: yes (value intentionally hidden)");
