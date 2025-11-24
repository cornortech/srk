require("dotenv").config();
const cloudName = "doia6qktn";
const presetKeyForImg = "srkImg";
const presetKeyForVideos = "srkVideo";
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: cloudName,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

module.exports = { cloudinary };
