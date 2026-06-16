import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'hayaibu_talent',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });


// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'backend_user',
//   password: 'admin@123',
//   database: 'hayaibu_talent',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

const isLocal = process.env.IS_LOCAL === 'true';

console.log(isLocal ? 'Running in local environment' : 'Running in production environment');
const pool = mysql.createPool({
  host: 'localhost',
  user: isLocal ? 'root' : 'backend_user',
  password: isLocal ? '' : 'admin@123',
  database: 'hayaibu_talent',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
