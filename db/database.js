const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const pool = new Pool({
  user: 'avnadmin',
  password: ,
  host: 'pg-25411603-socialmedia.a.aivencloud.com',
  port: 23220, // default Postgres port
  database: 'social_media',
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname,'./ca.pem')).toString(),
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
