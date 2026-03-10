<?php
/**
 * Danvion API - Admin Products Management
 * POST   /api/admin/products.php       → Create product
 * PUT    /api/admin/products.php       → Update product (requires id in body)
 * DELETE /api/admin/products.php?id=X  → Delete product
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
        // CREATE PRODUCT
        $input = json_decode(file_get_contents('php://input'), true);
        
        $name = trim($input['name'] ?? '');
        $description = trim($input['description'] ?? '');
        $details = $input['details'] ?? '';
        $image_url = trim($input['image_url'] ?? '');
        $contact_info = trim($input['contact_info'] ?? '');
        $category = trim($input['category'] ?? 'general');
        
        if (empty($name)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product name is required']);
            exit();
        }
        
        $stmt = $db->prepare("
            INSERT INTO products (name, description, details, image_url, contact_info, category)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$name, $description, $details, $image_url, $contact_info, $category]);
        $productId = $db->lastInsertId();
        
        // Fetch created product
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ]);
        
    } elseif ($method === 'PUT') {
        // UPDATE PRODUCT
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product ID is required']);
            exit();
        }
        
        // Build update query dynamically
        $allowedFields = ['name', 'description', 'details', 'image_url', 'contact_info', 'category'];
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
        $sql = "UPDATE products SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        
        // Fetch updated product
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        
        if (!$product) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Product updated successfully',
            'data' => $product
        ]);
        
    } elseif ($method === 'DELETE') {
        // DELETE PRODUCT
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product ID is required']);
            exit();
        }
        
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Product not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully'
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
