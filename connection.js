const sql = require('mysql2');
const conn = sql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shubh@123',
  database: 'test'
});

conn.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully.');
  }
});

module.exports = conn;
