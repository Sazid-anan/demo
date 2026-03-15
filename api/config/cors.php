<?php
/**
 * Danvion API - CORS Headers
 * 
 * Handles Cross-Origin Resource Sharing for API requests
 */

require_once __DIR__ . '/config.php';

// Explicitly allowed origins for local and production environments.
// NOTE: Admin dashboard is deployed to danvion.com/admin (subdirectory), not a subdomain
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'https://danvion.com',
];

// Keep compatibility with ALLOWED_ORIGINS from config.php if present.
if (defined('ALLOWED_ORIGINS') && is_array(ALLOWED_ORIGINS)) {
    $allowedOrigins = array_values(array_unique(array_merge($allowedOrigins, ALLOWED_ORIGINS)));
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isAllowedOrigin = in_array($origin, $allowedOrigins, true);

if ($isAllowedOrigin) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}

// Required CORS headers for all requests.
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Preflight must return immediately.
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit();
}
