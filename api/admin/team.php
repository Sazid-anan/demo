<?php
/**
 * Danvion API - Admin Team Members Management
 * POST   /api/admin/team.php       → Create team member
 * PUT    /api/admin/team.php       → Update team member (requires id in body)
 * DELETE /api/admin/team.php?id=X  → Delete team member
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
        // CREATE TEAM MEMBER
        $input = json_decode(file_get_contents('php://input'), true);
        
        $name = trim($input['name'] ?? '');
        $role = trim($input['role'] ?? '');
        $bio = trim($input['bio'] ?? '');
        $image = trim($input['image'] ?? '');
        $display_order = $input['display_order'] ?? 0;
        
        if (empty($name) || empty($role)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Name and role are required']);
            exit();
        }
        
        $stmt = $db->prepare("
            INSERT INTO team_members (name, role, bio, image, display_order)
            VALUES (?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([$name, $role, $bio, $image, $display_order]);
        $memberId = $db->lastInsertId();
        
        // Fetch created team member
        $stmt = $db->prepare("SELECT * FROM team_members WHERE id = ?");
        $stmt->execute([$memberId]);
        $member = $stmt->fetch();
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Team member created successfully',
            'data' => $member
        ]);
        
    } elseif ($method === 'PUT') {
        // UPDATE TEAM MEMBER
        $input = json_decode(file_get_contents('php://input'), true);
        
        $id = $input['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Team member ID is required']);
            exit();
        }
        
        // Build update query dynamically
        $allowedFields = ['name', 'role', 'bio', 'image', 'display_order'];
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
        $sql = "UPDATE team_members SET " . implode(', ', $updates) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($values);
        
        // Fetch updated team member
        $stmt = $db->prepare("SELECT * FROM team_members WHERE id = ?");
        $stmt->execute([$id]);
        $member = $stmt->fetch();
        
        if (!$member) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Team member not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Team member updated successfully',
            'data' => $member
        ]);
        
    } elseif ($method === 'DELETE') {
        // DELETE TEAM MEMBER
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Team member ID is required']);
            exit();
        }
        
        $stmt = $db->prepare("DELETE FROM team_members WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Team member not found']);
            exit();
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Team member deleted successfully'
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
