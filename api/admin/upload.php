<?php
/**
 * Danvion API - Admin File Upload
 * POST /api/admin/upload.php
 * 
 * Uploads image file and returns public URL
 * Requires: JWT authentication
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Require authentication
    $user = requireAuth();
    
    // Check if file was uploaded
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
        exit();
    }
    
    $file = $_FILES['file'];
    
    // Validate file size
    if ($file['size'] > UPLOAD_MAX_SIZE) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'File too large. Maximum size is ' . (UPLOAD_MAX_SIZE / 1048576) . 'MB'
        ]);
        exit();
    }
    
    // Get file extension
    $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    
    // Validate file type
    if (!in_array($fileExt, UPLOAD_ALLOWED_TYPES)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid file type. Allowed types: ' . implode(', ', UPLOAD_ALLOWED_TYPES)
        ]);
        exit();
    }
    
    // Generate unique filename
    $newFilename = uniqid() . '_' . time() . '.' . $fileExt;
    $uploadPath = UPLOAD_PATH . $newFilename;
    
    // Create uploads directory if it doesn't exist
    if (!is_dir(UPLOAD_PATH)) {
        mkdir(UPLOAD_PATH, 0755, true);
    }
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to save file']);
        exit();
    }
    
    // Return public URL
    $publicUrl = UPLOAD_URL . $newFilename;
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'File uploaded successfully',
        'data' => [
            'filename' => $newFilename,
            'url' => $publicUrl
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
