# Danvion Hostinger Deployment Guide

This guide deploys the full Firebase-free stack:

- `danvion-main` (public React app)
- `danvion-admin` (admin React app)
- `api` (PHP REST API + MySQL)

## 1. Prerequisites

- Hostinger hosting plan with:
  - PHP 8.0+
  - MySQL database access
  - cPanel/hPanel File Manager
- Domain/subdomain ready:
  - Example: `https://danvion.com`
  - Optional admin subdomain: `https://admin.danvion.com`
- Local machine with Node.js 18+ and npm

## 2. Database Setup (MySQL)

1. In Hostinger hPanel, create a new MySQL database.
2. Create a DB user and grant full privileges.
3. Open phpMyAdmin.
4. Import `database.sql` from project root.

After import, verify tables exist:

- `home_page`
- `about_page`
- `services_page`
- `products`
- `blogs`
- `team_members`
- `testimonials`
- `contact_messages`
- `admin_users`
- `analytics`

## 3. API Configuration

### 3.1 Upload API folder

Upload the entire `api/` directory to your hosting root, for example:

- `public_html/api`

### 3.2 Configure DB credentials

Edit `api/config/config.php`:

```php
const DB_HOST = 'localhost';
const DB_NAME = 'your_database_name';
const DB_USER = 'your_database_user';
const DB_PASS = 'your_database_password';

const JWT_SECRET = 'replace-with-a-long-random-secret';
const JWT_EXPIRES_IN = 86400;

const DEBUG_MODE = false;
```

### 3.3 Verify API rewrite/cors

Ensure these files are uploaded:

- `api/.htaccess`
- `api/config/cors.php`

## 4. Frontend Environment Setup

### 4.1 Main site

Create `danvion-main/.env.production`:

```env
VITE_API_URL=https://your-domain.com/api
```

### 4.2 Admin site

Create `danvion-admin/.env.production`:

```env
VITE_API_URL=https://your-domain.com/api
```

## 5. Build Commands

Run locally from project root:

```bash
cd danvion-main
npm install
npm run build

cd ../danvion-admin
npm install
npm run build
```

Build outputs:

- `danvion-main/dist`
- `danvion-admin/dist`

## 6. Upload Build Artifacts

Choose one hosting layout.

### Option A: Main + Admin under one domain path

- Upload `danvion-main/dist/*` to `public_html/`
- Upload `danvion-admin/dist/*` to `public_html/admin/`

### Option B: Separate subdomain for admin

- Upload `danvion-main/dist/*` to `public_html/`
- Upload `danvion-admin/dist/*` to admin subdomain document root

## 7. SPA Routing (.htaccess)

For React Router, ensure fallback rewrite exists.

### 7.1 Main app (`public_html/.htaccess`)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 7.2 Admin app (`public_html/admin/.htaccess`)

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /admin/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /admin/index.html [L]
</IfModule>
```

## 8. First Admin User

Default admin row is seeded by `database.sql`.

Default credentials:

- Email: `admin@danvion.com`
- Password: `password`

For security, change it immediately:

Use PHP to generate a password hash compatible with `password_verify()`:

```php
echo password_hash('your_password_here', PASSWORD_DEFAULT);
```

Then insert the generated hash into `admin_users`:

```sql
INSERT INTO admin_users (email, password_hash, role)
VALUES ('admin@danvion.com', 'PASTE_HASH_HERE', 'admin');
```

## 9. Post-Deploy Verification Checklist

### API checks

- `GET https://your-domain.com/api/public/home.php` returns JSON with `success=true`
- `GET https://your-domain.com/api/public/products.php` returns product list
- `POST https://your-domain.com/api/public/contact.php` accepts valid form payload

### Main site checks

- Home page content loads from API
- Products page loads list from API
- Blogs page loads list from API
- Contact form submits successfully

### Admin checks

- Login works with admin credentials
- Content tabs load data
- Messages tab can mark read/unread and delete
- Testimonials tab can create/edit/delete
- Image uploads succeed

## 10. Troubleshooting

### 500 API error

- Check `api/config/config.php` DB credentials
- Set `DEBUG_MODE = true` temporarily
- Review Hostinger error logs

### CORS error

- Verify `api/config/cors.php` is present
- Confirm frontend uses correct `VITE_API_URL`
- Ensure site runs on `https` in production

### Admin login fails

- Verify `admin_users` table has active row
- Confirm password hash format matches API expectation
- Verify JWT secret is set and stable

### React routes show 404 on refresh

- Missing or incorrect `.htaccess` SPA fallback
- Verify `RewriteBase` matches deployment path

### Upload fails

- Ensure `api/uploads/` exists and writable
- Check PHP limits in `php.ini` (`upload_max_filesize`, `post_max_size`)

## 11. Vendor Lock Check

You are now fully off Firebase when these are true:

- No `firebase` dependency in `danvion-main/package.json`
- No `firebase` dependency in `danvion-admin/package.json`
- No Firebase client services in either `src/services/`
- Both apps use `VITE_API_URL` and PHP endpoints

At this point your stack is portable to any PHP+MySQL host (no vendor lock-in).
