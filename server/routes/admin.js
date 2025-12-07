const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query, transaction } = require('../config/database');
const { authenticateToken, requireAdmin, requireSuperAdmin } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// ==================== DASHBOARD ====================

router.get('/dashboard', async (req, res) => {
  try {
    // Get counts with error handling for each
    let userCount = [{ count: 0 }];
    let orderCount = [{ count: 0 }];
    let activeServices = [{ count: 0 }];
    let revenue = [{ total: 0 }];
    let recentOrders = [];
    let recentTickets = [];
    let monthlyRevenue = [];

    try {
      userCount = await query('SELECT COUNT(*) as count FROM users WHERE role = ?', ['user']);
    } catch (e) { console.log('userCount error:', e.message); }

    try {
      orderCount = await query('SELECT COUNT(*) as count FROM orders');
    } catch (e) { console.log('orderCount error:', e.message); }

    try {
      activeServices = await query('SELECT COUNT(*) as count FROM services WHERE status = ?', ['active']);
    } catch (e) { console.log('activeServices error:', e.message); }

    try {
      revenue = await query('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE payment_status = ?', ['paid']);
    } catch (e) { console.log('revenue error:', e.message); }

    try {
      recentOrders = await query(`SELECT o.*, u.email, u.first_name, u.last_name 
             FROM orders o JOIN users u ON o.user_id = u.id 
             ORDER BY o.created_at DESC LIMIT 10`);
    } catch (e) { console.log('recentOrders error:', e.message); }

    try {
      recentTickets = await query(`SELECT t.*, u.email, u.first_name 
             FROM support_tickets t JOIN users u ON t.user_id = u.id 
             WHERE t.status != 'closed' 
             ORDER BY t.updated_at DESC LIMIT 10`);
    } catch (e) { console.log('recentTickets error:', e.message); }

    try {
      monthlyRevenue = await query(`SELECT DATE_FORMAT(created_at, '%Y-%m') as month, 
             SUM(total) as revenue, COUNT(*) as orders 
             FROM orders WHERE payment_status = 'paid' 
             AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
             GROUP BY month ORDER BY month`);
    } catch (e) { console.log('monthlyRevenue error:', e.message); }

    res.json({
      stats: {
        total_users: userCount[0]?.count || 0,
        total_orders: orderCount[0]?.count || 0,
        active_services: activeServices[0]?.count || 0,
        total_revenue: revenue[0]?.total || 0
      },
      recent_orders: recentOrders || [],
      recent_tickets: recentTickets || [],
      monthly_revenue: monthlyRevenue || []
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// ==================== USERS ====================

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, role } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT id, uuid, email, first_name, last_name, phone, company, 
               role, status, email_verified, last_login, created_at 
               FROM users WHERE 1=1`;
    const params = [];

    if (search) {
      sql += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (role) {
      sql += ' AND role = ?';
      params.push(role);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const users = await query(sql, params);
    const countResult = await query('SELECT COUNT(*) as total FROM users');

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get users' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const users = await query(
      `SELECT id, uuid, email, first_name, last_name, phone, company, address, 
       city, country, postal_code, role, status, email_verified, 
       preferred_language, preferred_currency, last_login, created_at 
       FROM users WHERE id = ?`,
      [req.params.id]
    );

    if (!users.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [services, orders, tickets] = await Promise.all([
      query('SELECT * FROM user_services WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [req.params.id]),
      query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [req.params.id]),
      query('SELECT * FROM support_tickets WHERE user_id = ? ORDER BY created_at DESC LIMIT 10', [req.params.id])
    ]);

    res.json({
      user: users[0],
      services,
      orders,
      tickets
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { first_name, last_name, phone, company, status, role } = req.body;

    // Only super admin can change roles
    if (role && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Cannot change user role' });
    }

    await query(
      `UPDATE users SET 
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone),
        company = COALESCE(?, company),
        status = COALESCE(?, status),
        role = COALESCE(?, role)
       WHERE id = ?`,
      [first_name, last_name, phone, company, status, role, req.params.id]
    );

    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// ==================== ORDERS ====================

router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, payment_status } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT o.*, u.email, u.first_name, u.last_name 
               FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }
    if (payment_status) {
      sql += ' AND o.payment_status = ?';
      params.push(payment_status);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const orders = await query(sql, params);
    const countResult = await query('SELECT COUNT(*) as total FROM orders');

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
});

router.put('/orders/:id', async (req, res) => {
  try {
    const { status, payment_status, notes } = req.body;

    await query(
      `UPDATE orders SET 
        status = COALESCE(?, status),
        payment_status = COALESCE(?, payment_status),
        notes = COALESCE(?, notes)
       WHERE id = ?`,
      [status, payment_status, notes, req.params.id]
    );

    res.json({ message: 'Order updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// ==================== SERVICES/PLANS ====================

// Hosting Plans
router.get('/hosting-plans', async (req, res) => {
  try {
    const plans = await query('SELECT * FROM hosting_plans ORDER BY sort_order ASC');
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

router.post('/hosting-plans', async (req, res) => {
  try {
    const { slug, name, description, features, disk_space, bandwidth, domains, 
            email_accounts, databases, ssl_included, backup_included, 
            price_monthly, price_annual, is_popular, is_active, sort_order } = req.body;

    await query(
      `INSERT INTO hosting_plans (slug, name, description, features, disk_space, bandwidth, 
       domains, email_accounts, databases, ssl_included, backup_included, 
       price_monthly, price_annual, is_popular, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, name, description, JSON.stringify(features), disk_space, bandwidth,
       domains, email_accounts, databases, ssl_included, backup_included,
       price_monthly, price_annual, is_popular, is_active, sort_order]
    );

    res.status(201).json({ message: 'Plan created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

router.put('/hosting-plans/:id', async (req, res) => {
  try {
    const fields = req.body;
    if (fields.features) fields.features = JSON.stringify(fields.features);

    const setClauses = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(fields), req.params.id];

    await query(`UPDATE hosting_plans SET ${setClauses} WHERE id = ?`, values);
    res.json({ message: 'Plan updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

router.delete('/hosting-plans/:id', async (req, res) => {
  try {
    await query('DELETE FROM hosting_plans WHERE id = ?', [req.params.id]);
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

// VPS Plans (similar CRUD)
router.get('/vps-plans', async (req, res) => {
  try {
    const plans = await query('SELECT * FROM vps_plans ORDER BY sort_order ASC');
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get VPS plans' });
  }
});

router.post('/vps-plans', async (req, res) => {
  try {
    const fields = req.body;
    if (fields.os_options) fields.os_options = JSON.stringify(fields.os_options);
    if (fields.features) fields.features = JSON.stringify(fields.features);

    const columns = Object.keys(fields).join(', ');
    const placeholders = Object.keys(fields).map(() => '?').join(', ');
    
    await query(`INSERT INTO vps_plans (${columns}) VALUES (${placeholders})`, Object.values(fields));
    res.status(201).json({ message: 'VPS plan created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create VPS plan' });
  }
});

router.put('/vps-plans/:id', async (req, res) => {
  try {
    const fields = req.body;
    if (fields.os_options) fields.os_options = JSON.stringify(fields.os_options);
    if (fields.features) fields.features = JSON.stringify(fields.features);

    const setClauses = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    await query(`UPDATE vps_plans SET ${setClauses} WHERE id = ?`, [...Object.values(fields), req.params.id]);
    res.json({ message: 'VPS plan updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update VPS plan' });
  }
});

// Domain TLDs
router.get('/domain-tlds', async (req, res) => {
  try {
    const tlds = await query('SELECT * FROM domain_tlds ORDER BY sort_order ASC');
    res.json({ tlds });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get TLDs' });
  }
});

router.post('/domain-tlds', async (req, res) => {
  try {
    const { tld, description, price_register, price_renew, price_transfer, 
            is_popular, is_active, promo_price, sort_order } = req.body;

    await query(
      `INSERT INTO domain_tlds (tld, description, price_register, price_renew, 
       price_transfer, is_popular, is_active, promo_price, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tld, description, price_register, price_renew, price_transfer,
       is_popular, is_active, promo_price, sort_order]
    );

    res.status(201).json({ message: 'TLD created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create TLD' });
  }
});

router.put('/domain-tlds/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    await query(`UPDATE domain_tlds SET ${setClauses} WHERE id = ?`, [...Object.values(fields), req.params.id]);
    res.json({ message: 'TLD updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update TLD' });
  }
});

// ==================== SUPPORT TICKETS ====================

router.get('/tickets', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, department, priority } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT t.*, u.email, u.first_name, u.last_name 
               FROM support_tickets t JOIN users u ON t.user_id = u.id WHERE 1=1`;
    const params = [];

    if (status) {
      sql += ' AND t.status = ?';
      params.push(status);
    }
    if (department) {
      sql += ' AND t.department = ?';
      params.push(department);
    }
    if (priority) {
      sql += ' AND t.priority = ?';
      params.push(priority);
    }

    sql += ' ORDER BY t.updated_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const tickets = await query(sql, params);
    const countResult = await query('SELECT COUNT(*) as total FROM support_tickets');

    res.json({
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get tickets' });
  }
});

router.get('/tickets/:id', async (req, res) => {
  try {
    const tickets = await query(
      `SELECT t.*, u.email, u.first_name, u.last_name 
       FROM support_tickets t JOIN users u ON t.user_id = u.id 
       WHERE t.id = ?`,
      [req.params.id]
    );

    if (!tickets.length) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const replies = await query(
      `SELECT r.*, u.first_name, u.last_name, u.role 
       FROM ticket_replies r JOIN users u ON r.user_id = u.id 
       WHERE r.ticket_id = ? ORDER BY r.created_at ASC`,
      [req.params.id]
    );

    res.json({ ticket: tickets[0], replies });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

router.post('/tickets/:id/reply', async (req, res) => {
  try {
    const { message } = req.body;

    await query(
      'INSERT INTO ticket_replies (ticket_id, user_id, message, is_staff_reply) VALUES (?, ?, ?, TRUE)',
      [req.params.id, req.user.id, message]
    );

    await query(
      'UPDATE support_tickets SET status = ?, updated_at = NOW() WHERE id = ?',
      ['answered', req.params.id]
    );

    res.json({ message: 'Reply added' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reply' });
  }
});

router.put('/tickets/:id', async (req, res) => {
  try {
    const { status, priority, assigned_to } = req.body;

    let sql = 'UPDATE support_tickets SET ';
    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
      if (status === 'closed') {
        updates.push('closed_at = NOW()');
      }
    }
    if (priority) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to || null);
    }

    updates.push('updated_at = NOW()');
    sql += updates.join(', ') + ' WHERE id = ?';
    params.push(req.params.id);

    await query(sql, params);
    res.json({ message: 'Ticket updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

// ==================== SETTINGS ====================

router.get('/settings', async (req, res) => {
  try {
    const settings = await query('SELECT * FROM site_settings ORDER BY category, setting_key');
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

router.put('/settings', requireSuperAdmin, async (req, res) => {
  try {
    const { settings } = req.body;

    for (const [key, value] of Object.entries(settings)) {
      await query(
        'UPDATE site_settings SET setting_value = ? WHERE setting_key = ?',
        [typeof value === 'object' ? JSON.stringify(value) : String(value), key]
      );
    }

    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ==================== PAGES ====================

router.get('/pages', async (req, res) => {
  try {
    const pages = await query('SELECT * FROM pages ORDER BY title_en ASC');
    res.json({ pages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get pages' });
  }
});

router.post('/pages', async (req, res) => {
  try {
    const { slug, title_en, title_bn, content_en, content_bn, 
            meta_title_en, meta_description_en, status } = req.body;

    await query(
      `INSERT INTO pages (slug, title_en, title_bn, content_en, content_bn, 
       meta_title_en, meta_description_en, status, author_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, title_en, title_bn, content_en, content_bn,
       meta_title_en, meta_description_en, status || 'draft', req.user.id]
    );

    res.status(201).json({ message: 'Page created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create page' });
  }
});

router.put('/pages/:id', async (req, res) => {
  try {
    const fields = req.body;
    const setClauses = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    await query(`UPDATE pages SET ${setClauses} WHERE id = ?`, [...Object.values(fields), req.params.id]);
    res.json({ message: 'Page updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update page' });
  }
});

router.delete('/pages/:id', async (req, res) => {
  try {
    await query('DELETE FROM pages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

// ==================== COUPONS ====================

router.get('/coupons', async (req, res) => {
  try {
    const coupons = await query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get coupons' });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const { code, description, discount_type, discount_value, min_order_amount,
            max_discount, usage_limit, per_user_limit, start_date, end_date, is_active } = req.body;

    await query(
      `INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount,
       max_discount, usage_limit, per_user_limit, start_date, end_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code.toUpperCase(), description, discount_type, discount_value, min_order_amount,
       max_discount, usage_limit, per_user_limit, start_date, end_date, is_active]
    );

    res.status(201).json({ message: 'Coupon created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

router.put('/coupons/:id', async (req, res) => {
  try {
    const fields = req.body;
    if (fields.code) fields.code = fields.code.toUpperCase();
    const setClauses = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    await query(`UPDATE coupons SET ${setClauses} WHERE id = ?`, [...Object.values(fields), req.params.id]);
    res.json({ message: 'Coupon updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

router.delete('/coupons/:id', async (req, res) => {
  try {
    await query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

// ==================== ACTIVITY LOGS ====================

router.get('/activity-logs', async (req, res) => {
  try {
    const { page = 1, limit = 50, action, user_id } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT l.*, u.email, u.first_name 
               FROM activity_logs l 
               LEFT JOIN users u ON l.user_id = u.id WHERE 1=1`;
    const params = [];

    if (action) {
      sql += ' AND l.action = ?';
      params.push(action);
    }
    if (user_id) {
      sql += ' AND l.user_id = ?';
      params.push(user_id);
    }

    sql += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const logs = await query(sql, params);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get logs' });
  }
});

module.exports = router;
