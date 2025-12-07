require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function resetDatabase() {
  console.log('🔧 Starting database reset...');
  
  const conn = await mariadb.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'magnetic_clouds',
    multipleStatements: true
  });

  try {
    // Disable FK checks
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Get all tables
    const tables = await conn.query('SHOW TABLES');
    const dbName = process.env.DB_NAME || 'magnetic_clouds';
    const tableKey = `Tables_in_${dbName}`;
    
    // Drop all tables
    for (const row of tables) {
      const tableName = row[tableKey];
      if (tableName) {
        await conn.query(`DROP TABLE IF EXISTS \`${tableName}\``);
        console.log(`  Dropped: ${tableName}`);
      }
    }
    
    console.log('✅ All tables dropped');
    
    // Create all tables
    const createTables = `
      CREATE TABLE users (
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
        status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
        last_login DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE sessions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        refresh_token VARCHAR(500),
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE languages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        native_name VARCHAR(100),
        flag VARCHAR(10),
        is_default BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE
      ) ENGINE=InnoDB;

      CREATE TABLE currencies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        exchange_rate DECIMAL(10,6) DEFAULT 1.000000,
        is_default BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE
      ) ENGINE=InnoDB;

      CREATE TABLE service_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        name_bn VARCHAR(255),
        description_en TEXT,
        description_bn TEXT,
        icon VARCHAR(100),
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE
      ) ENGINE=InnoDB;

      CREATE TABLE hosting_plans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id INT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        features JSON,
        disk_space VARCHAR(50),
        bandwidth VARCHAR(50),
        domains INT DEFAULT 1,
        email_accounts INT DEFAULT 5,
        databases_count INT DEFAULT 2,
        ssl_included BOOLEAN DEFAULT TRUE,
        backup_included BOOLEAN DEFAULT TRUE,
        price_monthly DECIMAL(10,2),
        price_annual DECIMAL(10,2),
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE vps_plans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cpu_cores INT,
        ram_gb INT,
        storage_gb INT,
        storage_type VARCHAR(20) DEFAULT 'SSD',
        bandwidth_tb INT,
        ip_addresses INT DEFAULT 1,
        os_options JSON,
        features JSON,
        price_monthly DECIMAL(10,2),
        price_annual DECIMAL(10,2),
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE cloud_plans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cpu_cores INT,
        ram_gb INT,
        storage_gb INT,
        storage_type VARCHAR(20) DEFAULT 'SSD',
        bandwidth_tb INT,
        ip_addresses INT DEFAULT 1,
        auto_scaling BOOLEAN DEFAULT FALSE,
        os_options JSON,
        features JSON,
        price_hourly DECIMAL(10,4),
        price_monthly DECIMAL(10,2),
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE dedicated_plans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        cpu_model VARCHAR(255),
        cpu_cores INT,
        ram_gb INT,
        storage_config VARCHAR(255),
        bandwidth_tb INT,
        ip_addresses INT DEFAULT 1,
        features JSON,
        price_monthly DECIMAL(10,2),
        setup_fee DECIMAL(10,2) DEFAULT 0,
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE domain_tlds (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tld VARCHAR(20) UNIQUE NOT NULL,
        price_register DECIMAL(10,2),
        price_renew DECIMAL(10,2),
        price_transfer DECIMAL(10,2),
        promo_price DECIMAL(10,2),
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE ssl_plans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        validation_type ENUM('DV', 'OV', 'EV') DEFAULT 'DV',
        warranty DECIMAL(15,2),
        domains_included INT DEFAULT 1,
        wildcard BOOLEAN DEFAULT FALSE,
        features JSON,
        price_annual DECIMAL(10,2),
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE email_plans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        storage_gb INT,
        accounts INT,
        features JSON,
        price_monthly DECIMAL(10,2),
        price_annual DECIMAL(10,2),
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE backup_plans (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        storage_gb INT,
        retention_days INT,
        frequency VARCHAR(50),
        features JSON,
        price_monthly DECIMAL(10,2),
        price_annual DECIMAL(10,2),
        is_popular BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        subtotal DECIMAL(10,2),
        discount DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2),
        status ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
        payment_method VARCHAR(50),
        payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
        notes TEXT,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE order_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        order_id INT NOT NULL,
        product_type VARCHAR(50),
        product_id INT,
        product_name VARCHAR(255),
        billing_cycle VARCHAR(20),
        quantity INT DEFAULT 1,
        price DECIMAL(10,2),
        discount DECIMAL(10,2) DEFAULT 0,
        config_options JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE services (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        order_id INT,
        service_type VARCHAR(50),
        product_id INT,
        product_name VARCHAR(255),
        domain VARCHAR(255),
        username VARCHAR(100),
        password_encrypted TEXT,
        server_id INT,
        ip_address VARCHAR(45),
        status ENUM('pending', 'active', 'suspended', 'cancelled', 'terminated') DEFAULT 'pending',
        billing_cycle VARCHAR(20),
        amount DECIMAL(10,2),
        next_due_date DATE,
        expiry_date DATE,
        auto_renew BOOLEAN DEFAULT TRUE,
        config_options JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE domains (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        order_id INT,
        domain_name VARCHAR(255) UNIQUE NOT NULL,
        tld VARCHAR(20),
        registrar VARCHAR(100),
        registration_date DATE,
        expiry_date DATE,
        auto_renew BOOLEAN DEFAULT TRUE,
        status ENUM('pending', 'active', 'expired', 'transferred', 'cancelled') DEFAULT 'pending',
        nameservers JSON,
        dns_records JSON,
        whois_privacy BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE support_tickets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ticket_number VARCHAR(20) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        department VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        status ENUM('open', 'answered', 'customer_reply', 'on_hold', 'closed') DEFAULT 'open',
        assigned_to INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        closed_at DATETIME
      ) ENGINE=InnoDB;

      CREATE TABLE ticket_replies (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ticket_id INT NOT NULL,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        attachments JSON,
        is_staff_reply BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE ticket_departments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        email VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE invoices (
        id INT PRIMARY KEY AUTO_INCREMENT,
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        order_id INT,
        subtotal DECIMAL(10,2),
        discount DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2),
        status ENUM('draft', 'pending', 'paid', 'cancelled', 'refunded') DEFAULT 'pending',
        due_date DATE,
        paid_date DATETIME,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE transactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        transaction_id VARCHAR(100) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        invoice_id INT,
        order_id INT,
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        payment_method VARCHAR(50),
        gateway_response JSON,
        status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE coupons (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2),
        max_discount DECIMAL(10,2),
        usage_limit INT,
        used_count INT DEFAULT 0,
        valid_from DATETIME,
        valid_until DATETIME,
        applicable_products JSON,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE pages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_bn VARCHAR(255),
        content_en LONGTEXT,
        content_bn LONGTEXT,
        meta_title VARCHAR(255),
        meta_description TEXT,
        status ENUM('draft', 'published') DEFAULT 'draft',
        author_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE faqs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category VARCHAR(100),
        question_en TEXT NOT NULL,
        question_bn TEXT,
        answer_en TEXT NOT NULL,
        answer_bn TEXT,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE site_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(20) DEFAULT 'text',
        category VARCHAR(50) DEFAULT 'general',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE datacenters (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        country VARCHAR(100),
        country_code VARCHAR(10),
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        features JSON,
        is_active BOOLEAN DEFAULT TRUE,
        sort_order INT DEFAULT 0
      ) ENGINE=InnoDB;

      CREATE TABLE media (
        id INT PRIMARY KEY AUTO_INCREMENT,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        mime_type VARCHAR(100),
        size INT,
        path VARCHAR(500) NOT NULL,
        thumbnail_path VARCHAR(500),
        alt_text VARCHAR(255),
        uploaded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;

      CREATE TABLE activity_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(50),
        entity_id INT,
        old_values JSON,
        new_values JSON,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `;
    
    await conn.query(createTables);
    console.log('✅ All tables created');

    // Re-enable FK checks
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@magneticclouds.com';
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 12);
    
    await conn.query(`
      INSERT INTO users (uuid, email, password, first_name, last_name, role, email_verified, status)
      VALUES (?, ?, ?, 'Super', 'Admin', 'super_admin', TRUE, 'active')
    `, [uuidv4(), adminEmail, adminPassword]);
    console.log('✅ Admin user created: ' + adminEmail);

    // Insert basic data
    await conn.query(`
      INSERT INTO languages (code, name, native_name, flag, is_default, is_active) VALUES
      ('en', 'English', 'English', '🇺🇸', TRUE, TRUE),
      ('bn', 'Bengali', 'বাংলা', '🇧🇩', FALSE, TRUE)
    `);

    await conn.query(`
      INSERT INTO currencies (code, name, symbol, exchange_rate, is_default, is_active) VALUES
      ('USD', 'US Dollar', '$', 1.000000, TRUE, TRUE),
      ('BDT', 'Bangladeshi Taka', '৳', 110.000000, FALSE, TRUE)
    `);

    await conn.query(`
      INSERT INTO ticket_departments (name, description, is_active, sort_order) VALUES
      ('Sales', 'Pre-sales questions', TRUE, 1),
      ('Technical Support', 'Technical issues', TRUE, 2),
      ('Billing', 'Billing inquiries', TRUE, 3)
    `);

    await conn.query(`
      INSERT INTO domain_tlds (tld, price_register, price_renew, price_transfer, is_popular, is_active, sort_order) VALUES
      ('.com', 12.99, 14.99, 12.99, TRUE, TRUE, 1),
      ('.net', 14.99, 16.99, 14.99, TRUE, TRUE, 2),
      ('.org', 12.99, 14.99, 12.99, TRUE, TRUE, 3),
      ('.io', 39.99, 39.99, 39.99, TRUE, TRUE, 4),
      ('.co', 29.99, 29.99, 29.99, FALSE, TRUE, 5),
      ('.dev', 15.99, 15.99, 15.99, FALSE, TRUE, 6)
    `);

    await conn.query(`
      INSERT INTO site_settings (setting_key, setting_value, category) VALUES
      ('site_name', 'Magnetic Clouds', 'general'),
      ('site_tagline', 'Premium Hosting Solutions', 'general'),
      ('contact_email', 'support@magneticclouds.com', 'contact'),
      ('contact_phone', '+880 1234 567890', 'contact')
    `);

    // Insert Service Categories
    await conn.query(`
      INSERT INTO service_categories (slug, name_en, name_bn, description_en, icon, sort_order, is_active) VALUES
      ('web-hosting', 'Web Hosting', 'ওয়েব হোস্টিং', 'Fast and reliable web hosting', 'Server', 1, TRUE),
      ('vps-servers', 'VPS Servers', 'ভিপিএস সার্ভার', 'Virtual Private Servers', 'HardDrive', 2, TRUE),
      ('cloud-servers', 'Cloud Servers', 'ক্লাউড সার্ভার', 'Scalable cloud infrastructure', 'Cloud', 3, TRUE),
      ('dedicated-servers', 'Dedicated Servers', 'ডেডিকেটেড সার্ভার', 'Powerful dedicated hardware', 'Server', 4, TRUE)
    `);

    // Insert Hosting Plans
    await conn.query(`
      INSERT INTO hosting_plans (category_id, slug, name, description, features, disk_space, bandwidth, domains, email_accounts, databases_count, ssl_included, backup_included, price_monthly, price_annual, is_popular, is_active, sort_order) VALUES
      (1, 'starter', 'Starter', 'Perfect for personal websites', '["1 Website", "10GB SSD Storage", "Free SSL", "Daily Backups"]', '10GB', 'Unlimited', 1, 5, 2, TRUE, TRUE, 2.99, 29.99, FALSE, TRUE, 1),
      (1, 'business', 'Business', 'Ideal for small businesses', '["5 Websites", "50GB SSD Storage", "Free SSL", "Daily Backups", "Free Domain"]', '50GB', 'Unlimited', 5, 25, 10, TRUE, TRUE, 5.99, 59.99, TRUE, TRUE, 2),
      (1, 'professional', 'Professional', 'For high-traffic websites', '["Unlimited Websites", "100GB NVMe", "Free SSL", "Daily Backups", "Free Domain", "Priority Support"]', '100GB', 'Unlimited', -1, 100, 50, TRUE, TRUE, 9.99, 99.99, FALSE, TRUE, 3),
      (1, 'enterprise', 'Enterprise', 'Maximum power and resources', '["Unlimited Websites", "250GB NVMe", "Free SSL", "Hourly Backups", "Free Domain", "Dedicated Support"]', '250GB', 'Unlimited', -1, -1, -1, TRUE, TRUE, 19.99, 199.99, FALSE, TRUE, 4)
    `);

    // Insert VPS Plans
    await conn.query(`
      INSERT INTO vps_plans (slug, name, description, cpu_cores, ram_gb, storage_gb, storage_type, bandwidth_tb, ip_addresses, os_options, features, price_monthly, price_annual, is_popular, is_active, sort_order) VALUES
      ('vps-basic', 'VPS Basic', 'Entry-level VPS', 1, 2, 40, 'SSD', 2, 1, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["Full Root Access", "Free SSL", "DDoS Protection"]', 9.99, 99.99, FALSE, TRUE, 1),
      ('vps-standard', 'VPS Standard', 'Most popular choice', 2, 4, 80, 'SSD', 4, 1, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["Full Root Access", "Free SSL", "DDoS Protection", "Automated Backups"]', 19.99, 199.99, TRUE, TRUE, 2),
      ('vps-advanced', 'VPS Advanced', 'High performance', 4, 8, 160, 'NVMe', 6, 2, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["Full Root Access", "Free SSL", "DDoS Protection", "Daily Backups"]', 39.99, 399.99, FALSE, TRUE, 3),
      ('vps-elite', 'VPS Elite', 'Enterprise grade', 8, 16, 320, 'NVMe', 10, 3, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["Full Root Access", "Free SSL", "Advanced DDoS", "Hourly Backups"]', 79.99, 799.99, FALSE, TRUE, 4)
    `);

    // Insert Cloud Plans
    await conn.query(`
      INSERT INTO cloud_plans (slug, name, description, cpu_cores, ram_gb, storage_gb, storage_type, bandwidth_tb, ip_addresses, auto_scaling, os_options, features, price_hourly, price_monthly, is_popular, is_active, sort_order) VALUES
      ('cloud-starter', 'Cloud Starter', 'Entry-level cloud', 1, 1, 25, 'SSD', 1, 1, FALSE, '["Ubuntu", "CentOS", "Debian"]', '["Auto Scaling", "Load Balancing"]', 0.007, 5.00, FALSE, TRUE, 1),
      ('cloud-standard', 'Cloud Standard', 'General purpose', 2, 4, 80, 'SSD', 4, 1, TRUE, '["Ubuntu", "CentOS", "Debian"]', '["Auto Scaling", "Load Balancing", "Snapshots"]', 0.028, 20.00, TRUE, TRUE, 2),
      ('cloud-performance', 'Cloud Performance', 'High performance', 4, 8, 160, 'NVMe', 6, 2, TRUE, '["Ubuntu", "CentOS", "Debian"]', '["Auto Scaling", "Load Balancing", "Snapshots", "Private Network"]', 0.056, 40.00, FALSE, TRUE, 3),
      ('cloud-enterprise', 'Cloud Enterprise', 'Enterprise grade', 8, 32, 640, 'NVMe', 10, 4, TRUE, '["Ubuntu", "CentOS", "Debian"]', '["Auto Scaling", "Load Balancing", "Snapshots", "Private Network", "Dedicated Support"]', 0.167, 120.00, FALSE, TRUE, 4)
    `);

    // Insert Dedicated Plans
    await conn.query(`
      INSERT INTO dedicated_plans (slug, name, description, cpu_model, cpu_cores, ram_gb, storage_config, bandwidth_tb, ip_addresses, features, price_monthly, setup_fee, is_popular, is_active, sort_order) VALUES
      ('dedicated-e3', 'Dedicated E3', 'Intel Xeon E3', 'Intel Xeon E3-1230 v6', 4, 32, '2x 500GB SSD', 10, 5, '["Full Root Access", "IPMI Access", "DDoS Protection"]', 99.99, 49.99, FALSE, TRUE, 1),
      ('dedicated-e5', 'Dedicated E5', 'Intel Xeon E5', 'Intel Xeon E5-2620 v4', 8, 64, '2x 1TB SSD', 20, 10, '["Full Root Access", "IPMI Access", "DDoS Protection", "Hardware RAID"]', 199.99, 0.00, TRUE, TRUE, 2),
      ('dedicated-dual', 'Dedicated Dual', 'Dual Xeon', '2x Intel Xeon E5-2680 v4', 28, 128, '4x 1TB NVMe', 30, 16, '["Full Root Access", "IPMI Access", "Advanced DDoS", "Hardware RAID"]', 399.99, 0.00, FALSE, TRUE, 3)
    `);

    // Insert SSL Plans
    await conn.query(`
      INSERT INTO ssl_plans (slug, name, description, validation_type, warranty, domains_included, wildcard, features, price_annual, is_popular, is_active, sort_order) VALUES
      ('ssl-dv', 'Domain Validation', 'Basic SSL Certificate', 'DV', 10000.00, 1, FALSE, '["256-bit Encryption", "Browser Trust", "Quick Issuance"]', 9.99, FALSE, TRUE, 1),
      ('ssl-ov', 'Organization Validation', 'Business SSL Certificate', 'OV', 100000.00, 1, FALSE, '["256-bit Encryption", "Company Verified", "Trust Seal"]', 49.99, TRUE, TRUE, 2),
      ('ssl-ev', 'Extended Validation', 'Green Bar SSL', 'EV', 1000000.00, 1, FALSE, '["256-bit Encryption", "Green Address Bar", "Highest Trust"]', 149.99, FALSE, TRUE, 3),
      ('ssl-wildcard', 'Wildcard SSL', 'Unlimited Subdomains', 'DV', 50000.00, -1, TRUE, '["256-bit Encryption", "Unlimited Subdomains", "Quick Issuance"]', 79.99, FALSE, TRUE, 4)
    `);

    // Insert Datacenters
    await conn.query(`
      INSERT INTO datacenters (slug, name, location, country, country_code, latitude, longitude, features, is_active, sort_order) VALUES
      ('dhaka-bd', 'Dhaka DC', 'Dhaka, Bangladesh', 'Bangladesh', 'BD', 23.8103, 90.4125, '["Tier III", "24/7 Security", "Redundant Power"]', TRUE, 1),
      ('singapore-sg', 'Singapore DC', 'Singapore', 'Singapore', 'SG', 1.3521, 103.8198, '["Tier IV", "Low Latency Asia", "Premium Network"]', TRUE, 2),
      ('london-uk', 'London DC', 'London, UK', 'United Kingdom', 'GB', 51.5074, -0.1278, '["Tier III+", "Europe Coverage", "GDPR Compliant"]', TRUE, 3),
      ('new-york-us', 'New York DC', 'New York, USA', 'United States', 'US', 40.7128, -74.0060, '["Tier IV", "Americas Coverage", "Premium DDoS"]', TRUE, 4)
    `);

    console.log('✅ All data inserted');
    console.log('');
    console.log('🎉 Database reset complete!');
    console.log('');
    console.log('Admin Login:');
    console.log('  Email: ' + adminEmail);
    console.log('  Password: admin123456');

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

resetDatabase();
