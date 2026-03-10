<?php
/**
 * Danvion API - Admin Contact Messages Management
 * GET    /api/admin/messages.php          → Get all messages
 * PUT    /api/admin/messages.php          → Toggle is_read status (requires id in body)
 * DELETE /api/admin/messages.php?id=X     → Delete message
 * 
 * Requires: JWT authentication
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

try {
    // Require authentication
    $user = requireAuth();
    
    $db = getDb();
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // GET ALL MESSAGES
        $stmt = $db->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $messages
        ]);
        
    } elseif ($method === 'PUT') {
        // TOGGLE READ STATUS
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Message ID is required']);
            exit();
        }
        
        // Get current status
        $stmt = $db->prepare("SELECT is_read FROM contact_messages WHERE id = ?");
        $stmt->execute([$id]);
        $message = $stmt->fetch();
        
        if (!$message) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Message not found']);
            exit();
        }
        
        // Toggle status
        $newStatus = $message['is_read'] ? 0 : 1;
        $stmt = $db->prepare("UPDATE contact_messages SET is_read = ? WHERE id = ?");
        $stmt->execute([$newStatus, $id]);
        
        // Fetch updated message
        $stmt = $db->prepare("SELECT * FROM contact_messages WHERE id = ?");
        $stmt->execute([$id]);
        $updatedMessage = $stmt->fetch();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Message status updated successfully',
            'data' => $updatedMessage
        ]);
        
    } elseif ($method === 'DELETE') {
        // DELETE MESSAGE
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Message ID is required']);
            exit();
        }
        
        $stmt = $db->prepare("DELETE FROM contact_messages WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Message not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Message deleted successfully'
        ]);
        
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
