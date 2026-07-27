import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3306,
      user: 'lendsqr',
      password: 'lendsqrpassword',
      database: 'lendsqr_wallet',
    });

    console.log('✅ Connected to MySQL');

    await connection.end();
  } catch (error) {
    console.error(error);
  }
}

testConnection();