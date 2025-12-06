const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get all hosting plans
router.get('/hosting', async (req, res) => {
  try {
    const plans = await query(
      `SELECT * FROM hosting_plans WHERE is_active = TRUE ORDER BY sort_order ASC`
    );
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get hosting plans' });
  }
});

// Get hosting plan by slug
router.get('/hosting/:slug', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM hosting_plans WHERE slug = ? AND is_active = TRUE',
      [req.params.slug]
    );
    if (!plans.length) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json({ plan: plans[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get plan' });
  }
});

// Get all VPS plans
router.get('/vps', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM vps_plans WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get VPS plans' });
  }
});

// Get VPS plan by slug
router.get('/vps/:slug', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM vps_plans WHERE slug = ? AND is_active = TRUE',
      [req.params.slug]
    );
    if (!plans.length) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json({ plan: plans[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get plan' });
  }
});

// Get all cloud plans
router.get('/cloud', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM cloud_plans WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get cloud plans' });
  }
});

// Get cloud plan by slug
router.get('/cloud/:slug', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM cloud_plans WHERE slug = ? AND is_active = TRUE',
      [req.params.slug]
    );
    if (!plans.length) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json({ plan: plans[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get plan' });
  }
});

// Get all dedicated plans
router.get('/dedicated', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM dedicated_plans WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dedicated plans' });
  }
});

// Get dedicated plan by slug
router.get('/dedicated/:slug', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM dedicated_plans WHERE slug = ? AND is_active = TRUE',
      [req.params.slug]
    );
    if (!plans.length) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.json({ plan: plans[0] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get plan' });
  }
});

// Get SSL certificates
router.get('/ssl', async (req, res) => {
  try {
    const certificates = await query(
      'SELECT * FROM ssl_certificates WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ certificates });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get SSL certificates' });
  }
});

// Get email plans
router.get('/email', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM email_plans WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get email plans' });
  }
});

// Get backup plans
router.get('/backup', async (req, res) => {
  try {
    const plans = await query(
      'SELECT * FROM backup_plans WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get backup plans' });
  }
});

// Get datacenters
router.get('/datacenters', async (req, res) => {
  try {
    const datacenters = await query(
      'SELECT * FROM datacenters WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ datacenters });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get datacenters' });
  }
});

// Get service categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await query(
      'SELECT * FROM service_categories WHERE is_active = TRUE ORDER BY sort_order ASC'
    );
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

module.exports = router;
