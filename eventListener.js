import { SuiClient } from '@mysten/sui.js';
import pool from './db.js';
import { log, error } from './logger.js';

const suiClient = new SuiClient({ url: ProcessingInstruction.env.SUI_NODE_URL });

const startEventListener = async () => {
    try {
        await suiClient.subscribeEvent({
            filter: {
                MoveEventModule: {
                    package: '0xPACKAGE_ID', // To be replaced with smart contract package ID
                    module: 'identity',
                },
            },
            onMessage: async (event) => {
                if (event.type === 'UserRegistered') {
                    const { user_id, kyc_blob_id } = event.parsedJson;
                    try {
                        await pool.query (
                            'INSERT INTO users (waller, kyc_blob_id, reputation) VALUES ($1, $2, $3) ON CONFLICT (wallet) DO NOTHING',
                            [user_id, kyc_blob_id, 1000]
                        );
                        log(`Registered user ${user_id} with KYC blob ID ${kyc_blob_id}`);
                    } catch (dbErr) {
                        error(`Database error: ${dbErr.message}`);
                    }
                }
                // Handles for other event types
            },
        });
        log('Event listener started');
    } catch (err) {
        error(`Failed to start event listener: ${err.message}`);
    }
};

export default startEventListener;