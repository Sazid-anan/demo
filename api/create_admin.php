<?php
/**
 * One-time admin bootstrap endpoint.
 *
 * Usage (POST):
 *   email=<admin_email>
 *   password=<admin_password>
 *   secret=<one_time_secret>
 *
 * Security notes:
 * - Set ADMIN_BOOTSTRAP_SECRET before first run.
 * - Delete this file after success (the script also attempts self-delete).
 */

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Change this before first use.
$ADMIN_BOOTSTRAP_SECRET = 'CHANGE_THIS_ONE_TIME_SECRET';

try {
    $input = $_POST;

    if (empty($input)) {
        $decoded = json_decode(file_get_contents('php://input'), true);
        if (is_array($decoded)) {
            $input = $decoded;
        }
    }

    $secret = trim($input['secret'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';

    if ($ADMIN_BOOTSTRAP_SECRET === 'CHANGE_THIS_ONE_TIME_SECRET') {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Bootstrap secret is not configured'
        ]);
        exit();
    }

    if (!hash_equals($ADMIN_BOOTSTRAP_SECRET, $secret)) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Invalid secret']);
        exit();
    }

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address']);
        exit();
    }

    $db = getDb();

    $checkStmt = $db->prepare('SELECT id FROM admin_users WHERE email = ? LIMIT 1');
    $checkStmt->execute([$email]);

    if ($checkStmt->fetch()) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Admin user already exists']);
        exit();
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $insertStmt = $db->prepare('INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)');
    $insertStmt->execute([$email, $passwordHash, 'admin']);

    // Attempt one-time cleanup.
    @unlink(__FILE__);

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Admin user created successfully. Delete create_admin.php if it still exists.',
        'data' => [
            'email' => $email,
            'role' => 'admin',
            'id' => $db->lastInsertId()
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => defined('DEBUG_MODE') && DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
