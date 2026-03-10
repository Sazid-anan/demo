<?php
/**
 * Danvion API - Public Products
 * GET /api/public/products.php
 * GET /api/public/products.php?id=X
 * 
 * Returns all products or single product by id
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
    
    // Check if specific product requested
    $id = $_GET['id'] ?? null;
    
    if ($id) {
        // Get single product
        $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        
        if (!$product) {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'Product not found'
            ]);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $product
        ]);
    } else {
        // Get all products ordered by name
        $stmt = $db->query("SELECT * FROM products ORDER BY name ASC");
        $products = $stmt->fetchAll();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => $products
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => DEBUG_MODE ? $e->getMessage() : 'Server error'
    ]);
}
