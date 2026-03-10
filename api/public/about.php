<?php
/**
 * Danvion API - Public About Page
 * GET /api/public/about.php
 * 
 * Returns about page content (singleton)
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
    
    $stmt = $db->query("SELECT * FROM about_page WHERE id = 1");
    $aboutPage = $stmt->fetch();
    
    if (!$aboutPage) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'About page content not found'
        ]);
        exit();
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $aboutPage
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
