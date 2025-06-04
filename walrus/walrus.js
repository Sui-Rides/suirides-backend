const walrus = require('walrus-sdk');

walrus.config({
    apiKey: process.env.WALRUS_API_KEY,
});

const uploadToWalrus = async (file) => {
    const blobId = await walrus.upload(file);
    return blobId;
};

