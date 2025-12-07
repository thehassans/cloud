require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mariadb = require('mariadb');

const migrations = `
-- Disable foreign key checks during migration
SET FOREIGN_KEY_CHECKS = 0;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  company VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  avatar VARCHAR(500),
  role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires DATETIME,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  preferred_language VARCHAR(10) DEFAULT 'en',
  preferred_currency VARCHAR(10) DEFAULT 'USD',
  status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_uuid (uuid),
  INDEX idx_status (status)
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL,
  refresh_token VARCHAR(500),
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token(255)),
  INDEX idx_user_id (user_id)
);

-- Service Categories
CREATE TABLE IF NOT EXISTS service_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_bn VARCHAR(255),
  description_en TEXT,
  description_bn TEXT,
  icon VARCHAR(100),
  image VARCHAR(500),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hosting Plans
CREATE TABLE IF NOT EXISTS hosting_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category_id INT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  features JSON,
  disk_space VARCHAR(50),
  bandwidth VARCHAR(50),
  domains INT DEFAULT 1,
  subdomains INT DEFAULT 0,
  email_accounts INT DEFAULT 1,
  databases INT DEFAULT 1,
  ssl_included BOOLEAN DEFAULT TRUE,
  backup_included BOOLEAN DEFAULT FALSE,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_quarterly DECIMAL(10,2),
  price_semi_annual DECIMAL(10,2),
  price_annual DECIMAL(10,2),
  price_biennial DECIMAL(10,2),
  price_triennial DECIMAL(10,2),
  setup_fee DECIMAL(10,2) DEFAULT 0,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL,
  INDEX idx_category (category_id),
  INDEX idx_active (is_active)
);

-- VPS Plans
CREATE TABLE IF NOT EXISTS vps_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cpu_cores INT NOT NULL,
  ram_gb INT NOT NULL,
  storage_gb INT NOT NULL,
  storage_type ENUM('SSD', 'NVMe', 'HDD') DEFAULT 'SSD',
  bandwidth_tb INT DEFAULT 0,
  ip_addresses INT DEFAULT 1,
  os_options JSON,
  features JSON,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_quarterly DECIMAL(10,2),
  price_semi_annual DECIMAL(10,2),
  price_annual DECIMAL(10,2),
  setup_fee DECIMAL(10,2) DEFAULT 0,
  is_managed BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Cloud Server Plans
CREATE TABLE IF NOT EXISTS cloud_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cpu_cores INT NOT NULL,
  ram_gb INT NOT NULL,
  storage_gb INT NOT NULL,
  storage_type ENUM('SSD', 'NVMe') DEFAULT 'NVMe',
  bandwidth_tb INT DEFAULT 0,
  ip_addresses INT DEFAULT 1,
  auto_scaling BOOLEAN DEFAULT FALSE,
  load_balancer BOOLEAN DEFAULT FALSE,
  os_options JSON,
  features JSON,
  price_hourly DECIMAL(10,4),
  price_monthly DECIMAL(10,2) NOT NULL,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dedicated Server Plans
CREATE TABLE IF NOT EXISTS dedicated_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  processor VARCHAR(255),
  cpu_cores INT NOT NULL,
  ram_gb INT NOT NULL,
  storage_config VARCHAR(255),
  bandwidth_tb INT DEFAULT 0,
  ip_addresses INT DEFAULT 1,
  os_options JSON,
  features JSON,
  price_monthly DECIMAL(10,2) NOT NULL,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  is_managed BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Domain TLDs
CREATE TABLE IF NOT EXISTS domain_tlds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tld VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  price_register DECIMAL(10,2) NOT NULL,
  price_renew DECIMAL(10,2) NOT NULL,
  price_transfer DECIMAL(10,2) NOT NULL,
  min_years INT DEFAULT 1,
  max_years INT DEFAULT 10,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  promo_price DECIMAL(10,2),
  promo_expires DATETIME,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- SSL Certificates
CREATE TABLE IF NOT EXISTS ssl_certificates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('DV', 'OV', 'EV', 'Wildcard', 'Multi-Domain') NOT NULL,
  brand VARCHAR(100),
  warranty_amount DECIMAL(15,2),
  validation_type VARCHAR(50),
  issuance_time VARCHAR(50),
  features JSON,
  price_annual DECIMAL(10,2) NOT NULL,
  price_biennial DECIMAL(10,2),
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Email Plans
CREATE TABLE IF NOT EXISTS email_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  storage_gb INT NOT NULL,
  users_included INT DEFAULT 1,
  features JSON,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2),
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Backup Plans
CREATE TABLE IF NOT EXISTS backup_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  storage_gb INT NOT NULL,
  retention_days INT DEFAULT 30,
  features JSON,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2),
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Datacenters
CREATE TABLE IF NOT EXISTS datacenters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100) NOT NULL,
  country_code VARCHAR(3),
  continent VARCHAR(50),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  description TEXT,
  features JSON,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded', 'fraud') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'partial', 'refunded') DEFAULT 'unpaid',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  coupon_code VARCHAR(50),
  notes TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_order_number (order_number)
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_type ENUM('hosting', 'vps', 'cloud', 'dedicated', 'domain', 'ssl', 'email', 'backup', 'addon') NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  billing_cycle VARCHAR(50),
  domain_name VARCHAR(255),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  setup_fee DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  config_options JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_order (order_id)
);

-- User Services (Active subscriptions)
CREATE TABLE IF NOT EXISTS user_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_id INT,
  order_item_id INT,
  service_type ENUM('hosting', 'vps', 'cloud', 'dedicated', 'domain', 'ssl', 'email', 'backup') NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  domain_name VARCHAR(255),
  server_ip VARCHAR(45),
  username VARCHAR(100),
  status ENUM('pending', 'active', 'suspended', 'terminated', 'cancelled') DEFAULT 'pending',
  billing_cycle VARCHAR(50),
  amount DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  next_due_date DATE,
  registration_date DATE,
  expiry_date DATE,
  auto_renew BOOLEAN DEFAULT TRUE,
  notes TEXT,
  config_options JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_expiry (expiry_date)
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  order_id INT,
  status ENUM('draft', 'unpaid', 'paid', 'cancelled', 'refunded') DEFAULT 'unpaid',
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  due_date DATE,
  paid_date DATETIME,
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);

-- Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  department ENUM('sales', 'billing', 'technical', 'abuse', 'general') DEFAULT 'general',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  subject VARCHAR(255) NOT NULL,
  status ENUM('open', 'answered', 'customer_reply', 'on_hold', 'in_progress', 'closed') DEFAULT 'open',
  related_service_id INT,
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  closed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);

-- Ticket Replies
CREATE TABLE IF NOT EXISTS ticket_replies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ticket_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  attachments JSON,
  is_staff_reply BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ticket (ticket_id)
);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255),
  discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2),
  max_discount DECIMAL(10,2),
  applicable_products JSON,
  usage_limit INT,
  used_count INT DEFAULT 0,
  per_user_limit INT DEFAULT 1,
  start_date DATETIME,
  end_date DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_active (is_active)
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  invoice_id INT,
  order_id INT,
  type ENUM('payment', 'refund', 'credit', 'debit') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  gateway_response JSON,
  status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
);

-- Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json', 'html') DEFAULT 'string',
  category VARCHAR(50),
  description VARCHAR(255),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key),
  INDEX idx_category (category)
);

-- Pages (CMS)
CREATE TABLE IF NOT EXISTS pages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  content_en LONGTEXT,
  content_bn LONGTEXT,
  meta_title_en VARCHAR(255),
  meta_title_bn VARCHAR(255),
  meta_description_en TEXT,
  meta_description_bn TEXT,
  meta_keywords VARCHAR(500),
  featured_image VARCHAR(500),
  template VARCHAR(50) DEFAULT 'default',
  status ENUM('draft', 'published', 'archived') DEFAULT 'published',
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_status (status)
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  category VARCHAR(100),
  question_en TEXT NOT NULL,
  question_bn TEXT,
  answer_en TEXT NOT NULL,
  answer_bn TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Activity Logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
);

-- Email Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject_en VARCHAR(255) NOT NULL,
  subject_bn VARCHAR(255),
  body_en LONGTEXT NOT NULL,
  body_bn LONGTEXT,
  variables JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Currencies
CREATE TABLE IF NOT EXISTS currencies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  exchange_rate DECIMAL(15,6) DEFAULT 1.000000,
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  decimal_places INT DEFAULT 2,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Languages
CREATE TABLE IF NOT EXISTS languages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100),
  flag VARCHAR(10),
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_rtl BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title_en VARCHAR(255) NOT NULL,
  title_bn VARCHAR(255),
  content_en TEXT NOT NULL,
  content_bn TEXT,
  type ENUM('info', 'warning', 'success', 'danger') DEFAULT 'info',
  display_location ENUM('all', 'home', 'dashboard', 'checkout') DEFAULT 'all',
  start_date DATETIME,
  end_date DATETIME,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Media Library
CREATE TABLE IF NOT EXISTS media (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100),
  size INT,
  path VARCHAR(500) NOT NULL,
  thumbnail_path VARCHAR(500),
  webp_path VARCHAR(500),
  alt_text VARCHAR(255),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_uploaded_by (uploaded_by)
);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
`;

async function runMigration() {
  // Check if database is configured
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    console.log('⚠️  Database not configured. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env file');
    console.log('   Skipping migration...');
    process.exit(0); // Exit gracefully, not an error
  }

  let conn;
  try {
    conn = await mariadb.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true,
      connectTimeout: 10000
    });

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'magnetic_clouds';
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${dbName}\``);
    
    // Run migrations
    await conn.query(migrations);
    
    console.log('✅ Database migration completed successfully!');
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      console.log('⚠️  Cannot connect to database. Make sure MariaDB is running.');
      console.log('   Skipping migration...');
      process.exit(0); // Exit gracefully for auto-deploy
    }
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

runMigration();
