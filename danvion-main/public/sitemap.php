<?php

header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');

$sitemapPath = __DIR__ . '/sitemap.xml';

if (!is_file($sitemapPath)) {
    http_response_code(500);
    echo '<?xml version="1.0" encoding="UTF-8"?><error>Sitemap source not found</error>';
    exit;
}

readfile($sitemapPath);