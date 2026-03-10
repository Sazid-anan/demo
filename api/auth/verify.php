<?php
/**
 * Danvion API - Verify Token
 * GET /api/auth/verify.php
 * 
 * Verifies if JWT token is valid and returns user info
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/auth.php';

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Verify token (this will exit with 401 if invalid)
    $payload = requireAuth();
    
    // Token is valid, return user info
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => [
            'valid' => true,
            'user' => [
                'id' => $payload['user_id'],
                'email' => $payload['email'],
                'role' => $payload['role']
            ],
            'exp' => $payload['exp']
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
