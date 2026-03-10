<?php
/**
 * Danvion API - Public Services Page
 * GET /api/public/services.php
 * 
 * Returns services page content (singleton)
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $db = getDb();
    
    $stmt = $db->query("SELECT * FROM services_page WHERE id = 1");
    $servicesPage = $stmt->fetch();
    
    if (!$servicesPage) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Services page content not found'
        ]);
        exit();
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $servicesPage
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
