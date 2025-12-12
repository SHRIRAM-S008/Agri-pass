
import { createClient } from '@supabase/supabase-js';

// Read from .env.local logic simulation or hardcoded for this verification script since we know them
// In a real script we'd use dotenv, but for this agentic context I'll just use the values we know.

const SUPABASE_URL = 'https://yhfrzmfoqjzxpqyualqm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InloZnJ6bWZvcWp6eHBxeXVhbHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MjY3MjUsImV4cCI6MjA4MDMwMjcyNX0.zE6iTFHAgVZadhgndyAGvoBQVORw-f0od1dfqisK6yE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyConnection() {
    console.log('Verifying Supabase connection...');

    // 1. Check connection and batches table
    const { data: batches, error: batchError } = await supabase
        .from('batches')
        .select('count')
        .limit(1);

    if (batchError) {
        console.error('❌ Error connecting to "batches" table:', batchError.message);
        console.error('Did you run the "supabase_schema.sql" in your Supabase SQL Editor?');
        process.exit(1);
    } else {
        console.log('✅ Connected to "batches" table.');
    }

    // 2. Check certificates table
    const { data: certs, error: certError } = await supabase
        .from('certificates')
        .select('count')
        .limit(1);

    if (certError) {
        console.error('❌ Error connecting to "certificates" table:', certError.message);
        console.error('Did you run the "supabase_schema.sql" in your Supabase SQL Editor?');
        process.exit(1);
    } else {
        console.log('✅ Connected to "certificates" table.');
    }

    console.log('🎉 Supabase connection and schema verification successful!');
}

verifyConnection();
