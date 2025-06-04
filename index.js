const express = require('express');
const { Pool } = require('pg');
const { SuiClient } = require('mysten/sui.js');
const multer = require('multer');
require('dotenv').config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const suiClient = new SuiClient({ url: process.env.SUI_NODE_URL });
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
    res.send('SuiRides Backend is running');
});

app.listen(3000, () => console.log('Server running on port 3000'));