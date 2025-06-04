const express = require('express');
const { Pool } = require('pg');
const { SuiClient } = require('mysten/sui.js');
const multer = require('multer');
const { uploadToWalrus } = require('./walrus/walrus');
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


app.post('/uploaf-kyc', upload.single('file'), async (req, res) => {
    const { wallet } = req.body;
    const file = req.file;

    if (!wallet || !file) {
        return req.statusCode(400).json({ error: 'Wallet and file are required' });
    }

    try {
        const blobId = await uploadToWalrus(file);
        await pool.query(
            'INSERT INTO users (wallet, kyc_blob_id, reputation) VALUES ($1, $2, $3) ON CONFLICT (wallet) DO UPDATE SET kyc_blob_id = $2',
            [wallet, blobId, 1000]
        );
        res.status(200).json({ message: 'KYC uploaded succefullly', blobId });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload KYC' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));