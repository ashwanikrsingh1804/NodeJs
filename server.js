const { Client } = require('pg');

// Connect to PostgreSQL 
 export const client = new Client({
    user: "admin123",
    host: "medicaldb1.c7dcqmwvm5db.us-east-1.rds.amazonaws.com",
    database: "postgres",
    password: "Password#098",
    port: "5432",
});

