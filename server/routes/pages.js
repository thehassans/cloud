const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get page by slug
router.get('/:slug', async (req, res) => {
  try {
    const pages = await query(
      `SELECT slug, title_en, title_bn, content_en, content_bn, 
       meta_title_en, meta_title_bn, meta_description_en, meta_description_bn, 
       meta_keywords, featured_image, template 
       FROM pages WHERE slug = ? AND status = 'published'`,
      [req.params.slug]
    );

    if (!pages.length) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ page: pages[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get page' });
  }
});

// Get all published pages (for sitemap/navigation)
router.get('/', async (req, res) => {
  try {
    const pages = await query(
      `SELECT slug, title_en, title_bn, meta_title_en, meta_description_en, updated_at 
       FROM pages WHERE status = 'published' ORDER BY title_en ASC`
    );
    res.json({ pages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get pages' });
  }
});

module.exports = router;
