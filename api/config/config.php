<?php
/**
 * Danvion API - Configuration
 *
 * Credentials are NEVER stored here. They are loaded from a secrets file
 * that lives OUTSIDE public_html (not web-accessible) on the server.
 *
 * Production secrets file location:
 *   /home/u691300579/secrets.php   <- upload this manually, never commit it
 *
 * Local development falls back to the safe defaults defined below.
 */

// -- Secrets loader -----------------------------------------------------------
// Walk up: public_html/api/config/ -> public_html/api/ -> public_html/ -> home/
$_secretsFile = dirname(dirname(dirname(dirname(__FILE__)))) . DIRECTORY_SEPARATOR . 'secrets.php';
if (file_exists($_secretsFile)) {
    require_once $_secretsFile;
}
unset($_secretsFile);

// -- Database -----------------------------------------------------------------
defined('DB_HOST')    || define('DB_HOST',    'localhost');
defined('DB_NAME')    || define('DB_NAME',    'danvion_local');
defined('DB_USER')    || define('DB_USER',    'root');
defined('DB_PASS')    || define('DB_PASS',    '');
define('DB_CHARSET', 'utf8mb4');

// -- JWT ----------------------------------------------------------------------
defined('JWT_SECRET') || define('JWT_SECRET', 'local_dev_only_change_this_in_production_secrets');
define('JWT_EXPIRY',    86400);
define('JWT_ALGORITHM', 'HS256');

// -- File Uploads -------------------------------------------------------------
define('UPLOAD_PATH',          '/home/u691300579/public_html/uploads/');
define('UPLOAD_URL',           'https://danvion.com/uploads/');
define('UPLOAD_MAX_SIZE',      5242880);
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg']);

// -- CORS ---------------------------------------------------------------------
define('ALLOWED_ORIGINS', [
    'https://danvion.com',
    'https://www.danvion.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
    'http://localhost:4174',
]);

// -- API ----------------------------------------------------------------------
define('API_VERSION',    'v1');
define('API_RATE_LIMIT', 100);

// -- Environment --------------------------------------------------------------
define('DEBUG_MODE', false);
date_default_timezone_set('UTC');

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}
