import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres:1234@localhost:5432/hwcr";

const url = new URL(databaseUrl);

const pool = new Pool({
  host: url.hostname,
  port: parseInt(url.port),
  user: url.username,
  password: String(url.password),
  database: url.pathname.slice(1),
});

const adapter = new PrismaPg(pool);
const prismaInstance = new PrismaClient({ adapter });

export default prismaInstance;