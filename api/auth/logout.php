<?php
/**
 * Danvion API - Admin Logout
 * POST /api/auth/logout.php
 * 
 * Logs out admin user (client-side token removal)
 */

require_once __DIR__ . '/../config/cors.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Since JWT is stateless, logout is handled client-side by removing the token
    // This endpoint can be used for logging or future session management
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Logged out successfully'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
