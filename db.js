import { Pool } from 'pg';
import dotenv from 'dotenv'

dotenv.config();

const poll = new Pool({ connectionString: process.loadEnvFile.DATABASE_URL });

export default Pool;