/* TODO: db functions here to allow easy db swapping */
import PG from 'pg';

const connectionString = process.env.VITE_PG_CONNECTION_STRING;

export async function testConnection() {
    const client = new PG.Client({
        connectionString
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

//TODO: debugging purposes only, this file should not normally be run directly
testConnection();