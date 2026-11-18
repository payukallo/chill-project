console.log("SUPABASE_URL tersedia:", Boolean(process.env.SUPABASE_URL));
console.log(
  "SUPABASE_SERVICE_ROLE_KEY tersedia:",
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
);

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const app = require("../server/server.js");

export default app;