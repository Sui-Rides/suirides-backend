import pool from '../db.js';

describe('Database Connection', () => {
  it('should connect to the database', async () => {
    const client = await pool.connect();
    expect(client).toBeDefined();
    client.release();
  });
});