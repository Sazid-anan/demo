<?php
/**
 * Danvion API - Admin Blogs Management
 * POST   /api/admin/blogs.php       → Create blog
 * PUT    /api/admin/blogs.php       → Update blog (requires id in body)
 * DELETE /api/admin/blogs.php?id=X  → Delete blog
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
    
    if ($method === 'POST') {
        // CREATE BLOG
        $input = json_decode(file_get_contents('php://input'), true);
        
        $title = trim($input['title'] ?? '');
        $excerpt = trim($input['excerpt'] ?? '');
        $content = $input['content'] ?? '';
        $featured_image = trim($input['featured_image'] ?? '');
        $author = trim($input['author'] ?? 'Danvion Team');
        $category = trim($input['category'] ?? 'general');
        $published_date = $input['published_date'] ?? date('Y-m-d H:i:s');
        $read_time = $input['read_time'] ?? 5;
        
        if (empty($title)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Blog title is required']);
            exit();
        }
        
        $stmt = $db->prepare("
            INSERT INTO blogs (title, excerpt, content, featured_image, author, category, published_date, read_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$title, $excerpt, $content, $featured_image, $author, $category, $published_date, $read_time]);
        $blogId = $db->lastInsertId();
        
        // Fetch created blog
        $stmt = $db->prepare("SELECT * FROM blogs WHERE id = ?");
        $stmt->execute([$blogId]);
        $blog = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Blog created successfully',
            'data' => $blog
        ]);
        
    } elseif ($method === 'PUT') {
        // UPDATE BLOG
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Blog ID is required']);
            exit();
        }
        
        // Build update query dynamically
        $allowedFields = ['title', 'excerpt', 'content', 'featured_image', 'author', 'category', 'published_date', 'read_time'];
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
        
        $values[] = $id;
        $sql = "UPDATE blogs SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        
        // Fetch updated blog
        $stmt = $db->prepare("SELECT * FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        $blog = $stmt->fetch();
        
        if (!$blog) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Blog not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Blog updated successfully',
            'data' => $blog
        ]);
        
    } elseif ($method === 'DELETE') {
        // DELETE BLOG
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Blog ID is required']);
            exit();
        }
        
        $stmt = $db->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Blog not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Blog deleted successfully'
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
