/* TODO: db functions here to allow easy db swapping */
import PG from "pg";
import crypto from "crypto";
import { verifyPassword } from "$lib/server/auth.js";
import dotenv from "dotenv";


// Load environment variables from the .env file
dotenv.config();

// Connection string for the PostgreSQL database
const connectionString = process.env.VITE_PG_CONNECTION_STRING_LOCAL;

/**
 * Generates a random session ID using the crypto module.
 *
 * @returns {string} A 32-character long hexadecimal string representing the session ID.
 */
function generateSessionId() {
  return crypto.randomUUID()
}

/**
 * Inserts a new user into the users table with the given username, email, and password hash.
 *
 * @param {string} username The username of the new user.
 * @param {string} email The email address of the new user.
 * @param {string} passwordHash The hashed password of the new user.
 * @returns {Promise<Object | null>} The inserted user object if successful, or null if an error occurs.
 */
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

/**
 * Verifies if the given username and password match a user in the users table.
 *
 * @param {string} username The username of the user to verify.
 * @param {string} password The plaintext password to check against the stored password hash.
 * @returns {Promise<Object | null>} The user object if the credentials are valid, or null if the credentials are invalid or an error occurs.
 */
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

/**
 * Creates a new session for the given user in the sessions table.
 *
 * @param {number} user The user ID to create the session for.
 * @returns {Promise<string>} The session ID of the created session.
 * @throws {Error} If an error occurs while creating the session.
 */
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

/**
 * Calculates the expiration date of a session by adding a fixed number of hours to the current date.
 *
 * @returns {Date} The calculated expiration date for the session.
 */
function calculateSessionExpiration() {
  const expirationHours = 24;
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + expirationHours);
  return currentDate;
}

/**
 * Deletes a session from the sessions table by its session ID.
 *
 * @param {string} sessionId The session ID to delete.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs while deleting the session.
 */
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

/**
 * Retrieves the user data associated with the given session ID from the sessions and users tables.
 *
 * @param {string} sessionId The session ID to look up.
 * @returns {Promise<Object | null>} The user object if found, or null if the session is not found or expired.
 */
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


/**
 * Retrieves a user by their email address from the users table.
 *
 * @param {string} email The email address of the user to look up.
 * @returns {Promise<Object | null>} The user object if found, or null if no user with the given email address is found.
 */
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

/**
 * Retrieves a user by their username from the users table.
 *
 * @param {string} username The username of the user to look up.
 * @returns {Promise<Object | null>} The user object if found, or null if no user with the given username is found.
 */
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

/**
 * Retrieves a post by its slug from the posts table.
 *
 * @param {string} slug The slug of the post to look up.
 * @returns {Promise<Object | null>} The post object if found, or null if no post with the given slug is found.
 */
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

/**
 * Tests the database connection by executing a simple query.
 *
 * @returns {Promise<boolean>} True if the connection is successful, false if an error occurs.
 */

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

// TODO: Debugging functions
//TODO: debugging purposes only, this file should not normally be run directly
//testConnection();
