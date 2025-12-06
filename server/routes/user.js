const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Update profile
router.put('/profile', [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('address').optional().trim(),
  body('city').optional().trim(),
  body('country').optional().trim(),
  body('postal_code').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { first_name, last_name, phone, company, address, city, country, postal_code } = req.body;

    await query(
      `UPDATE users SET 
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone),
        company = COALESCE(?, company),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        country = COALESCE(?, country),
        postal_code = COALESCE(?, postal_code)
      WHERE id = ?`,
      [first_name, last_name, phone, company, address, city, country, postal_code, req.user.id]
    );

    const users = await query(
      'SELECT uuid, email, first_name, last_name, phone, company, address, city, country, postal_code FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ message: 'Profile updated', user: users[0] });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Change password
router.put('/password', [
  body('current_password').notEmpty(),
  body('new_password').isLength({ min: 8 })
], async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    const users = await query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    
    const valid = await bcrypt.compare(current_password, users[0].password);
    if (!valid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);
    await query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Password change failed' });
  }
});

// Update preferences
router.put('/preferences', async (req, res) => {
  try {
    const { preferred_language, preferred_currency } = req.body;

    await query(
      'UPDATE users SET preferred_language = COALESCE(?, preferred_language), preferred_currency = COALESCE(?, preferred_currency) WHERE id = ?',
      [preferred_language, preferred_currency, req.user.id]
    );

    res.json({ message: 'Preferences updated' });
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Get user services
router.get('/services', async (req, res) => {
  try {
    const services = await query(
      `SELECT id, service_type, product_name, domain_name, status, billing_cycle, 
       amount, currency, next_due_date, expiry_date, auto_renew, created_at
       FROM user_services WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ services });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get services' });
  }
});

// Get user orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await query(
      `SELECT o.id, o.order_number, o.status, o.payment_status, o.total, o.currency, o.created_at,
       (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
       FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

// Get order details
router.get('/orders/:orderNumber', async (req, res) => {
  try {
    const orders = await query(
      'SELECT * FROM orders WHERE order_number = ? AND user_id = ?',
      [req.params.orderNumber, req.user.id]
    );

    if (!orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orders[0].id]
    );

    res.json({ order: orders[0], items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get order' });
  }
});

// Get invoices
router.get('/invoices', async (req, res) => {
  try {
    const invoices = await query(
      `SELECT id, invoice_number, status, total, currency, due_date, paid_date, created_at
       FROM invoices WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ invoices });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get invoices' });
  }
});

// Get support tickets
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await query(
      `SELECT id, ticket_number, department, priority, subject, status, created_at, updated_at
       FROM support_tickets WHERE user_id = ? ORDER BY updated_at DESC`,
      [req.user.id]
    );
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

// Create support ticket
router.post('/tickets', [
  body('subject').trim().notEmpty(),
  body('message').trim().notEmpty(),
  body('department').isIn(['sales', 'billing', 'technical', 'abuse', 'general'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject, message, department, priority, related_service_id } = req.body;
    const ticketNumber = 'TKT-' + Date.now().toString(36).toUpperCase();

    const result = await query(
      `INSERT INTO support_tickets (ticket_number, user_id, department, priority, subject, related_service_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [ticketNumber, req.user.id, department, priority || 'medium', subject, related_service_id || null]
    );

    await query(
      'INSERT INTO ticket_replies (ticket_id, user_id, message) VALUES (?, ?, ?)',
      [result.insertId, req.user.id, message]
    );

    res.status(201).json({ message: 'Ticket created', ticket_number: ticketNumber });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get ticket details with replies
router.get('/tickets/:ticketNumber', async (req, res) => {
  try {
    const tickets = await query(
      'SELECT * FROM support_tickets WHERE ticket_number = ? AND user_id = ?',
      [req.params.ticketNumber, req.user.id]
    );

    if (!tickets.length) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const replies = await query(
      `SELECT tr.*, u.first_name, u.last_name, u.role
       FROM ticket_replies tr
       JOIN users u ON tr.user_id = u.id
       WHERE tr.ticket_id = ?
       ORDER BY tr.created_at ASC`,
      [tickets[0].id]
    );

    res.json({ ticket: tickets[0], replies });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

// Reply to ticket
router.post('/tickets/:ticketNumber/reply', [
  body('message').trim().notEmpty()
], async (req, res) => {
  try {
    const tickets = await query(
      'SELECT id, status FROM support_tickets WHERE ticket_number = ? AND user_id = ?',
      [req.params.ticketNumber, req.user.id]
    );

    if (!tickets.length) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (tickets[0].status === 'closed') {
      return res.status(400).json({ error: 'Ticket is closed' });
    }

    await query(
      'INSERT INTO ticket_replies (ticket_id, user_id, message) VALUES (?, ?, ?)',
      [tickets[0].id, req.user.id, req.body.message]
    );

    await query(
      'UPDATE support_tickets SET status = ?, updated_at = NOW() WHERE id = ?',
      ['customer_reply', tickets[0].id]
    );

    res.json({ message: 'Reply added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [services, orders, tickets, invoices] = await Promise.all([
      query('SELECT COUNT(*) as count FROM user_services WHERE user_id = ? AND status = ?', [req.user.id, 'active']),
      query('SELECT COUNT(*) as count FROM orders WHERE user_id = ?', [req.user.id]),
      query('SELECT COUNT(*) as count FROM support_tickets WHERE user_id = ? AND status != ?', [req.user.id, 'closed']),
      query('SELECT COUNT(*) as count FROM invoices WHERE user_id = ? AND status = ?', [req.user.id, 'unpaid'])
    ]);

    const recentServices = await query(
      'SELECT id, service_type, product_name, domain_name, status, expiry_date FROM user_services WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [req.user.id]
    );

    const recentInvoices = await query(
      'SELECT id, invoice_number, status, total, currency, due_date FROM invoices WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [req.user.id]
    );

    res.json({
      stats: {
        active_services: services[0].count,
        total_orders: orders[0].count,
        open_tickets: tickets[0].count,
        unpaid_invoices: invoices[0].count
      },
      recent_services: recentServices,
      recent_invoices: recentInvoices
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get dashboard' });
  }
});

module.exports = router;
