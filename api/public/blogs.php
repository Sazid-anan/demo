<?php
/**
 * Danvion API - Public Blogs
 * GET /api/public/blogs.php
 * GET /api/public/blogs.php?id=X
 * 
 * Returns all blogs or single blog by id
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    $db = getDb();
    
    // Check if specific blog requested
    $id = $_GET['id'] ?? null;
    
    if ($id) {
        // Get single blog
        $stmt = $db->prepare("SELECT * FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        $blog = $stmt->fetch();
        
        if (!$blog) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Blog not found'
            ]);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $blog
        ]);
    } else {
        // Get all blogs ordered by published_date DESC
        $stmt = $db->query("SELECT * FROM blogs ORDER BY published_date DESC");
        $blogs = $stmt->fetchAll();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $blogs
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
