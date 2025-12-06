const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get all TLDs
router.get('/tlds', async (req, res) => {
  try {
    const tlds = await query(
      `SELECT * FROM domain_tlds WHERE is_active = TRUE ORDER BY sort_order ASC`
    );
    res.json({ tlds });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get TLDs' });
  }
});

// Get popular TLDs
router.get('/tlds/popular', async (req, res) => {
  try {
    const tlds = await query(
      'SELECT * FROM domain_tlds WHERE is_active = TRUE AND is_popular = TRUE ORDER BY sort_order ASC'
    );
    res.json({ tlds });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get popular TLDs' });
  }
});

// Search domain availability (mock - in production connect to registrar API)
router.get('/search', async (req, res) => {
  try {
    const { domain } = req.query;
    
    if (!domain || domain.length < 2) {
      return res.status(400).json({ error: 'Domain name too short' });
    }

    // Clean domain name
    const cleanDomain = domain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    // Get all TLDs
    const tlds = await query(
      'SELECT tld, price_register, price_renew, is_popular, promo_price FROM domain_tlds WHERE is_active = TRUE ORDER BY sort_order ASC LIMIT 20'
    );

    // Mock availability check - in production, integrate with registrar API
    const results = tlds.map(tld => ({
      domain: `${cleanDomain}${tld.tld}`,
      tld: tld.tld,
      available: Math.random() > 0.3, // Mock: 70% available
      price_register: tld.promo_price || tld.price_register,
      price_renew: tld.price_renew,
      is_popular: tld.is_popular,
      is_promo: !!tld.promo_price
    }));

    // Sort: available first, then popular
    results.sort((a, b) => {
      if (a.available !== b.available) return b.available - a.available;
      if (a.is_popular !== b.is_popular) return b.is_popular - a.is_popular;
      return 0;
    });

    res.json({
      query: cleanDomain,
      results
    });
  } catch (err) {
    res.status(500).json({ error: 'Domain search failed' });
  }
});

// Get domain suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || keyword.length < 2) {
      return res.status(400).json({ error: 'Keyword too short' });
    }

    const cleanKeyword = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Get popular TLDs for suggestions
    const tlds = await query(
      'SELECT tld, price_register, promo_price FROM domain_tlds WHERE is_active = TRUE AND is_popular = TRUE ORDER BY sort_order ASC LIMIT 5'
    );

    // Generate suggestions
    const prefixes = ['get', 'my', 'the', 'go', 'try'];
    const suffixes = ['app', 'hub', 'pro', 'io', 'now'];
    
    const suggestions = [];
    
    // Direct suggestions with popular TLDs
    tlds.forEach(tld => {
      suggestions.push({
        domain: `${cleanKeyword}${tld.tld}`,
        price: tld.promo_price || tld.price_register,
        available: Math.random() > 0.3
      });
    });

    // With prefixes
    prefixes.slice(0, 2).forEach(prefix => {
      suggestions.push({
        domain: `${prefix}${cleanKeyword}.com`,
        price: 10.99,
        available: Math.random() > 0.4
      });
    });

    // With suffixes
    suffixes.slice(0, 2).forEach(suffix => {
      suggestions.push({
        domain: `${cleanKeyword}${suffix}.com`,
        price: 10.99,
        available: Math.random() > 0.4
      });
    });

    res.json({
      keyword: cleanKeyword,
      suggestions: suggestions.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Check single domain
router.get('/check/:domain', async (req, res) => {
  try {
    const domain = req.params.domain.toLowerCase();
    
    // Parse domain and TLD
    const parts = domain.split('.');
    if (parts.length < 2) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }
    
    const tld = '.' + parts.slice(1).join('.');
    
    const tlds = await query(
      'SELECT * FROM domain_tlds WHERE tld = ? AND is_active = TRUE',
      [tld]
    );

    if (!tlds.length) {
      return res.status(400).json({ error: 'TLD not supported' });
    }

    // Mock availability - integrate with registrar API in production
    const available = Math.random() > 0.4;

    res.json({
      domain,
      tld: tlds[0].tld,
      available,
      price_register: tlds[0].promo_price || tlds[0].price_register,
      price_renew: tlds[0].price_renew,
      price_transfer: tlds[0].price_transfer
    });
  } catch (err) {
    res.status(500).json({ error: 'Domain check failed' });
  }
});

// WHOIS lookup (mock)
router.get('/whois/:domain', async (req, res) => {
  try {
    const domain = req.params.domain.toLowerCase();
    
    // Mock WHOIS - integrate with WHOIS API in production
    res.json({
      domain,
      registered: Math.random() > 0.5,
      registrar: 'Example Registrar',
      created_date: '2020-01-15',
      expiry_date: '2025-01-15',
      status: ['clientTransferProhibited'],
      nameservers: ['ns1.example.com', 'ns2.example.com']
    });
  } catch (err) {
    res.status(500).json({ error: 'WHOIS lookup failed' });
  }
});

module.exports = router;
