<?php
/**
 * Danvion API - Admin Analytics
 * GET /api/admin/analytics.php
 * 
 * Returns dashboard statistics
 * Requires: JWT authentication
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Require authentication
    $user = requireAuth();
    
    $db = getDb();
    
    // Get counts for various entities
    $stats = [];
    
    // Total messages
    $stmt = $db->query("SELECT COUNT(*) as count FROM contact_messages");
    $stats['total_messages'] = (int) $stmt->fetch()['count'];
    
    // Unread messages
    $stmt = $db->query("SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0");
    $stats['unread_messages'] = (int) $stmt->fetch()['count'];
    
    // Total products
    $stmt = $db->query("SELECT COUNT(*) as count FROM products");
    $stats['total_products'] = (int) $stmt->fetch()['count'];
    
    // Total blogs
    $stmt = $db->query("SELECT COUNT(*) as count FROM blogs");
    $stats['total_blogs'] = (int) $stmt->fetch()['count'];
    
    // Total team members
    $stmt = $db->query("SELECT COUNT(*) as count FROM team_members");
    $stats['total_team_members'] = (int) $stmt->fetch()['count'];
    
    // Total testimonials
    $stmt = $db->query("SELECT COUNT(*) as count FROM testimonials");
    $stats['total_testimonials'] = (int) $stmt->fetch()['count'];
    
    // Recent messages (last 5)
    $stmt = $db->query("SELECT id, name, email, message, is_read, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5");
    $stats['recent_messages'] = $stmt->fetchAll();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $stats
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
