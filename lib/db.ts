import { connect } from '@planetscale/database';

export const db = connect({
  url: process.env.DATABASE_URL || '',
});

// SQL statements to create tables - run these in PlanetScale dashboard
export const createTableSQL = `
-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at)
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  question TEXT NOT NULL,
  prediction_value DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved BOOLEAN DEFAULT FALSE,
  INDEX idx_created_at (created_at)
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prediction_id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  vote_type ENUM('up', 'down') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_vote (prediction_id, username)
);
`;

export async function initializeDatabase() {
  try {
    // Just verify the database connection works
    await db.execute('SELECT 1 as test');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}
