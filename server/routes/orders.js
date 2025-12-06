const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// Get all orders for user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let sql = `SELECT o.*, 
               (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
               FROM orders o WHERE o.user_id = ?`;
    const params = [req.user.id];

    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const orders = await query(sql, params);

    const countResult = await query(
      'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
      [req.user.id]
    );

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

// Get order by number
router.get('/:orderNumber', async (req, res) => {
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

// Cancel order (only if pending)
router.post('/:orderNumber/cancel', async (req, res) => {
  try {
    const orders = await query(
      'SELECT * FROM orders WHERE order_number = ? AND user_id = ? AND status = ?',
      [req.params.orderNumber, req.user.id, 'pending']
    );

    if (!orders.length) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    await query(
      'UPDATE orders SET status = ? WHERE id = ?',
      ['cancelled', orders[0].id]
    );

    await query(
      'UPDATE invoices SET status = ? WHERE order_id = ?',
      ['cancelled', orders[0].id]
    );

    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

module.exports = router;
