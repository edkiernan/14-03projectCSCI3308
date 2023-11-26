const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const upload = multer({ dest: 'uploads/' });
require('dotenv').config(); // To read the .env file
const storage = new Storage();
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
const fs = require('fs').promises;

const uploadPDF = async (file, username) => {
    let pdfFile = null;
    try {
        if (!file) {
            throw new Error('No file uploaded.');
        }
        pdfFile = file.path;
        const destination = `pdf_uploads/${username}/${file.originalname}`;
        await storage.bucket(bucketName).upload(pdfFile, {
            destination: destination,
            metadata: { contentType: 'application/pdf' },
        });
        console.log('File uploaded and stored successfully:', file.originalname);
    } catch (error) {
        console.error('Error uploading file:', error);
    } finally {
        if (pdfFile) {
            try {
                await fs.unlink(pdfFile);
                console.log('Successfully deleted local file');
            } catch (error) {
                console.error('Error deleting local file:', error);
            }
        }
    }
};

const downloadPDF = async (fileName, username) => {
    const filePath = `pdf_uploads/${username}/${fileName}`; 
    try {
        const file = storage.bucket(bucketName).file(filePath);
        const [content] = await file.download();
        return [content];
    } catch (error) {
        if (error.code === 404) {
            console.error('File not found');
            throw new Error('File not found.');
        } else {
            console.error('Error downloading file:', error);
            throw new Error('An error occurred while retrieving the file.');
        }
    }
};

// export
module.exports = {
    uploadPDF,
    downloadPDF
}