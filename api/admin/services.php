<?php
/**
 * Danvion API - Admin Services Page Management
 * PUT /api/admin/services.php
 * 
 * Updates services page content (singleton)
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
    $allowedFields = [
        'hero_title', 'hero_description', 'services_section_title',
        'service_1_icon', 'service_1_title', 'service_1_desc',
        'service_2_icon', 'service_2_title', 'service_2_desc',
        'service_3_icon', 'service_3_title', 'service_3_desc',
        'service_4_icon', 'service_4_title', 'service_4_desc',
        'service_5_icon', 'service_5_title', 'service_5_desc',
        'service_6_icon', 'service_6_title', 'service_6_desc',
        'process_section_title',
        'process_1_title', 'process_1_desc',
        'process_2_title', 'process_2_desc',
        'process_3_title', 'process_3_desc',
        'process_4_title', 'process_4_desc',
        'cta_title'
    ];
    
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
    
    $sql = "UPDATE services_page SET " . implode(', ', $updates) . " WHERE id = 1";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    
    // Fetch updated data
    $stmt = $db->query("SELECT * FROM services_page WHERE id = 1");
    $servicesPage = $stmt->fetch();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Services page updated successfully',
        'data' => $servicesPage
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
