# Danvion API Documentation

Complete PHP REST API for Danvion project (replaces Firebase)

## 📁 Structure

```
api/
├── config/
│   ├── config.php      # Environment configuration
│   ├── database.php    # MySQL PDO connection
│   ├── cors.php        # CORS headers
│   └── auth.php        # JWT authentication
├── public/             # Public endpoints (no auth)
│   ├── home.php
│   ├── about.php
│   ├── services.php
│   ├── products.php
│   ├── blogs.php
│   ├── team.php
│   ├── testimonials.php
│   └── contact.php
├── admin/              # Admin endpoints (JWT required)
│   ├── home.php
│   ├── about.php
│   ├── services.php
│   ├── products.php
│   ├── blogs.php
│   ├── team.php
│   ├── testimonials.php
│   ├── messages.php
│   ├── upload.php
│   └── analytics.php
├── auth/               # Authentication endpoints
│   ├── login.php
│   ├── logout.php
│   └── verify.php
└── .htaccess          # Apache configuration
```

## 🔧 Setup

1. **Update config.php** with your Hostinger credentials
2. **Import database.sql** in phpMyAdmin
3. **Upload api/ folder** to your hosting
4. **Create uploads/ folder** with 755 permissions
5. **Test** by visiting: https://danvion.com/api/public/home.php

## 🔐 Authentication

Admin endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Get token by logging in:

```
POST /api/auth/login.php
{
  "email": "admin@danvion.com",
  "password": "password"
}
```

## 📝 API Endpoints

### Public Endpoints (No Auth)

- `GET  /api/public/home.php` - Home page content
- `GET  /api/public/about.php` - About page content
- `GET  /api/public/services.php` - Services page content
- `GET  /api/public/products.php` - All products
- `GET  /api/public/products.php?id=X` - Single product
- `GET  /api/public/blogs.php` - All blogs
- `GET  /api/public/blogs.php?id=X` - Single blog
- `GET  /api/public/team.php` - All team members
- `GET  /api/public/testimonials.php` - All testimonials
- `POST /api/public/contact.php` - Submit contact form

### Auth Endpoints

- `POST /api/auth/login.php` - Login and get JWT token
- `POST /api/auth/logout.php` - Logout
- `GET  /api/auth/verify.php` - Verify JWT token

### Admin Endpoints (JWT Required)

- `PUT    /api/admin/home.php` - Update home page
- `PUT    /api/admin/about.php` - Update about page
- `PUT    /api/admin/services.php` - Update services page
- `POST   /api/admin/products.php` - Create product
- `PUT    /api/admin/products.php` - Update product
- `DELETE /api/admin/products.php?id=X` - Delete product
- `POST   /api/admin/blogs.php` - Create blog
- `PUT    /api/admin/blogs.php` - Update blog
- `DELETE /api/admin/blogs.php?id=X` - Delete blog
- `POST   /api/admin/team.php` - Create team member
- `PUT    /api/admin/team.php` - Update team member
- `DELETE /api/admin/team.php?id=X` - Delete team member
- `POST   /api/admin/testimonials.php` - Create testimonial
- `PUT    /api/admin/testimonials.php` - Update testimonial
- `DELETE /api/admin/testimonials.php?id=X` - Delete testimonial
- `GET    /api/admin/messages.php` - Get all messages
- `PUT    /api/admin/messages.php` - Toggle read status
- `DELETE /api/admin/messages.php?id=X` - Delete message
- `POST   /api/admin/upload.php` - Upload image file
- `GET    /api/admin/analytics.php` - Dashboard statistics

## 📤 Response Format

All endpoints return JSON:

**Success:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description"
}
```

## 🚀 Testing

Test public endpoint:

```bash
curl https://danvion.com/api/public/home.php
```

Test authentication:

```bash
curl -X POST https://danvion.com/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@danvion.com","password":"password"}'
```

Test admin endpoint with token:

```bash
curl -X GET https://danvion.com/api/admin/analytics.php \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🔒 Security Features

- ✅ JWT authentication with expiry
- ✅ bcrypt password hashing
- ✅ PDO prepared statements (SQL injection protection)
- ✅ CORS configuration
- ✅ File upload validation
- ✅ Rate limiting on contact form
- ✅ Input sanitization

## 📋 Requirements

- PHP 8.0+
- MySQL 8.0+
- Apache with mod_rewrite
- PDO extension
- JSON extension

## 🔑 Default Admin Credentials

**Email:** admin@danvion.com  
**Password:** password

⚠️ **CHANGE THIS IMMEDIATELY after first login!**
