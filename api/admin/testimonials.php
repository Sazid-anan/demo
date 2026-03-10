<?php
/**
 * Danvion API - Admin Testimonials Management
 * POST   /api/admin/testimonials.php       → Create testimonial
 * PUT    /api/admin/testimonials.php       → Update testimonial (requires id in body)
 * DELETE /api/admin/testimonials.php?id=X  → Delete testimonial
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
        // CREATE TESTIMONIAL
        $input = json_decode(file_get_contents('php://input'), true);
        
        $name = trim($input['name'] ?? '');
        $role = trim($input['role'] ?? '');
        $company = trim($input['company'] ?? '');
        $content = trim($input['content'] ?? '');
        $image_url = trim($input['image_url'] ?? '');
        $rating = $input['rating'] ?? 5;
        
        if (empty($name) || empty($content)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and content are required']);
            exit();
        }
        
        if ($rating < 1 || $rating > 5) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5']);
            exit();
        }
        
        $stmt = $db->prepare("
            INSERT INTO testimonials (name, role, company, content, image_url, rating)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$name, $role, $company, $content, $image_url, $rating]);
        $testimonialId = $db->lastInsertId();
        
        // Fetch created testimonial
        $stmt = $db->prepare("SELECT * FROM testimonials WHERE id = ?");
        $stmt->execute([$testimonialId]);
        $testimonial = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Testimonial created successfully',
            'data' => $testimonial
        ]);
        
    } elseif ($method === 'PUT') {
        // UPDATE TESTIMONIAL
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Testimonial ID is required']);
            exit();
        }
        
        // Build update query dynamically
        $allowedFields = ['name', 'role', 'company', 'content', 'image_url', 'rating'];
        $updates = [];
        $values = [];
        
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                if ($field === 'rating' && ($input[$field] < 1 || $input[$field] > 5)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Rating must be between 1 and 5']);
                    exit();
                }
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
        $sql = "UPDATE testimonials SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        
        // Fetch updated testimonial
        $stmt = $db->prepare("SELECT * FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        $testimonial = $stmt->fetch();
        
        if (!$testimonial) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Testimonial updated successfully',
            'data' => $testimonial
        ]);
        
    } elseif ($method === 'DELETE') {
        // DELETE TESTIMONIAL
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Testimonial ID is required']);
            exit();
        }
        
        $stmt = $db->prepare("DELETE FROM testimonials WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Testimonial not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Testimonial deleted successfully'
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
