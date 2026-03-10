<?php
/**
 * Danvion API - Admin About Page Management
 * PUT /api/admin/about.php
 * 
 * Updates about page content (singleton)
 * Requires: JWT authentication
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

// Only accept PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Require authentication
    $user = requireAuth();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    $db = getDb();
    
    // Build update query dynamically
    $allowedFields = ['title', 'description', 'mission', 'vision', 'story_paragraph_1', 'story_paragraph_2', 'story_paragraph_3'];
    
    $updates = [];
    $values = [];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updates[] = "$field = ?";
            $values[] = $input[$field];
        }
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No valid fields to update']);
        exit();
    }
    
    $sql = "UPDATE about_page SET " . implode(', ', $updates) . " WHERE id = 1";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    
    // Fetch updated data
    $stmt = $db->query("SELECT * FROM about_page WHERE id = 1");
    $aboutPage = $stmt->fetch();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'About page updated successfully',
        'data' => $aboutPage
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
