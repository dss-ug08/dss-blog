/* TODO: db functions here to allow easy db swapping */
import PG from "pg";
import pgprep from "pg-prepared";
import crypto from "crypto";
import dotenv from "dotenv";
import * as Utils from "$lib/server/utils.js";
import { verifyPassword } from "$lib/server/auth.js";

/**
 * @typedef { import("$lib/types").Post } Post
 * @typedef { import("$lib/types").Comment } Comment
 * @typedef { import("$lib/types").User } User
 */

// Load environment variables from the .env file
dotenv.config();

// Connection string for the PostgreSQL database
const connectionString = process.env.VITE_PG_CONNECTION_STRING;

/**
 * Generates a random session ID using the crypto module.
 *
 * @returns {string} A 32-character long hexadecimal string representing the session ID.
 */
function generateSessionId() {
  return crypto.randomUUID();
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
 * Deletes a user from the users table based on their username or ID.
 *
 * @param {string | number} identifier The username or ID of the user to be deleted.
 * @returns {Promise<boolean>} True if the deletion was successful, false otherwise.
 */
export async function deleteUser(identifier) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();

    let query;
    let values;

    // Check if the identifier is a number (user ID) or string (username)
    if (typeof identifier === "number") {
      query = `DELETE FROM users WHERE id = $1`;
      values = [identifier];
    } else {
      query = `DELETE FROM users WHERE username = $1`;
      values = [identifier];
    }

    await client.query(query, values);

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  } finally {
    await client.end();
  }
}

/**
 * Modifies a user's username, email, and password-hash in the users table based on their user ID.
 *
 * @param {number} userId The ID of the user to be modified.
 * @param {string} [username] The new username for the user. [Optional]
 * @param {string} [email] The new email for the user. [Optional]
 * @param {string} [passwordHash] The new password for the user. [Optional]
 * @returns {Promise<boolean>} True if the modification was successful, false otherwise.
 */
export async function modifyUser(userId, username, email, passwordHash) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();

    // Check for provided fields, if nothing provided skip adding to query.
    const fieldsToUpdate = [];
    const values = [userId];
    let i = 2;

    if (username) {
      fieldsToUpdate.push(`username = $${i}`);
      values.push(username);
      i++;
    }

    if (email) {
      fieldsToUpdate.push(`email = $${i}`);
      values.push(email);
      i++;
    }

    if (passwordHash) {
      fieldsToUpdate.push(`password_hash = $${i}`);
      values.push(passwordHash);
    }

    // No fields to update
    if (fieldsToUpdate.length === 0) {
      return false;
    }

    // Build the finalised query
    const query = `
      UPDATE users
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = $1
    `;

    // Push new values
    await client.query(query, values);
    return true;

  } catch (error) {
    console.error("Error modifying user:", error);
    return false;
  } finally {
    await client.end();
  }
}

/**
 * Verifies if the given username and password match a user in the users table.
 *
 * @param {string} username The username of the user to verify.
 * @param {string} password The plaintext password to check against the stored password hash.
 * @returns {Promise<User | null>} The user object if the credentials are valid, or null if the credentials are invalid or an error occurs.
 */
export async function verifyUserCredentials(username, password) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `
        SELECT users.id, users.*
        FROM users
        WHERE username = $1
      `;

    const values = [username];
    const result = await client.query(query, values);

    if (result.rowCount > 0) {
      const user = result.rows[0];

      const passwordMatches = await verifyPassword(password, user.password_hash);

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
 * Creates a new session for the given user in the sessions table and records
 * the associated IP address in the session_ips table.
 *
 * @param {string} user The user ID to create the session for.
 * @param {string} userIp The IP address of the user to be associated with the session.
 * @returns {Promise<string>} The session ID of the created session.
 * @throws {Error} If an error occurs while creating the session or recording the IP address.
 */
export async function createSession(user, userIp) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const sessionId = generateSessionId();
    const expiresAt = calculateSessionExpiration();

    // Create a new session in the sessions table
    const query = `INSERT INTO sessions (session_id, user_id, expires_at) VALUES ($1, $2, $3)`;
    const values = [sessionId, user, expiresAt];
    await client.query(query, values);

    // Record the IP address associated with this session
    const ipQuery = `INSERT INTO session_ips (session_id, ip_address) VALUES ($1, $2)`;
    await client.query(ipQuery, [sessionId, userIp]);

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
 * @returns {Promise<User>} The user object if found, or null if the session is not found or expired.
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
 * Checks if a session with a given IP exists in the session_ips table.
 *
 * @param {string} session_id The session ID to check.
 * @param {string} user_ip The IP address to check.
 * @returns {Promise<boolean>} True if a session with the given ID and IP exists, false otherwise.
 */
export async function checkSessionWithIP(session_id, user_ip) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `
      SELECT COUNT(*) as count
      FROM session_ips
      WHERE session_id = $1 AND ip_address = $2;
    `;
    const values = [session_id, user_ip];
    const result = await client.query(query, values);

    return result.rows[0].count > 0;
  } catch (error) {
    console.error("Error checking session with IP:", error);
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
 * Inserts a new post into the posts table with the given title, content, slug, and user_id.
 *
 * @param {string} title The title of the new post.
 * @param {string} content The content of the new post.
 * @param {string} slug The unique slug of the new post.
 * @param {number} user_id The ID of the user who created the post.
 * @returns {Promise<Post | null>} The inserted post object if successful, or null if an error occurs.
 */
export async function createPost(title, content, slug, user_id, updated_at) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `
      INSERT INTO posts (title, content, slug, user_id, updated_at)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [title, content, slug, user_id, updated_at];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating post:", error);
    return null; //TODO: throw this instead
  } finally {
    await client.end();
  }
}

/**
 * Deletes a post from the posts table based on the given slug.
 *
 * @param {string} slug The unique slug of the post to be deleted.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs while deleting the post.
 */
export async function deletePostBySlug(slug) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = 'DELETE FROM posts WHERE slug = $1';
    await client.query(query, [slug]);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  } finally {
    await client.end();
  }
}

/**
 * Updates an existing post in the posts table.
 *
 * @param {string} title The new title of the post.
 * @param {string} content The new content of the post.
 * @param {string} slug The slug of the post to be updated.
 * @param {number} user_id The ID of the user who updated the post.
 * @returns {Promise<Post | null>} The updated post object if successful, or null if an error occurs.
 */
export async function updatePost(title, content, slug, user_id) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `
      UPDATE posts 
      SET title = $1, content = $2, user_id = $4, updated_at = CURRENT_TIMESTAMP
      WHERE slug = $3
      RETURNING *;
    `;
    const values = [title, content, slug, user_id];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  } finally {
    await client.end();
  }
}

/**
 * Toggles the hidden status of a post.
 *
 * @param {string} slug The slug of the post.
 * @param {boolean} isHidden The new hidden status.
 * @returns {Promise<Post | null>} The updated post object if successful, or null if an error occurs.
 */
export async function toggleHidden(slug, isHidden) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `
      UPDATE posts 
      SET isHidden = $2 
      WHERE slug = $1 
      RETURNING *;
    `;
    const values = [slug, isHidden];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error toggling hidden status:", error);
    return null;
  } finally {
    await client.end();
  }
}

/**
 * Toggles the draft status of a post.
 *
 * @param {string} slug The slug of the post.
 * @param {boolean} isDraft The new draft status.
 * @returns {Promise<Post | null>} The updated post object if successful, or null if an error occurs.
 */
export async function toggleDraft(slug, isDraft) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `
      UPDATE posts 
      SET isDraft = $2 
      WHERE slug = $1 
      RETURNING *;
    `;
    const values = [slug, isDraft];
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error toggling draft status:", error);
    return null;
  } finally {
    await client.end();
  }
}


/**
 * Retrieves an array containing posts which match any of the conditions given in the options object.
 *
 * @param {Object} [options] An object containing any of the following properties:
 * @param {string} [options.slug] A string to match against the slug column - will return all posts with a slug that contains this string.
 * @param {number} [options.after] The ID of the post to retrieve posts after.
 * @param {number} [options.limit] The maximum number of posts to retrieve.
 * @param {boolean} [options.withAuthor] Whether to include the author's username and email in the returned post objects.
 * @returns {Promise<Array<Post>>} An array of post objects, if any match the criteria.
 */
// @ts-ignore
export async function getPosts({slug, title, after, limit, withAuthor=false}={}) {
  // Error checking
  // For now some queries are impossible without further work.
  if (slug && title) throw new Error("Cannot query by both slug and title.");
  if ((after ?? 0) < 0 || (limit ?? 0) < 0) throw new Error("Cannot query with negative after or limit.");

  // This beautiful mess allows us to dynamically add conditions to the query based on the options object.
  // NOTE that the query construction here does NOT use standard parameterized queries, because we need to be able to
  // add conditions dynamically. This is still safe because pgprep still uses parameterized queries internally.
  const dbQuery = pgprep(
                `${withAuthor ?
                'SELECT p.*, u.username AS author_username, u.email AS author_email, u.is_admin AS author_is_admin FROM posts p JOIN users u ON p.user_id = u.id' :
                'SELECT * FROM posts'}
                ${slug ? 'WHERE LOWER(slug) LIKE LOWER(${slug})' : ""} 
                ${title ? 'WHERE LOWER(title) LIKE LOWER(${title})' : ""} 
                ${after ? 'AND id > ${after}' : ""} 
                ${limit ? 'LIMIT ${limit}' : ""} 
                ORDER BY updated_at DESC` //TODO: add sorting options
                );
  const dbValues = {
    slug: slug ? `%${slug}%` : null, // Surround with % to allow partial matches.
    title: title ? `%${title}%` : null,
    after,
    limit
  };

  const client = new PG.Client({ connectionString });
  try {
    await client.connect();

    const result = await client.query(dbQuery(dbValues));

    if (result.rows.length > 0) return result.rows;
    else return [];
  } catch (error) {
    throw error; //TODO
  } finally {
    await client.end();
  }

  return []; // This should be impossible.
}

/**
 * Retrieves a post by its slug from the posts table.
 *
 * @param {string} slug The slug of the post to look up.
 * @returns {Promise<Post>} The post object.
 */
export async function getPostBySlug(slug) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = "SELECT p.*, u.username AS author_username, u.email AS author_email, u.is_admin AS author_is_admin FROM posts p JOIN users u ON p.user_id = u.id WHERE slug = $1 LIMIT 1";
    const result = await client.query(query, [slug]);

    if (result.rows.length > 0) return result.rows[0];
    else throw new Error(`No post found for slug "${slug}"`);

  } catch (error) {
    throw new Error(`Error fetching post for slug "${slug}": ${error}`);
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

/**
 * Get user comments for the specified post ID
 *
 * @param {number} postId The post ID to get comments for
 * @returns {Promise<Array<Comment>>} An array of comment objects, if any match the criteria.
 */
export async function getCommentsForPostId(postId) {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = "SELECT * FROM comments WHERE post_id = $1";
    const result = await client.query(query, [postId]);

    if (result.rows.length > 0) return result.rows;
    else return [];

  } catch (error) {
    throw new Error(`Error fetching comments for post ID "${postId}": ${error}`);
  } finally {
    await client.end();
  }
}

/**
 * Gets various interesting statistics about the blog for display on the frontend.
 *
 * @returns {Promise<{users: number, posts: number, comments: number}>} An object containing the number of users, posts, and comments in the database.
 */
export async function getStats() {
  const client = new PG.Client({ connectionString });

  try {
    await client.connect();
    const query = `SELECT
    (SELECT COUNT(*) FROM users) AS users,
    (SELECT COUNT(*) FROM posts) AS posts,
    (SELECT COUNT(*) FROM comments) AS comments;`;
    const result = await client.query(query);

    if (result.rows.length <= 0) throw new Error("No stats found.");

    return result.rows[0];

  } catch (error) {
    throw new Error(`Error fetching stats from DB: ${error}`);
  } finally {
    await client.end();
  }
}
