const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const authMiddleware = require("../middleware/authMiddleware");
const requireAuth = require("../middleware/requireAuth");
const router = express.Router();

// Configure multer to store uploaded files in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

// Configure cloudinary with your credentials
cloudinary.config({
  cloud_name: "deh8mb5ry",
  api_key: "541867638824536",
  api_secret: "bXrhlJ_zIYODlvPzmLlEcnapMtk",
});

// Handle image uploads
router.post(
  "/upload",
  requireAuth,
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      // Upload the image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.buffer, {
        folder: "BananaLocal",
      });

      // Return the URL of the uploaded image
      res.json({
        url: result.secure_url,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

module.exports = router;
