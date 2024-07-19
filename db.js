const sql = require('mssql');

// Configuration object for SQL Server connection
const config = {
  user: 'serveradmin',
  password: 'shubh.vyas@123',
  server: 'appserver23.database.windows.net',
  database: 'appDatabase',
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true, // Change to true for local dev/test
  },
};

// Async function to connect to SQL Server
async function connect() {
  try {
    await sql.connect(config);
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Error connecting to SQL Server', err.message);
    process.exit(1); // Exit process with failure
  }
}

// Function to insert form data into SQL Server
async function insertFormData(name, age, work, email, phone, address) {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Name', sql.NVarChar, name)
      .input('Age', sql.Int, age)
      .input('Work', sql.NVarChar, work)
      .input('Email', sql.NVarChar, email)
      .input('Phone', sql.NVarChar, phone)
      .input('Address', sql.NVarChar, address)
      .query('INSERT INTO FormData (Name, Age, Work, Email, Phone, Address) VALUES (@Name, @Age, @Work, @Email, @Phone, @Address)');
    
    console.log('Inserted into database:', result.rowsAffected);
    return result.rowsAffected;
  } catch (err) {
    console.error('Error inserting form data', err.message);
    return 0; // Return 0 or handle error as needed
  }
}

// Function to fetch all form data from SQL Server
async function getAllFormData() {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM FormData');
    return result.recordset; // Return the fetched records
  } catch (err) {
    console.error('Error fetching form data', err.message);
    return []; // Return empty array or handle error as needed
  }
}

module.exports = {
  connect,
  insertFormData,
  getAllFormData,
};
