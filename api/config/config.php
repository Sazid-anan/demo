<?php
/**
 * Danvion API - Configuration File
 * 
 * IMPORTANT: Update these values with your actual Hostinger credentials
 * Keep this file secure - never commit real credentials to public repos
 */

// Database Configuration
define('DB_HOST', 'localhost');                    // Usually 'localhost' on shared hosting
define('DB_NAME', 'your_database_name');           // ← CHANGE THIS to your actual database name
define('DB_USER', 'your_database_username');       // ← CHANGE THIS to your database username
define('DB_PASS', 'your_database_password');       // ← CHANGE THIS to your database password
define('DB_CHARSET', 'utf8mb4');

// JWT Configuration
define('JWT_SECRET', 'CHANGE_THIS_TO_RANDOM_STRING_MIN_32_CHARS_LONG_AND_SECURE');  // ← CHANGE THIS!
define('JWT_EXPIRY', 86400);                       // Token expiry in seconds (24 hours)
define('JWT_ALGORITHM', 'HS256');

// File Upload Configuration
// IMPORTANT: Update these paths to match your actual Hostinger paths
define('UPLOAD_PATH', '/home/your_username/public_html/uploads/');    // ← CHANGE THIS!
define('UPLOAD_URL', 'https://danvion.com/uploads/');                 // ← Update domain if needed
define('UPLOAD_MAX_SIZE', 5242880);                // 5MB in bytes
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']);

// CORS Configuration
define('ALLOWED_ORIGINS', [
    'https://danvion.com',
    'https://www.danvion.com',
    'https://admin.danvion.com',
    'http://localhost:5173',    // for local development
    'http://localhost:5174',    // admin local development
    'http://localhost:4173',    // vite preview (main)
    'http://localhost:4174',    // vite preview (admin)
    'http://localhost:3000'     // legacy local development
]);

// API Configuration
define('API_VERSION', 'v1');
define('API_RATE_LIMIT', 100);                     // Max requests per IP per hour

// Error Reporting (set to false in production)
define('DEBUG_MODE', false);                       // ← Set to false for production!

// Timezone
date_default_timezone_set('UTC');

// Error handling based on debug mode
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}
