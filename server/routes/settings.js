const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get public settings
router.get('/public', async (req, res) => {
  try {
    let settingsObj = {
      // Default settings if database not ready
      site_name: 'Magnetic Clouds',
      site_description: 'Premium Hosting & Domain Provider',
      theme: 'gradient',
      default_currency: 'USD',
      default_language: 'en'
    };

    try {
      const settings = await query(
        'SELECT setting_key, setting_value, setting_type FROM site_settings WHERE is_public = TRUE'
      );

      if (settings && settings.length > 0) {
        settings.forEach(s => {
          let value = s.setting_value;
          if (s.setting_type === 'boolean') {
            value = value === 'true';
          } else if (s.setting_type === 'number') {
            value = parseFloat(value);
          } else if (s.setting_type === 'json') {
            try { value = JSON.parse(value); } catch (e) { }
          }
          settingsObj[s.setting_key] = value;
        });
      }
    } catch (dbErr) {
      console.error('Database not ready, using defaults:', dbErr.message);
    }

    res.json({ settings: settingsObj });
  } catch (err) {
    console.error('Settings error:', err);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Get currencies
router.get('/currencies', async (req, res) => {
  try {
    const currencies = await query(
      'SELECT code, name, symbol, exchange_rate, is_default FROM currencies WHERE is_active = TRUE ORDER BY is_default DESC, name ASC'
    );
    res.json({ currencies });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get currencies' });
  }
});

// Get languages
router.get('/languages', async (req, res) => {
  try {
    const languages = await query(
      'SELECT code, name, native_name, flag, is_default, is_rtl FROM languages WHERE is_active = TRUE ORDER BY is_default DESC, name ASC'
    );
    res.json({ languages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get languages' });
  }
});

// Get active announcements
router.get('/announcements', async (req, res) => {
  try {
    const { location } = req.query;
    
    let sql = `SELECT id, title_en, title_bn, content_en, content_bn, type 
               FROM announcements 
               WHERE is_active = TRUE 
               AND (start_date IS NULL OR start_date <= NOW())
               AND (end_date IS NULL OR end_date >= NOW())`;
    
    if (location) {
      sql += ` AND (display_location = 'all' OR display_location = ?)`;
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const announcements = await query(sql, location ? [location] : []);
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get announcements' });
  }
});

// Get FAQs
router.get('/faqs', async (req, res) => {
  try {
    const { category } = req.query;
    
    let sql = 'SELECT * FROM faqs WHERE is_active = TRUE';
    const params = [];
    
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    
    sql += ' ORDER BY sort_order ASC';
    
    const faqs = await query(sql, params);
    res.json({ faqs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get FAQs' });
  }
});

module.exports = router;
