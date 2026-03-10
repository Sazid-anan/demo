-- ============================================================================
-- DANVION PROJECT - MySQL Database Schema
-- ============================================================================
-- Purpose: Complete database schema for Danvion website migration from Firebase
-- Target: MySQL 8.x on Hostinger shared hosting
-- Tables: 10 (3 singleton + 7 multi-row)
-- ============================================================================

-- Create database
CREATE DATABASE IF NOT EXISTS danvion_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE danvion_db;

-- ============================================================================
-- TABLE 1: home_page (SINGLETON - only 1 row)
-- ============================================================================
-- Purpose: Stores main homepage content including hero section, capabilities
-- Note: This table should always have exactly 1 row with id=1
-- ============================================================================
CREATE TABLE IF NOT EXISTS home_page (
    id INT PRIMARY KEY DEFAULT 1,
    headline VARCHAR(255) DEFAULT '',
    description TEXT,
    heroImages JSON COMMENT 'Array of hero image URLs',
    hero_image_details TEXT,
    product_image_url VARCHAR(500),
    product_image_caption VARCHAR(255),
    product_image_link VARCHAR(500),
    capabilities_title VARCHAR(255),
    capability_1_title VARCHAR(255),
    capability_1_desc TEXT,
    capability_2_title VARCHAR(255),
    capability_2_desc TEXT,
    capability_3_title VARCHAR(255),
    capability_3_desc TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_home_page_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Homepage content singleton table';

-- Insert default row for home_page
INSERT INTO home_page (
    id, 
    headline, 
    description,
    heroImages,
    capabilities_title,
    capability_1_title,
    capability_1_desc,
    capability_2_title,
    capability_2_desc,
    capability_3_title,
    capability_3_desc
) VALUES (
    1,
    'Vision Precision Intelligence',
    'Leading provider of innovative edge AI solutions',
    JSON_ARRAY(),
    'Our Capabilities',
    'AI Development',
    'Custom AI solutions tailored to your needs',
    'Edge Computing',
    'High-performance computing at the edge',
    'IoT Integration',
    'Seamless integration with IoT devices'
);

-- ============================================================================
-- TABLE 2: about_page (SINGLETON - only 1 row)
-- ============================================================================
-- Purpose: Stores about us page content
-- Note: This table should always have exactly 1 row with id=1
-- ============================================================================
CREATE TABLE IF NOT EXISTS about_page (
    id INT PRIMARY KEY DEFAULT 1,
    title VARCHAR(255) DEFAULT 'About Us',
    description TEXT,
    mission TEXT,
    vision TEXT,
    story_paragraph_1 TEXT,
    story_paragraph_2 TEXT,
    story_paragraph_3 TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_about_page_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='About page content singleton table';

-- Insert default row for about_page
INSERT INTO about_page (
    id,
    title,
    description,
    mission,
    vision
) VALUES (
    1,
    'About Danvion',
    'We are a technology company specializing in edge AI solutions.',
    'To deliver cutting-edge AI solutions that transform businesses.',
    'To be the leading provider of edge AI technology worldwide.'
);

-- ============================================================================
-- TABLE 3: services_page (SINGLETON - only 1 row)
-- ============================================================================
-- Purpose: Stores services page content with up to 6 services and 4 process steps
-- Note: This table should always have exactly 1 row with id=1
-- ============================================================================
CREATE TABLE IF NOT EXISTS services_page (
    id INT PRIMARY KEY DEFAULT 1,
    hero_title VARCHAR(255) DEFAULT 'Our Services',
    hero_description TEXT,
    services_section_title VARCHAR(255) DEFAULT 'What We Offer',
    
    -- Service 1
    service_1_icon VARCHAR(100),
    service_1_title VARCHAR(255),
    service_1_desc TEXT,
    
    -- Service 2
    service_2_icon VARCHAR(100),
    service_2_title VARCHAR(255),
    service_2_desc TEXT,
    
    -- Service 3
    service_3_icon VARCHAR(100),
    service_3_title VARCHAR(255),
    service_3_desc TEXT,
    
    -- Service 4
    service_4_icon VARCHAR(100),
    service_4_title VARCHAR(255),
    service_4_desc TEXT,
    
    -- Service 5
    service_5_icon VARCHAR(100),
    service_5_title VARCHAR(255),
    service_5_desc TEXT,
    
    -- Service 6
    service_6_icon VARCHAR(100),
    service_6_title VARCHAR(255),
    service_6_desc TEXT,
    
    -- Process Section
    process_section_title VARCHAR(255) DEFAULT 'Our Process',
    
    -- Process Step 1
    process_1_title VARCHAR(255),
    process_1_desc TEXT,
    
    -- Process Step 2
    process_2_title VARCHAR(255),
    process_2_desc TEXT,
    
    -- Process Step 3
    process_3_title VARCHAR(255),
    process_3_desc TEXT,
    
    -- Process Step 4
    process_4_title VARCHAR(255),
    process_4_desc TEXT,
    
    cta_title VARCHAR(255) DEFAULT 'Ready to Get Started?',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_services_page_singleton CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Services page content singleton table';

-- Insert default row for services_page
INSERT INTO services_page (
    id,
    hero_title,
    hero_description,
    services_section_title,
    service_1_title,
    service_1_desc,
    service_2_title,
    service_2_desc,
    service_3_title,
    service_3_desc,
    process_section_title,
    process_1_title,
    process_1_desc,
    process_2_title,
    process_2_desc,
    cta_title
) VALUES (
    1,
    'Our Services',
    'Comprehensive edge AI solutions for your business needs',
    'What We Offer',
    'AI Consulting',
    'Expert guidance on implementing AI solutions',
    'Custom Development',
    'Tailored AI applications for your specific requirements',
    'Integration Services',
    'Seamless integration with existing systems',
    'Our Process',
    'Discovery',
    'Understanding your needs and requirements',
    'Development',
    'Building your custom solution',
    'Ready to Get Started?'
);

-- ============================================================================
-- TABLE 4: products (MULTI-ROW)
-- ============================================================================
-- Purpose: Stores product catalog with full details
-- Note: Multiple products, ordered by name
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    details LONGTEXT COMMENT 'Markdown formatted long description',
    image_url VARCHAR(500),
    contact_info VARCHAR(500),
    category VARCHAR(100) DEFAULT 'general',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_name (name),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Product catalog with multiple products';

-- ============================================================================
-- TABLE 5: blogs (MULTI-ROW)
-- ============================================================================
-- Purpose: Stores blog posts with markdown content
-- Note: Ordered by published_date DESC for recent posts first
-- ============================================================================
CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT COMMENT 'Short summary for listing pages',
    content LONGTEXT COMMENT 'Full markdown content',
    featured_image VARCHAR(500),
    author VARCHAR(100) DEFAULT 'Danvion Team',
    category VARCHAR(100) DEFAULT 'general',
    published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_time INT DEFAULT 5 COMMENT 'Estimated reading time in minutes',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_published_date (published_date),
    INDEX idx_author (author)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Blog posts with markdown content';

-- ============================================================================
-- TABLE 6: team_members (MULTI-ROW)
-- ============================================================================
-- Purpose: Stores leadership team member profiles
-- Note: Ordered by display_order for controlled positioning
-- ============================================================================
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    bio TEXT,
    image VARCHAR(500) COMMENT 'Profile image URL',
    display_order INT DEFAULT 0 COMMENT 'Lower numbers appear first',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Leadership team member profiles';

-- ============================================================================
-- TABLE 7: testimonials (MULTI-ROW)
-- ============================================================================
-- Purpose: Stores client testimonials with ratings
-- Note: Rating is 1-5 stars
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    company VARCHAR(255),
    content TEXT NOT NULL COMMENT 'Testimonial text',
    image_url VARCHAR(500) COMMENT 'Client photo URL',
    rating TINYINT DEFAULT 5 COMMENT 'Star rating 1-5',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Client testimonials and reviews';

-- ============================================================================
-- TABLE 8: contact_messages (MULTI-ROW, INSERT-ONLY)
-- ============================================================================
-- Purpose: Stores contact form submissions from public website
-- Note: Insert-only from public site, admin can read/mark as read/delete
-- ============================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0 COMMENT 'Boolean: 0=unread, 1=read',
    consent_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'GDPR compliance timestamp',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Contact form submissions from website';

ALTER TABLE contact_messages ADD COLUMN ip_address VARCHAR(45) NULL;

-- ============================================================================
-- TABLE 9: admin_users (MULTI-ROW)
-- ============================================================================
-- Purpose: Stores admin user accounts for dashboard access
-- Note: Passwords stored as bcrypt hashes, roles: admin/editor/viewer
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL COMMENT 'bcrypt hash',
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Admin users for dashboard authentication';

-- ============================================================================
-- TABLE 10: analytics (MULTI-ROW, OPTIONAL)
-- ============================================================================
-- Purpose: Basic page view tracking for analytics
-- Note: Simple tracking, can be enhanced later
-- ============================================================================
CREATE TABLE IF NOT EXISTS analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page VARCHAR(255) NOT NULL,
    referrer VARCHAR(500),
    user_agent TEXT,
    session_id VARCHAR(100),
    ip_address VARCHAR(45) COMMENT 'Supports IPv4 and IPv6',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_page (page),
    INDEX idx_timestamp (timestamp),
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Basic page view analytics tracking';

-- ============================================================================
-- INITIAL ADMIN USER
-- ============================================================================
-- Purpose: Create default admin account
-- Email: admin@danvion.com
-- Password: password (MUST BE CHANGED after first login!)
-- Password hash generated with: password_hash('password', PASSWORD_BCRYPT)
-- ============================================================================
INSERT INTO admin_users (email, password_hash, role) VALUES
('admin@danvion.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Note: The above password is 'password' - CHANGE THIS IMMEDIATELY!
-- To create your own password hash, use this PHP code:
-- <?php echo password_hash('your_password', PASSWORD_BCRYPT); ?>

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries after import to verify everything is set up correctly:
-- ============================================================================

-- Check all tables exist
-- SHOW TABLES;

-- Check singleton tables have exactly 1 row each
-- SELECT 'home_page' as table_name, COUNT(*) as row_count FROM home_page
-- UNION ALL
-- SELECT 'about_page', COUNT(*) FROM about_page
-- UNION ALL
-- SELECT 'services_page', COUNT(*) FROM services_page;

-- Check admin user exists
-- SELECT id, email, role, created_at FROM admin_users;

-- Check all table structures
-- SHOW CREATE TABLE home_page;
-- SHOW CREATE TABLE products;
-- SHOW CREATE TABLE blogs;

-- ============================================================================
-- HOW TO IMPORT THIS FILE IN HOSTINGER PHPMYADMIN
-- ============================================================================
-- 
-- METHOD 1: phpMyAdmin Web Interface (Recommended)
-- ------------------------------------------------
-- 1. Login to Hostinger cPanel
-- 2. Click "phpMyAdmin" icon
-- 3. Click "Import" tab at the top
-- 4. Click "Choose File" and select this database.sql file
-- 5. Scroll down and click "Go" button
-- 6. Wait for success message
-- 7. Click "danvion_db" in left sidebar to verify tables
--
-- METHOD 2: MySQL Command Line (Advanced)
-- ----------------------------------------
-- If you have SSH access to Hostinger:
-- 
-- mysql -u your_username -p < database.sql
-- 
-- (Enter your MySQL password when prompted)
--
-- METHOD 3: Hostinger File Manager + phpMyAdmin
-- ----------------------------------------------
-- 1. Upload database.sql to your hosting via File Manager
-- 2. In phpMyAdmin, click "Import" tab
-- 3. Under "File to import", browse server for uploaded file
-- 4. Click "Go"
--
-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================
--
-- Issue: "Database already exists"
-- Solution: Drop existing database first or change database name at top
--
-- Issue: "Table already exists"  
-- Solution: The script uses IF NOT EXISTS, so this shouldn't happen
--
-- Issue: Import timeout on large file
-- Solution: This file is small, but if needed, increase these in php.ini:
--   - max_execution_time = 300
--   - upload_max_filesize = 50M
--   - post_max_size = 50M
--
-- Issue: Character encoding problems
-- Solution: Ensure phpMyAdmin is set to utf8mb4 in Import settings
--
-- ============================================================================
-- NEXT STEPS AFTER IMPORT
-- ============================================================================
-- 
-- 1. ✅ Verify all 10 tables exist: SHOW TABLES;
-- 2. ✅ Verify singleton tables have 1 row each
-- 3. ✅ Login to admin dashboard with: admin@danvion.com / password
-- 4. ✅ IMMEDIATELY change the default admin password!
-- 5. ✅ Update api/config/config.php with your database credentials
-- 6. ✅ Test API endpoints to confirm database connection works
-- 7. ✅ Import existing data from Firebase if needed
--
-- ============================================================================
-- END OF DATABASE SCHEMA
-- ============================================================================
