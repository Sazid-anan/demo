<?php
/**
 * Danvion API - Public Home Page
 * GET /api/public/home.php
 * 
 * Returns homepage content (singleton)
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
    
    $stmt = $db->query("SELECT * FROM home_page WHERE id = 1");
    $homePage = $stmt->fetch();
    
    if (!$homePage) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Home page content not found'
        ]);
        exit();
    }
    
    // Decode JSON fields
    if (isset($homePage['heroImages'])) {
        $homePage['heroImages'] = json_decode($homePage['heroImages'], true) ?? [];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $homePage
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
