/* TODO: db functions here to allow easy db swapping */
import PG from "pg";
import crypto from "crypto";
import { verifyPassword } from "$lib/server/auth.js";


const connectionString = "ENV-VARIABLE-HERE";

function generateSessionId() {
  return crypto.randomBytes(16).toString("hex");
}

// Create a new entry for the user table
// Parameters: String - username, email, passwordHash
export async function insertUser(username, email, passwordHash) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const result = await client.query(query, [username, email, passwordHash]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting user:", error);
    return null;
  } finally {
    await client.end();
  }
}

export async function verifyUserCredentials(username, password) {
  const client = new PG.Client({ connectionString });

  console.log(username, password);

  try {
    await client.connect();
    const query = `
        SELECT users.id, users.*
        FROM users
        WHERE username = $1
      `;

    const values = [username];
    const result = await client.query(query, values);

    console.log("Query result:", result);

    if (result.rowCount > 0) {
      const user = result.rows[0];
      console.log("User found:", user);

      const passwordMatches = await verifyPassword(password, user.password_hash);
      console.log("Password matches:", passwordMatches);

      if (passwordMatches) {

        return user;
      }
    } else {
      console.log("User not found");
    }

    return null;
  } catch (error) {
    console.error("Error verifying user credentials:", error);
    throw error;
  } finally {
    await client.end();
  }
}


export async function createSession(user) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const sessionId = generateSessionId();
    const expiresAt = calculateSessionExpiration();
    const query = `INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)`;
    const values = [sessionId, user, expiresAt];
    await client.query(query, values);

    return sessionId;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  } finally {
    await client.end();
  }
}


function calculateSessionExpiration() {
  const expirationHours = 24;
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + expirationHours);
  return currentDate;
}

export async function destroySession(sessionId) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `DELETE FROM sessions WHERE session_id = $1`;
    const values = [sessionId];
    await client.query(query, values);
  } catch (error) {
    console.error("Error destroying session:", error);
    throw error;
  } finally {
    await client.end();
  }
}


export async function getUserFromSession(sessionId) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `
      SELECT users.*
      FROM users
      JOIN sessions ON users.id = sessions.user_id
      WHERE sessions.session_id = $1
    `;
    const values = [sessionId];
    const result = await client.query(query, values);

    if (result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user from session:", error);
    throw error;
  } finally {
    await client.end();
  }
}


// Return a user based on the email provided from the users table
export async function getUserByEmail(email) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  } finally {
    await client.end();
  }
}

// Check then return the user parameter given
export async function getUserByUsername(username) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = "SELECT * FROM users WHERE username = $1";
    const result = await client.query(query, [username]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  } finally {
    await client.end();
  }
}

// Returns a post by the slug
export async function getPostBySlug(slug) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = "SELECT * FROM posts WHERE slug = $1";
    const result = await client.query(query, [slug]);

    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return null;
  } finally {
    await client.end();
  }
}

// TODO: Debugging functions
export async function testConnection() {
  const client = new PG.Client({
    connectionString
  });

  try {
    await client.connect();
    console.log("Successfully connected to PostgreSQL server.");
  } catch (error) {
    console.error("Error connecting to PostgreSQL server:", error);
  } finally {
    await client.end();
  }
}

//TODO: debugging purposes only, this file should not normally be run directly
//testConnection();
