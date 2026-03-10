<?php
/**
 * Danvion API - Admin Home Page Management
 * PUT /api/admin/home.php
 * 
 * Updates home page content (singleton)
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
    
    // Build update query dynamically based on provided fields
    $allowedFields = [
        'headline', 'description', 'heroImages', 'hero_image_details',
        'product_image_url', 'product_image_caption', 'product_image_link',
        'capabilities_title', 'capability_1_title', 'capability_1_desc',
        'capability_2_title', 'capability_2_desc', 'capability_3_title', 'capability_3_desc'
    ];
    
    $updates = [];
    $values = [];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            // Special handling for JSON fields
            if ($field === 'heroImages') {
                $updates[] = "$field = ?";
                $values[] = json_encode($input[$field]);
            } else {
                $updates[] = "$field = ?";
                $values[] = $input[$field];
            }
        }
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No valid fields to update']);
        exit();
    }
    
    $sql = "UPDATE home_page SET " . implode(', ', $updates) . " WHERE id = 1";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    
    // Fetch updated data
    $stmt = $db->query("SELECT * FROM home_page WHERE id = 1");
    $homePage = $stmt->fetch();
    
    // Decode JSON fields
    if (isset($homePage['heroImages'])) {
        $homePage['heroImages'] = json_decode($homePage['heroImages'], true) ?? [];
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Home page updated successfully',
        'data' => $homePage
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
