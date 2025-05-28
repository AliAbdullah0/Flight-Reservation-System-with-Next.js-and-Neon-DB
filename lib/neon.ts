import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!); // make sure DATABASE_URL is in your .env

export default sql;