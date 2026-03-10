<?php
/**
 * Danvion API - JWT Authentication Middleware
 * 
 * Verifies JWT tokens and protects admin endpoints
 */

require_once __DIR__ . '/config.php';

class JWTAuth {
    
    /**
     * Generate JWT token
     */
    public static function generateToken($payload) {
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => JWT_ALGORITHM
        ]);
        
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;
        
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    /**
     * Verify JWT token and return payload
     */
    public static function verifyToken($token) {
        if (!$token) {
            return null;
        }
        
        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            return null;
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;
        
        // Verify signature
        $signature = self::base64UrlDecode($base64UrlSignature);
        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        
        if (!hash_equals($signature, $expectedSignature)) {
            return null;
        }
        
        // Decode payload
        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }
        
        return $payload;
    }
    
    /**
     * Middleware to protect admin routes
     * Call this at the beginning of admin endpoints
     */
    public static function requireAuth() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unauthorized: No token provided'
            ]);
            exit();
        }
        
        $token = substr($authHeader, 7); // Remove 'Bearer ' prefix
        $payload = self::verifyToken($token);
        
        if (!$payload) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Unauthorized: Invalid or expired token'
            ]);
            exit();
        }
        
        return $payload;
    }
    
    /**
     * Base64 URL encode
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL decode
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}

/**
 * Helper function to require authentication
 */
function requireAuth() {
    return JWTAuth::requireAuth();
}
