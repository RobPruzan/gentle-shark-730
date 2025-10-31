import { connect } from '@planetscale/database';

export const db = connect({
  url: process.env.DATABASE_URL || '',
});

export async function initializeDatabase() {
  try {
    // Check if tables exist by querying them
    try {
      await db.execute('SELECT 1 FROM messages LIMIT 1');
    } catch {
      // Table doesn't exist, create it
      await db.execute(`
        CREATE TABLE messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_created_at (created_at)
        )
      `);
    }

    try {
      await db.execute('SELECT 1 FROM predictions LIMIT 1');
    } catch {
      await db.execute(`
        CREATE TABLE predictions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          question TEXT NOT NULL,
          prediction_value DECIMAL(5,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved BOOLEAN DEFAULT FALSE,
          INDEX idx_created_at (created_at)
        )
      `);
    }

    try {
      await db.execute('SELECT 1 FROM votes LIMIT 1');
    } catch {
      await db.execute(`
        CREATE TABLE votes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          prediction_id INT NOT NULL,
          username VARCHAR(255) NOT NULL,
          vote_type ENUM('up', 'down') NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_user_vote (prediction_id, username)
        )
      `);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}
