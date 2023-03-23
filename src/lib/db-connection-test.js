import pkg from 'pg';
const { Client } = pkg;

const connectionString = process.env.VITE_PG_CONNECTION_STRING;

async function testConnection() {
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log('Successfully connected to PostgreSQL server.');
    } catch (error) {
        console.error('Error connecting to PostgreSQL server:', error);
    } finally {
        await client.end();
    }
}

testConnection();
