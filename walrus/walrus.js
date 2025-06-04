const walrus = require('walrus-sdk');

walrus.config({
    apiKey: process.env.WALRUS_API_KEY,
});

const uploadToWalrus = async (file) => {
    const blobId = await walrus.upload(file);
    return blobId;
};

const getFromWalrus = async (blobId) => {
    const file = await walrus.get(blobId);
    return file;
};

module.exports = { uploadToWalrus, getFromWalrus };
