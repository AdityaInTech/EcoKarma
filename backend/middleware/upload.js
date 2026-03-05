// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const multer = require('multer');
// require('dotenv').config();

// // 1. Authenticate with your Cloudinary .env keys
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // 2. Configure the storage folder and allowed file types
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'impact_missions', // The folder name in your Cloudinary account
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'] // Allowed image & video formats
//   }
// });

// // 3. Export the Multer middleware
// const upload = multer({ storage: storage });
// module.exports = upload;



const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Authenticate with your Cloudinary .env keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure the storage folder and allowed file types
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'impact_missions', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov'], 
    
    // 🚀 THE MAGIC FIX: This tells Cloudinary to accept BOTH videos and images!
    resource_type: 'auto' 
  }
});

// 3. Export the Multer middleware
const upload = multer({ storage: storage });
module.exports = upload;