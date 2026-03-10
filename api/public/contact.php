<?php
/**
 * Danvion API - Public Contact Form
 * POST /api/public/contact.php
 * 
 * Submits contact form message
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $company = trim($input['company'] ?? '');
    $message = trim($input['message'] ?? '');
    
    // Validation
    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name is required']);
        exit();
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Valid email is required']);
        exit();
    }
    
    if (empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Message is required']);
        exit();
    }
    
    if (strlen($message) < 10) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Message must be at least 10 characters']);
        exit();
    }
    
    // Rate limiting check (basic per-IP throttling)
    $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    $ip = '';
    if (!empty($forwardedFor)) {
        $forwardedParts = explode(',', $forwardedFor);
        $ip = trim($forwardedParts[0]);
    }

    if (empty($ip)) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    }

    $db = getDb();
    
    // Check if same IP submitted in last 5 minutes
    $stmt = $db->prepare("
        SELECT COUNT(*) as count 
        FROM contact_messages 
        WHERE ip_address = ?
          AND created_at > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
    ");
    $stmt->execute([$ip]);
    $result = $stmt->fetch();
    
    if ($result['count'] > 0) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Please wait 5 minutes before submitting another message'
        ]);
        exit();
    }
    
    // Insert message
    $stmt = $db->prepare("
        INSERT INTO contact_messages (name, email, phone, company, message, ip_address, consent_timestamp)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $stmt->execute([$name, $email, $phone, $company, $message, $ip]);
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Message sent successfully',
        'data' => [
            'id' => $db->lastInsertId()
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
