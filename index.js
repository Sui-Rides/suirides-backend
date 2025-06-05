import express  from 'express';
import { Pool } from 'pg';
import { SuiClient } from '@mysten/sui/client';
import multer from 'multer';
import dotenv from 'dotenv';
import { log, error }  from './logger.js'

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const suiClient = new SuiClient({ url: process.env.SUI_NODE_URL });
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

import { uploadToWalrus } from './walrus.js';
import startEventListener from './eventListener.js';

app.post('/upload-kyc', upload.single('file'), async (req, res) => {
    const { wallet } = req.body;
    const file = req.file;

    if (!wallet || !file) {
        return req.status(400).json({ error: 'Wallet and file are required' });
    }

    try {
        const blobId = await uploadToWalrus(file);
        await pool.query(
            'INSERT INTO users (wallet, kyc_blob_id, reputation) VALUES ($1, $2, $3) ON CONFLICT (wallet) DO UPDATE SET kyc_blob_id = $2',
            [wallet, blobId, 1000]
        );
        res.status(200).json({ message: 'KYC uploaded succefully', blobId });
    } catch (err) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload KYC' });
    }
});

app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({ time: result.rows[0].now});
    } catch (err) {
        err(`Database connection error: ${err.message}`);
        res.status(500).json({ error: 'Database connection failed'});
    }
});


// Test endpoint
app.get('/', (req, res) => {
    res.send('SuiRides Backend is running');
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    log(`Server running on port ${PORT}`);
    await startEventListener();
});