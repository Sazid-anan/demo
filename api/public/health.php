<?php
/**
 * Danvion API - Health Check Endpoint
 *
 * Purpose: Verify API is running, check database connectivity
 * Usage: GET /api/public/health.php
 * Response: JSON with status and metadata
 *
 * Example Response:
 * {
 *   "status": "ok",
 *   "timestamp": "2026-03-11T12:34:56Z",
 *   "api_version": "v1",
 *   "database": "connected",
 *   "checks": {
 *     "api_responding": true,
 *     "database_accessible": true,
 *     "config_loaded": true
 *   }
 * }
 */

require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/database.php';

header('Content-Type: application/json; charset=UTF-8');

$health = [
    'status' => 'ok',
    'timestamp' => gmdate('c'),
    'api_version' => API_VERSION,
    'database' => 'unknown',
    'checks' => [
        'api_responding' => true,
        'database_accessible' => false,
        'config_loaded' => defined('DB_HOST'),
    ],
];

// Test database connection
try {
    $db = Database::getInstance()->getConnection();
    $db->query('SELECT 1');
    $health['database'] = 'connected';
    $health['checks']['database_accessible'] = true;
} catch (Exception $e) {
    $health['database'] = 'disconnected';
    $health['status'] = 'degraded';
    if (DEBUG_MODE) {
        $health['error'] = $e->getMessage();
    }
}

http_response_code($health['status'] === 'ok' ? 200 : 503);
echo json_encode($health, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
