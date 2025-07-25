const { v2: cloudinary } = require("cloudinary");
const {config} = require("dotenv")

config();

cloudinary.config({
cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
api_key:process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINAR_CLOUD_SECRET,
})

module.exports= {cloudinary}