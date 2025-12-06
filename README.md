# Magnetic Clouds

Premium Web Hosting & Domain Provider Platform from Bangladesh.

## Features

- **Web Hosting** - Shared hosting with NVMe SSD storage
- **VPS Servers** - Full root access virtual private servers
- **Cloud Servers** - Scalable cloud infrastructure
- **Dedicated Servers** - Enterprise-grade hardware
- **Domain Registration** - 100+ TLD extensions
- **SSL Certificates** - DV, OV, EV certificates
- **Professional Email** - Business email solutions
- **Website Backup** - Automated backup services

### Platform Features

- 🌍 Multi-language support (English, Bengali)
- 💰 Multi-currency support (USD, BDT)
- 🎨 Two themes (Gradient & Solid)
- 📱 Fully responsive design
- 🔐 JWT authentication
- 💳 Stripe payment integration
- 📧 Email notifications
- 🖼️ Auto WebP image conversion
- 🗺️ Global datacenter map

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React 18, TailwindCSS
- **Database**: MariaDB
- **Payment**: Stripe
- **Email**: Nodemailer

## Requirements

- Node.js 18+ (tested on 24.11.1 for Plesk)
- MariaDB 10.6+
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/magnetic-clouds.git
cd magnetic-clouds
```

### 2. Install dependencies

```bash
# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Configure environment variables

```bash
# Copy example env files
cp .env.example .env
cp client/.env.example client/.env

# Edit .env and add your configuration
```

### 4. Setup database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE magnetic_clouds CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

### 5. Start development servers

```bash
# Run both backend and frontend
npm run dev

# Or run separately:
npm run server   # Backend on port 5000
npm run client   # Frontend on port 3000
```

## Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=magnetic_clouds

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# SMTP
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
SMTP_FROM=noreply@magneticclouds.com

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Admin
ADMIN_EMAIL=admin@magneticclouds.com
ADMIN_PASSWORD=securepassword123
```

### Frontend (client/.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxx
```

## Plesk Deployment

### Node.js Configuration

1. **Node.js Version**: 24.11.1
2. **Application Mode**: Production
3. **Document Root**: /client/build
4. **Application URL**: /
5. **Application Startup File**: server/index.js

### Environment Variables in Plesk

Set all environment variables from `.env.example` in Plesk's Node.js settings.

### Deployment Steps

```bash
# 1. Build frontend
npm run build

# 2. Run migrations on production
NODE_ENV=production npm run migrate
npm run seed

# 3. Start the application (Plesk handles this)
```

### Nginx Configuration (Optional)

```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Project Structure

```
magnetic-clouds/
├── server/                 # Backend
│   ├── config/            # Database config
│   ├── database/          # Migrations & seeds
│   ├── middleware/        # Auth, validation
│   ├── routes/            # API routes
│   ├── utils/             # Helpers, logger
│   └── index.js           # Entry point
├── client/                # Frontend (React)
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # Reusable components
│       ├── layouts/       # Page layouts
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── store/         # State management
│       └── i18n.js        # Translations
├── uploads/               # Uploaded files
├── .env.example           # Backend env template
└── package.json           # Dependencies
```

## Default Admin Credentials

After running seeds:
- **Email**: admin@magneticclouds.com
- **Password**: admin123456

⚠️ **Change this immediately in production!**

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Password reset

### Services
- `GET /api/services/hosting` - Hosting plans
- `GET /api/services/vps` - VPS plans
- `GET /api/services/cloud` - Cloud plans
- `GET /api/services/dedicated` - Dedicated plans
- `GET /api/services/ssl` - SSL certificates
- `GET /api/services/email` - Email plans
- `GET /api/services/backup` - Backup plans
- `GET /api/services/datacenters` - Datacenter locations

### Domains
- `GET /api/domains/tlds` - Available TLDs
- `GET /api/domains/search?domain=example` - Search domains
- `GET /api/domains/suggestions?keyword=example` - Domain suggestions

### Checkout
- `POST /api/checkout/calculate` - Calculate cart total
- `POST /api/checkout/validate-coupon` - Validate coupon
- `POST /api/checkout/order` - Create order
- `POST /api/checkout/payment-intent` - Stripe payment

### User Dashboard
- `GET /api/user/dashboard` - Dashboard stats
- `GET /api/user/services` - User services
- `GET /api/user/orders` - Order history
- `GET /api/user/tickets` - Support tickets

### Admin
- `GET /api/admin/dashboard` - Admin stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/orders` - Manage orders
- `CRUD /api/admin/hosting-plans` - Manage plans
- `GET /api/admin/tickets` - Manage tickets
- `CRUD /api/admin/pages` - Manage pages
- `CRUD /api/admin/coupons` - Manage coupons
- `PUT /api/admin/settings` - Site settings

## License

ISC License

## Support

For support, email support@magneticclouds.com or create a support ticket.
