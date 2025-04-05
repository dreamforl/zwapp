import path from "path";
import { clearBuild } from "./config/clear.ts";
import { envPathData } from "./config/data.ts";
import config from "./config/rollup.config.ts";
import dotenv from "dotenv";
export default async function build() {
  const env = process.env.ZWAPP_ENV || "dev";
  const envPath = path.join(__dirname, envPathData[env]);
  dotenv.config({ path: envPath });
  await clearBuild();
  return config;
}
