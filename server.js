const express = require('express');
const bodyParser = require('body-parser');
const { connect, insertFormData, getAllFormData } = require('./db'); // Adjust path as needed

const app = express();
const port = 3000; // Choose your desired port number

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to SQL Server on server start
connect().catch(err => console.error('Database connection error', err));

// POST endpoint to insert form data
app.post('/api/formdata', async (req, res) => {
  const { name, age, work, email, phone, address } = req.body;

  // Validate data (add more validation as needed)
  if (!name || !age || !work || !email || !phone || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Call insertFormData function to insert data into SQL Server
  const rowsAffected = await insertFormData(name, age, work, email, phone, address);

  if (rowsAffected > 0) {
    res.status(201).json({ message: 'Form data inserted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to insert form data' });
  }
});

// GET endpoint to fetch all form data
app.get('/api/formdata', async (req, res) => {
  try {
    const formData = await getAllFormData();
    res.json(formData);
  } catch (err) {
    console.error('Error fetching form data', err);
    res.status(500).json({ error: 'Failed to fetch form data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
