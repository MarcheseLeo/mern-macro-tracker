const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'macrotrackers_avatars',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], 
        public_id: (req, file) => file.name,
        transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }] 
    }
})

const cloud = multer({ storage: cloudStorage })

module.exports = { cloud }
