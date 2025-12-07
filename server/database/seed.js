require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  const conn = await mariadb.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'magnetic_clouds',
    multipleStatements: true
  });

  try {
    // First, ensure the users table has correct structure
    // Drop and recreate if it has wrong columns
    console.log('🔧 Checking database structure...');
    
    try {
      await conn.query(`SELECT uuid FROM users LIMIT 1`);
    } catch (e) {
      // uuid column doesn't exist, recreate the table
      console.log('🔧 Fixing users table structure...');
      await conn.query(`DROP TABLE IF EXISTS sessions`);
      await conn.query(`DROP TABLE IF EXISTS users`);
      await conn.query(`
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
      console.log('✅ Users table recreated');
    }

    // Create admin user (delete existing and recreate to ensure password is correct)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@magneticclouds.com';
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 12);
    
    // Delete existing admin if exists to update password
    await conn.query(`DELETE FROM users WHERE email = ?`, [adminEmail]);
    
    await conn.query(`
      INSERT INTO users (uuid, email, password, first_name, last_name, role, email_verified, status)
      VALUES (?, ?, ?, 'Super', 'Admin', 'super_admin', TRUE, 'active')
    `, [uuidv4(), adminEmail, adminPassword]);
    
    console.log('✅ Admin user created: ' + adminEmail);

    // Insert Languages
    await conn.query(`
      INSERT IGNORE INTO languages (code, name, native_name, flag, is_default, is_active) VALUES
      ('en', 'English', 'English', '🇺🇸', TRUE, TRUE),
      ('bn', 'Bengali', 'বাংলা', '🇧🇩', FALSE, TRUE)
    `);

    // Insert Currencies
    await conn.query(`
      INSERT IGNORE INTO currencies (code, name, symbol, exchange_rate, is_default, is_active) VALUES
      ('USD', 'US Dollar', '$', 1.000000, TRUE, TRUE),
      ('BDT', 'Bangladeshi Taka', '৳', 110.000000, FALSE, TRUE),
      ('EUR', 'Euro', '€', 0.920000, FALSE, TRUE),
      ('GBP', 'British Pound', '£', 0.790000, FALSE, TRUE),
      ('INR', 'Indian Rupee', '₹', 83.000000, FALSE, TRUE)
    `);

    // Insert Service Categories
    await conn.query(`
      INSERT IGNORE INTO service_categories (slug, name_en, name_bn, description_en, icon, sort_order) VALUES
      ('web-hosting', 'Web Hosting', 'ওয়েব হোস্টিং', 'Fast, reliable web hosting for your websites', 'Server', 1),
      ('vps-servers', 'VPS Servers', 'ভিপিএস সার্ভার', 'Virtual Private Servers with full root access', 'HardDrive', 2),
      ('cloud-servers', 'Cloud Servers', 'ক্লাউড সার্ভার', 'Scalable cloud infrastructure', 'Cloud', 3),
      ('dedicated-servers', 'Dedicated Servers', 'ডেডিকেটেড সার্ভার', 'Powerful dedicated hardware', 'Server', 4),
      ('domains', 'Domains', 'ডোমেইন', 'Domain registration and transfer', 'Globe', 5),
      ('ssl-certificates', 'SSL Certificates', 'এসএসএল সার্টিফিকেট', 'Secure your website with SSL', 'Shield', 6),
      ('email-hosting', 'Professional Email', 'প্রফেশনাল ইমেইল', 'Business email solutions', 'Mail', 7),
      ('website-backup', 'Website Backup', 'ওয়েবসাইট ব্যাকআপ', 'Automated backup solutions', 'Database', 8)
    `);

    // Insert Hosting Plans
    await conn.query(`
      INSERT IGNORE INTO hosting_plans (category_id, slug, name, description, features, disk_space, bandwidth, domains, email_accounts, databases, ssl_included, backup_included, price_monthly, price_annual, is_popular, sort_order) VALUES
      (1, 'starter', 'Starter', 'Perfect for personal websites and blogs', '["1 Website", "10GB SSD Storage", "Free SSL", "Daily Backups", "Email Support"]', '10GB', 'Unlimited', 1, 5, 2, TRUE, TRUE, 2.99, 29.99, FALSE, 1),
      (1, 'business', 'Business', 'Ideal for small business websites', '["5 Websites", "50GB SSD Storage", "Free SSL", "Daily Backups", "Priority Support", "Free Domain"]', '50GB', 'Unlimited', 5, 25, 10, TRUE, TRUE, 5.99, 59.99, TRUE, 2),
      (1, 'professional', 'Professional', 'For high-traffic websites', '["Unlimited Websites", "100GB NVMe Storage", "Free SSL", "Daily Backups", "24/7 Phone Support", "Free Domain", "Staging Environment"]', '100GB', 'Unlimited', -1, 100, 50, TRUE, TRUE, 9.99, 99.99, FALSE, 3),
      (1, 'enterprise', 'Enterprise', 'Maximum power and resources', '["Unlimited Websites", "250GB NVMe Storage", "Free SSL", "Hourly Backups", "Dedicated Support", "Free Domain", "Staging Environment", "CDN Included"]', '250GB', 'Unlimited', -1, -1, -1, TRUE, TRUE, 19.99, 199.99, FALSE, 4)
    `);

    // Insert VPS Plans
    await conn.query(`
      INSERT IGNORE INTO vps_plans (slug, name, description, cpu_cores, ram_gb, storage_gb, storage_type, bandwidth_tb, ip_addresses, os_options, features, price_monthly, price_annual, is_popular, sort_order) VALUES
      ('vps-basic', 'VPS Basic', 'Entry-level VPS', 1, 2, 40, 'SSD', 2, 1, '["Ubuntu 22.04", "CentOS 8", "Debian 11", "Windows Server 2022"]', '["Full Root Access", "Free SSL", "DDoS Protection", "99.9% Uptime"]', 9.99, 99.99, FALSE, 1),
      ('vps-standard', 'VPS Standard', 'Most popular choice', 2, 4, 80, 'SSD', 4, 1, '["Ubuntu 22.04", "CentOS 8", "Debian 11", "Windows Server 2022"]', '["Full Root Access", "Free SSL", "DDoS Protection", "99.9% Uptime", "Automated Backups"]', 19.99, 199.99, TRUE, 2),
      ('vps-advanced', 'VPS Advanced', 'High performance', 4, 8, 160, 'NVMe', 6, 2, '["Ubuntu 22.04", "CentOS 8", "Debian 11", "Windows Server 2022"]', '["Full Root Access", "Free SSL", "DDoS Protection", "99.99% Uptime", "Daily Backups", "Priority Support"]', 39.99, 399.99, FALSE, 3),
      ('vps-elite', 'VPS Elite', 'Enterprise grade', 8, 16, 320, 'NVMe', 10, 3, '["Ubuntu 22.04", "CentOS 8", "Debian 11", "Windows Server 2022"]', '["Full Root Access", "Free SSL", "Advanced DDoS", "99.99% Uptime", "Hourly Backups", "Dedicated Support"]', 79.99, 799.99, FALSE, 4)
    `);

    // Insert Cloud Plans
    await conn.query(`
      INSERT IGNORE INTO cloud_plans (slug, name, description, cpu_cores, ram_gb, storage_gb, storage_type, bandwidth_tb, ip_addresses, auto_scaling, os_options, features, price_hourly, price_monthly, is_popular, sort_order) VALUES
      ('cloud-micro', 'Cloud Micro', 'For development and testing', 1, 1, 25, 'NVMe', 1, 1, FALSE, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["Instant Deployment", "API Access", "Snapshots"]', 0.0070, 4.99, FALSE, 1),
      ('cloud-small', 'Cloud Small', 'For small applications', 1, 2, 50, 'NVMe', 2, 1, FALSE, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["Instant Deployment", "API Access", "Snapshots", "Load Balancer Ready"]', 0.0140, 9.99, FALSE, 2),
      ('cloud-medium', 'Cloud Medium', 'For production workloads', 2, 4, 100, 'NVMe', 4, 1, TRUE, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["Instant Deployment", "API Access", "Snapshots", "Auto-Scaling", "Load Balancer"]', 0.0280, 19.99, TRUE, 3),
      ('cloud-large', 'Cloud Large', 'For high-demand apps', 4, 8, 200, 'NVMe', 8, 2, TRUE, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["Instant Deployment", "API Access", "Snapshots", "Auto-Scaling", "Load Balancer", "Private Network"]', 0.0560, 39.99, FALSE, 4),
      ('cloud-xlarge', 'Cloud XLarge', 'Enterprise workloads', 8, 16, 400, 'NVMe', 16, 3, TRUE, '["Ubuntu 22.04", "CentOS 8", "Debian 11"]', '["All Features", "Dedicated Resources", "Priority Support"]', 0.1120, 79.99, FALSE, 5)
    `);

    // Insert Dedicated Plans
    await conn.query(`
      INSERT IGNORE INTO dedicated_plans (slug, name, description, processor, cpu_cores, ram_gb, storage_config, bandwidth_tb, ip_addresses, os_options, features, price_monthly, setup_fee, is_popular, sort_order) VALUES
      ('dedicated-entry', 'Entry Server', 'Perfect for small businesses', 'Intel Xeon E-2236', 6, 32, '2x 500GB SSD RAID-1', 20, 5, '["Ubuntu 22.04", "CentOS 8", "Windows Server 2022"]', '["Full Root Access", "IPMI Access", "DDoS Protection", "99.99% Uptime SLA"]', 99.99, 50.00, FALSE, 1),
      ('dedicated-business', 'Business Server', 'For growing businesses', 'Intel Xeon E-2288G', 8, 64, '2x 1TB NVMe RAID-1', 30, 10, '["Ubuntu 22.04", "CentOS 8", "Windows Server 2022"]', '["Full Root Access", "IPMI Access", "Advanced DDoS", "99.99% Uptime SLA", "Hardware RAID"]', 199.99, 0.00, TRUE, 2),
      ('dedicated-enterprise', 'Enterprise Server', 'Maximum performance', 'AMD EPYC 7443P', 24, 128, '4x 1TB NVMe RAID-10', 50, 20, '["Ubuntu 22.04", "CentOS 8", "Windows Server 2022"]', '["All Features", "Dedicated Bandwidth", "Premium Support"]', 399.99, 0.00, FALSE, 3),
      ('dedicated-ultimate', 'Ultimate Server', 'No compromises', 'AMD EPYC 7543', 32, 256, '8x 2TB NVMe RAID-10', 100, 50, '["Ubuntu 22.04", "CentOS 8", "Windows Server 2022"]', '["All Features", "Custom Configuration", "White Glove Support"]', 799.99, 0.00, FALSE, 4)
    `);

    // Insert Domain TLDs
    await conn.query(`
      INSERT IGNORE INTO domain_tlds (tld, description, price_register, price_renew, price_transfer, is_popular, sort_order) VALUES
      ('.com', 'Commercial', 10.99, 12.99, 10.99, TRUE, 1),
      ('.net', 'Network', 11.99, 13.99, 11.99, TRUE, 2),
      ('.org', 'Organization', 11.99, 13.99, 11.99, TRUE, 3),
      ('.io', 'Tech Startups', 39.99, 44.99, 39.99, TRUE, 4),
      ('.co', 'Company', 24.99, 29.99, 24.99, FALSE, 5),
      ('.ai', 'AI & Tech', 89.99, 99.99, 89.99, FALSE, 6),
      ('.dev', 'Developers', 14.99, 16.99, 14.99, FALSE, 7),
      ('.app', 'Applications', 14.99, 16.99, 14.99, FALSE, 8),
      ('.online', 'Online', 4.99, 29.99, 4.99, FALSE, 9),
      ('.store', 'E-commerce', 4.99, 49.99, 4.99, FALSE, 10),
      ('.xyz', 'Generic', 2.99, 12.99, 2.99, FALSE, 11),
      ('.bd', 'Bangladesh', 49.99, 49.99, 49.99, FALSE, 12),
      ('.com.bd', 'Bangladesh Commercial', 29.99, 29.99, 29.99, FALSE, 13)
    `);

    // Insert SSL Certificates
    await conn.query(`
      INSERT IGNORE INTO ssl_certificates (slug, name, description, type, brand, warranty_amount, validation_type, issuance_time, features, price_annual, is_popular, sort_order) VALUES
      ('rapidssl-dv', 'RapidSSL Standard', 'Domain Validated SSL', 'DV', 'RapidSSL', 10000, 'Domain', '5 Minutes', '["256-bit Encryption", "Free Reissues", "Browser Compatibility", "$10,000 Warranty"]', 19.99, FALSE, 1),
      ('comodo-positive', 'Comodo PositiveSSL', 'Domain Validated SSL', 'DV', 'Comodo', 50000, 'Domain', '5 Minutes', '["256-bit Encryption", "Free Reissues", "99.9% Browser Support", "$50,000 Warranty"]', 29.99, TRUE, 2),
      ('geotrust-quickssl', 'GeoTrust QuickSSL', 'Domain Validated SSL', 'DV', 'GeoTrust', 100000, 'Domain', '10 Minutes', '["256-bit Encryption", "Site Seal", "Unlimited Reissues", "$100,000 Warranty"]', 49.99, FALSE, 3),
      ('comodo-ov', 'Comodo InstantSSL', 'Organization Validated', 'OV', 'Comodo', 100000, 'Organization', '1-3 Days', '["Organization Name in Cert", "Site Seal", "Unlimited Servers", "$100,000 Warranty"]', 79.99, FALSE, 4),
      ('digicert-ev', 'DigiCert EV SSL', 'Extended Validation', 'EV', 'DigiCert', 1750000, 'Extended', '1-5 Days', '["Green Address Bar", "Company Name Display", "Highest Trust Level", "$1.75M Warranty"]', 299.99, FALSE, 5),
      ('comodo-wildcard', 'Comodo Wildcard SSL', 'Wildcard DV SSL', 'Wildcard', 'Comodo', 50000, 'Domain', '5 Minutes', '["Unlimited Subdomains", "256-bit Encryption", "Free Reissues", "$50,000 Warranty"]', 149.99, FALSE, 6),
      ('comodo-multidomain', 'Comodo Multi-Domain', 'Multi-Domain SSL', 'Multi-Domain', 'Comodo', 250000, 'Domain', '5 Minutes', '["Up to 100 Domains", "256-bit Encryption", "Free Reissues", "$250,000 Warranty"]', 199.99, FALSE, 7)
    `);

    // Insert Email Plans
    await conn.query(`
      INSERT IGNORE INTO email_plans (slug, name, description, storage_gb, users_included, features, price_monthly, price_annual, is_popular, sort_order) VALUES
      ('email-starter', 'Email Starter', 'Basic email for individuals', 5, 1, '["5GB Storage", "Webmail Access", "Mobile Sync", "Spam Protection"]', 1.99, 19.99, FALSE, 1),
      ('email-business', 'Email Business', 'Professional business email', 25, 5, '["25GB Storage/User", "Custom Domain", "Calendar & Contacts", "Advanced Spam Filter", "24/7 Support"]', 4.99, 49.99, TRUE, 2),
      ('email-enterprise', 'Email Enterprise', 'Enterprise email solution', 100, 25, '["100GB Storage/User", "All Features", "Email Archiving", "eDiscovery", "Dedicated Support"]', 9.99, 99.99, FALSE, 3)
    `);

    // Insert Backup Plans
    await conn.query(`
      INSERT IGNORE INTO backup_plans (slug, name, description, storage_gb, retention_days, features, price_monthly, price_annual, is_popular, sort_order) VALUES
      ('backup-basic', 'Basic Backup', 'Essential website backup', 10, 7, '["Daily Backups", "7-Day Retention", "One-Click Restore", "Email Notifications"]', 2.99, 29.99, FALSE, 1),
      ('backup-plus', 'Backup Plus', 'Enhanced backup solution', 50, 30, '["Daily Backups", "30-Day Retention", "Instant Restore", "Multiple Sites", "Priority Support"]', 7.99, 79.99, TRUE, 2),
      ('backup-pro', 'Backup Pro', 'Professional backup', 200, 90, '["Hourly Backups", "90-Day Retention", "All Features", "Offsite Storage", "Dedicated Support"]', 19.99, 199.99, FALSE, 3)
    `);

    // Insert Datacenters
    await conn.query(`
      INSERT IGNORE INTO datacenters (slug, name, city, country, country_code, continent, latitude, longitude, description, features, sort_order) VALUES
      ('dhaka-bd', 'Dhaka DC', 'Dhaka', 'Bangladesh', 'BD', 'Asia', 23.8103, 90.4125, 'Our flagship datacenter in Bangladesh', '["Tier III", "N+1 Power", "24/7 Security", "Fiber Connectivity"]', 1),
      ('singapore-sg', 'Singapore DC', 'Singapore', 'Singapore', 'SG', 'Asia', 1.3521, 103.8198, 'Premium Singapore datacenter', '["Tier IV", "Redundant Power", "Carrier Neutral", "Low Latency"]', 2),
      ('mumbai-in', 'Mumbai DC', 'Mumbai', 'India', 'IN', 'Asia', 19.0760, 72.8777, 'India datacenter', '["Tier III", "N+1 Power", "DDoS Protection"]', 3),
      ('london-uk', 'London DC', 'London', 'United Kingdom', 'GB', 'Europe', 51.5074, -0.1278, 'European datacenter', '["Tier IV", "Green Energy", "GDPR Compliant"]', 4),
      ('frankfurt-de', 'Frankfurt DC', 'Frankfurt', 'Germany', 'DE', 'Europe', 50.1109, 8.6821, 'German datacenter', '["Tier III+", "Green Energy", "GDPR Compliant"]', 5),
      ('new-york-us', 'New York DC', 'New York', 'United States', 'US', 'North America', 40.7128, -74.0060, 'US East datacenter', '["Tier IV", "Multiple Carriers", "Low Latency"]', 6),
      ('los-angeles-us', 'Los Angeles DC', 'Los Angeles', 'United States', 'US', 'North America', 34.0522, -118.2437, 'US West datacenter', '["Tier III", "SSD Storage", "DDoS Protection"]', 7),
      ('tokyo-jp', 'Tokyo DC', 'Tokyo', 'Japan', 'JP', 'Asia', 35.6762, 139.6503, 'Japan datacenter', '["Tier III", "Earthquake Resistant", "Ultra Low Latency"]', 8),
      ('sydney-au', 'Sydney DC', 'Sydney', 'Australia', 'AU', 'Oceania', -33.8688, 151.2093, 'Australia datacenter', '["Tier III", "Local Support", "Fast Connectivity"]', 9)
    `);

    // Insert Site Settings
    await conn.query(`
      INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
      ('site_name', 'Magnetic Clouds', 'string', 'general', 'Website name', TRUE),
      ('site_tagline', 'Premium Hosting Solutions from Bangladesh', 'string', 'general', 'Website tagline', TRUE),
      ('site_description', 'Bangladesh\\'s leading web hosting and domain provider offering VPS, Cloud, Dedicated servers with 24/7 support.', 'string', 'general', 'Site description for SEO', TRUE),
      ('contact_email', 'support@magneticclouds.com', 'string', 'contact', 'Contact email', TRUE),
      ('contact_phone', '+880 1234-567890', 'string', 'contact', 'Contact phone', TRUE),
      ('contact_address', 'Dhaka, Bangladesh', 'string', 'contact', 'Contact address', TRUE),
      ('theme_mode', 'gradient', 'string', 'appearance', 'Theme mode: gradient or solid', TRUE),
      ('primary_color', '#6366f1', 'string', 'appearance', 'Primary brand color', TRUE),
      ('secondary_color', '#8b5cf6', 'string', 'appearance', 'Secondary brand color', TRUE),
      ('money_back_days', '45', 'number', 'policy', 'Money back guarantee days', TRUE),
      ('free_ssl', 'true', 'boolean', 'features', 'Free SSL certificates', TRUE),
      ('support_24_7', 'true', 'boolean', 'features', '24/7 support available', TRUE),
      ('social_facebook', 'https://facebook.com/magneticclouds', 'string', 'social', 'Facebook page URL', TRUE),
      ('social_twitter', 'https://twitter.com/magneticclouds', 'string', 'social', 'Twitter page URL', TRUE),
      ('social_linkedin', 'https://linkedin.com/company/magneticclouds', 'string', 'social', 'LinkedIn page URL', TRUE),
      ('social_instagram', 'https://instagram.com/magneticclouds', 'string', 'social', 'Instagram page URL', TRUE),
      ('stripe_enabled', 'true', 'boolean', 'payment', 'Stripe payments enabled', FALSE),
      ('tax_rate', '0', 'number', 'billing', 'Tax rate percentage', FALSE)
    `);

    // Insert Default Pages
    await conn.query(`
      INSERT IGNORE INTO pages (slug, title_en, title_bn, content_en, meta_title_en, meta_description_en, status) VALUES
      ('about-us', 'About Us', 'আমাদের সম্পর্কে', '<h1>About Magnetic Clouds</h1><p>Magnetic Clouds is Bangladesh\\'s premier web hosting and domain provider. Founded with a vision to provide world-class hosting solutions at affordable prices, we have grown to serve thousands of satisfied customers across the globe.</p><h2>Our Mission</h2><p>To empower businesses and individuals with reliable, fast, and secure hosting infrastructure backed by exceptional customer support.</p><h2>Why Choose Us?</h2><ul><li>99.9% Uptime Guarantee</li><li>24/7 Expert Support</li><li>45-Day Money Back Guarantee</li><li>Free SSL Certificates</li><li>Global Datacenter Network</li></ul>', 'About Us - Magnetic Clouds', 'Learn about Magnetic Clouds, Bangladesh\\'s leading web hosting provider.', 'published'),
      ('contact-us', 'Contact Us', 'যোগাযোগ করুন', '<h1>Contact Us</h1><p>We\\'d love to hear from you! Get in touch with our team for any questions, support, or business inquiries.</p>', 'Contact Us - Magnetic Clouds', 'Contact Magnetic Clouds for hosting support and inquiries.', 'published'),
      ('terms-of-service', 'Terms of Service', 'সেবার শর্তাবলী', '<h1>Terms of Service</h1><p>Please read these terms carefully before using our services.</p>', 'Terms of Service - Magnetic Clouds', 'Read the terms of service for Magnetic Clouds hosting services.', 'published'),
      ('privacy-policy', 'Privacy Policy', 'গোপনীয়তা নীতি', '<h1>Privacy Policy</h1><p>Your privacy is important to us. This policy explains how we collect and use your data.</p>', 'Privacy Policy - Magnetic Clouds', 'Privacy policy for Magnetic Clouds services.', 'published'),
      ('refund-policy', 'Refund Policy', 'ফেরত নীতি', '<h1>45-Day Money Back Guarantee</h1><p>We offer a 45-day money back guarantee on all shared hosting plans.</p>', 'Refund Policy - Magnetic Clouds', '45-day money back guarantee on hosting services.', 'published'),
      ('support', 'Support', 'সাপোর্ট', '<h1>Support Center</h1><p>Get help with your hosting account, domain, or any technical issues.</p>', 'Support - Magnetic Clouds', '24/7 technical support for all hosting services.', 'published')
    `);

    // Insert FAQs
    await conn.query(`
      INSERT IGNORE INTO faqs (category, question_en, question_bn, answer_en, answer_bn, sort_order) VALUES
      ('general', 'What is web hosting?', 'ওয়েব হোস্টিং কি?', 'Web hosting is a service that allows you to publish your website on the internet. When you purchase hosting, you rent space on a server where your website files are stored.', 'ওয়েব হোস্টিং হল একটি সেবা যা আপনাকে ইন্টারনেটে আপনার ওয়েবসাইট প্রকাশ করতে দেয়।', 1),
      ('general', 'Do you offer a money-back guarantee?', 'আপনারা কি মানি-ব্যাক গ্যারান্টি দেন?', 'Yes! We offer a 45-day money-back guarantee on all shared hosting plans. If you\\'re not satisfied, we\\'ll refund your payment.', 'হ্যাঁ! আমরা সমস্ত শেয়ার্ড হোস্টিং প্ল্যানে ৪৫ দিনের মানি-ব্যাক গ্যারান্টি অফার করি।', 2),
      ('hosting', 'Can I upgrade my hosting plan later?', 'আমি কি পরে হোস্টিং প্ল্যান আপগ্রেড করতে পারব?', 'Absolutely! You can upgrade your plan at any time from your dashboard. The price difference will be prorated.', 'অবশ্যই! আপনি যেকোনো সময় আপনার ড্যাশবোর্ড থেকে প্ল্যান আপগ্রেড করতে পারেন।', 3),
      ('domains', 'How do I transfer my domain to Magnetic Clouds?', 'আমি কিভাবে আমার ডোমেইন ট্রান্সফার করব?', 'Domain transfer is easy! Just unlock your domain, get the EPP code from your current registrar, and initiate the transfer from our website.', 'ডোমেইন ট্রান্সফার সহজ! শুধু আপনার ডোমেইন আনলক করুন এবং EPP কোড পান।', 4),
      ('ssl', 'Do you provide free SSL certificates?', 'আপনারা কি ফ্রি SSL সার্টিফিকেট দেন?', 'Yes, all our hosting plans include free Let\\'s Encrypt SSL certificates. Premium SSL certificates are also available for purchase.', 'হ্যাঁ, আমাদের সব হোস্টিং প্ল্যানে বিনামূল্যে SSL সার্টিফিকেট অন্তর্ভুক্ত।', 5),
      ('support', 'What kind of support do you offer?', 'আপনারা কি ধরনের সাপোর্ট দেন?', 'We offer 24/7 technical support via live chat, ticket system, and phone. Our expert team is always ready to help!', 'আমরা ২৪/৭ টেকনিক্যাল সাপোর্ট দিই লাইভ চ্যাট, টিকেট সিস্টেম এবং ফোনের মাধ্যমে।', 6)
    `);

    // Insert Email Templates
    await conn.query(`
      INSERT IGNORE INTO email_templates (slug, name, subject_en, subject_bn, body_en, body_bn, variables) VALUES
      ('welcome', 'Welcome Email', 'Welcome to Magnetic Clouds!', 'Magnetic Clouds-এ স্বাগতম!', '<h1>Welcome, {{name}}!</h1><p>Thank you for joining Magnetic Clouds. Your account has been created successfully.</p>', '<h1>স্বাগতম, {{name}}!</h1><p>Magnetic Clouds-এ যোগ দেওয়ার জন্য ধন্যবাদ।</p>', '["name", "email"]'),
      ('order_confirmation', 'Order Confirmation', 'Order #{{order_number}} Confirmed', 'অর্ডার #{{order_number}} নিশ্চিত', '<h1>Order Confirmed!</h1><p>Your order #{{order_number}} has been confirmed.</p>', '<h1>অর্ডার নিশ্চিত!</h1><p>আপনার অর্ডার #{{order_number}} নিশ্চিত হয়েছে।</p>', '["order_number", "total", "items"]'),
      ('password_reset', 'Password Reset', 'Reset Your Password', 'আপনার পাসওয়ার্ড রিসেট করুন', '<h1>Password Reset</h1><p>Click the link below to reset your password: {{reset_link}}</p>', '<h1>পাসওয়ার্ড রিসেট</h1><p>পাসওয়ার্ড রিসেট করতে নিচের লিংকে ক্লিক করুন: {{reset_link}}</p>', '["reset_link", "name"]')
    `);

    console.log('✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

seed();
