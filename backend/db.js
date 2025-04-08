const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();  // Load environment variables from .env file

// Get DB URL from environment variable (without ssl-mode)
const dbUrl = process.env.DB_URL;
const sslCertPath = process.env.SSL_CA_PATH;

// Read the SSL certificate
const sslCert = fs.readFileSync(sslCertPath);

// Parse the URL to extract host, user, password, and database
const url = new URL(dbUrl);

// Create the connection pool with explicit SSL configuration
const pool =new Pool({
  host: url.hostname,
  user: url.username,
  password: url.password,
  database: "defaultdb",  // Remove the leading "/" from the database name
  port: url.port,
  ssl: {
    ca: sslCert,  // SSL certificate for secure connection
    rejectUnauthorized: true,  // Ensure the server's certificate is valid
  },
  
  max: 3,  // Change these when deploy
  idleTimeoutMillis: 10000,  // Reduce to 10s to free idle connections faster
  connectionTimeoutMillis: 5000, // Increase from 2000 to 10000ms
});

// Log pool stats periodically
// setInterval(() => {
//   console.log({
//     total: pool.totalCount,  // Total connections open
//     idle: pool.idleCount,    // Available connections
//     waiting: pool.waitingCount,  // Requests waiting for a connection
//   });
// }, 5000);  // Every 5 seconds

module.exports = pool;