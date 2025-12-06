const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Ensure upload directories exist
const ensureDir = async (dir) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Get file extension
const getExtension = (mimetype) => {
  const map = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg'
  };
  return map[mimetype] || '.jpg';
};

// Configure multer for disk storage (no sharp needed)
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/images');
    await ensureDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = getExtension(file.mimetype);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  }
});

// Upload single image (admin only)
router.post('/image', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/images/${req.file.filename}`;

    // Save to database
    const result = await query(
      `INSERT INTO media (filename, original_name, mime_type, size, path, thumbnail_path, webp_path, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        filePath,
        filePath, // Use same path for thumbnail (no processing)
        filePath,
        req.user.id
      ]
    );

    res.json({
      message: 'Image uploaded successfully',
      file: {
        id: result.insertId,
        filename: req.file.filename,
        original_name: req.file.originalname,
        path: filePath,
        thumbnail: filePath
      }
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Upload multiple images
router.post('/images', authenticateToken, requireAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const filePath = `/uploads/images/${file.filename}`;

      const result = await query(
        `INSERT INTO media (filename, original_name, mime_type, size, path, thumbnail_path, webp_path, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          file.filename,
          file.originalname,
          file.mimetype,
          file.size,
          filePath,
          filePath,
          filePath,
          req.user.id
        ]
      );

      uploadedFiles.push({
        id: result.insertId,
        filename: file.filename,
        original_name: file.originalname,
        path: filePath,
        thumbnail: filePath
      });
    }

    res.json({
      message: 'Images uploaded successfully',
      files: uploadedFiles
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Get media library
router.get('/media', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const media = await query(
      `SELECT m.*, u.first_name, u.last_name 
       FROM media m 
       LEFT JOIN users u ON m.uploaded_by = u.id 
       ORDER BY m.created_at DESC 
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    const countResult = await query('SELECT COUNT(*) as total FROM media');

    res.json({
      media,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get media' });
  }
});

// Delete media
router.delete('/media/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const media = await query('SELECT * FROM media WHERE id = ?', [req.params.id]);

    if (!media.length) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // Delete files
    const uploadDir = path.join(__dirname, '../..');
    try {
      await fs.unlink(path.join(uploadDir, media[0].path));
      if (media[0].thumbnail_path) {
        await fs.unlink(path.join(uploadDir, media[0].thumbnail_path));
      }
    } catch (err) {
      console.error('File deletion error:', err);
    }

    await query('DELETE FROM media WHERE id = ?', [req.params.id]);

    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

module.exports = router;
