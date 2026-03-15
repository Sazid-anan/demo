<?php
/**
 * secrets.php — Production credentials template
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  NEVER commit the real secrets.php to Git.                          │
 * │                                                                     │
 * │  Upload the filled-in file via Hostinger File Manager to:           │
 * │    /home/u691300579/secrets.php   (one level ABOVE public_html)     │
 * │                                                                     │
 * │  This path is NOT web-accessible — PHP can read it, browsers cannot.│
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * How to use:
 *   1. Copy this file.
 *   2. Rename the copy to secrets.php.
 *   3. Fill in the real values below.
 *   4. Upload to /home/u691300579/secrets.php via File Manager or SFTP.
 *   5. Keep this example file committed — keep secrets.php out of Git.
 */

// -- Database -----------------------------------------------------------------
define('DB_HOST', 'localhost');
define('DB_NAME', 'u691300579_danvion_db');
define('DB_USER', 'u691300579_danvion_SQL');
define('DB_PASS', 'REPLACE_WITH_REAL_DB_PASSWORD');

// -- JWT ----------------------------------------------------------------------
// Generate a strong secret: use at least 64 random characters.
// You can generate one at: https://generate-secret.vercel.app/64
define('JWT_SECRET', 'REPLACE_WITH_64_CHAR_RANDOM_STRING');
