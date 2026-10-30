<?php
/**
 * Public door for the ONEsite form.
 * Receives a domain, calls the LogicBoxes availability check Webhero
 * already uses, and returns only the status.
 *
 * POST https://webhero.com/api/domain-check.php
 * Header: X-ONEsite-Key: <onesite_key>
 * Body:   {"domain":"example.com"}
 * Reply:  {"domain":"example.com","status":"available"}
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST only']);
    exit;
}

$configFile = getenv('ONESITE_DOMAIN_CONFIG');
if (!$configFile) {
    $configFile = __DIR__ . '/domain-check.config.php';
}
if (!is_file($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Domain check is not configured']);
    exit;
}

$config = require $configFile;
$expected = isset($config['onesite_key']) ? (string) $config['onesite_key'] : '';
$given = '';
if (isset($_SERVER['HTTP_X_ONESITE_KEY'])) {
    $given = (string) $_SERVER['HTTP_X_ONESITE_KEY'];
}
if ($expected === '' || $expected === 'CHANGE_ME' || !hash_equals($expected, $given)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw ? $raw : '', true);
$domain = is_array($body) && isset($body['domain']) ? (string) $body['domain'] : '';
$parts = split_domain($domain);
if ($parts === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Enter a domain name like example.com']);
    exit;
}

list($name, $tld, $full) = $parts;
$status = logicboxes_status($config, $name, $tld, $full);
if ($status === null) {
    http_response_code(502);
    echo json_encode(['domain' => $full, 'status' => 'unknown']);
    exit;
}

echo json_encode(['domain' => $full, 'status' => $status]);

function split_domain($input)
{
    $host = strtolower(trim($input));
    $host = preg_replace('#^https?://#', '', $host);
    $host = preg_replace('#[/?#].*$#', '', $host);
    $host = preg_replace('#:\d+$#', '', $host);
    $host = preg_replace('#^www\.#', '', $host);
    if (!preg_match('/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/', $host)) {
        return null;
    }

    $multi = ['co.uk', 'org.uk', 'me.uk', 'com.au', 'net.au', 'co.nz', 'com.br', 'co.in', 'com.mx', 'co.za'];
    foreach ($multi as $suffix) {
        $tail = '.' . $suffix;
        if (strlen($host) > strlen($tail) && substr($host, -strlen($tail)) === $tail) {
            $sld = substr($host, 0, -strlen($tail));
            $dot = strrpos($sld, '.');
            if ($dot !== false) {
                $sld = substr($sld, $dot + 1);
            }
            if ($sld === '') {
                return null;
            }
            return [$sld, $suffix, $sld . '.' . $suffix];
        }
    }

    $labels = explode('.', $host);
    if (count($labels) < 2) {
        return null;
    }
    $suffix = array_pop($labels);
    $sld = array_pop($labels);
    return [$sld, $suffix, $sld . '.' . $suffix];
}

function logicboxes_status($config, $name, $tld, $full)
{
    $endpoint = isset($config['endpoint']) ? $config['endpoint'] : '';
    $userid = isset($config['auth_userid']) ? $config['auth_userid'] : '';
    $apiKey = isset($config['api_key']) ? $config['api_key'] : '';
    if ($endpoint === '' || $userid === '' || $userid === 'YOUR_RESELLER_ID' || $apiKey === '' || $apiKey === 'YOUR_API_KEY') {
        return null;
    }

    $payload = http_build_query([
        'auth-userid' => $userid,
        'api-key' => $apiKey,
        'domain-name' => $name,
        'tlds' => $tld,
    ]);

    $handle = curl_init($endpoint);
    curl_setopt_array($handle, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
    ]);
    $body = curl_exec($handle);
    $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    curl_close($handle);
    if ($body === false || $code < 200 || $code >= 300) {
        return null;
    }

    $data = json_decode($body, true);
    if (!is_array($data)) {
        return null;
    }

    $status = null;
    if (isset($data[$full])) {
        $status = read_status($data[$full]);
    }
    if ($status === null) {
        foreach ($data as $value) {
            $status = read_status($value);
            if ($status !== null) {
                break;
            }
        }
    }

    $allowed = ['available', 'regthroughus', 'regthroughothers', 'unknown'];
    if (!in_array($status, $allowed, true)) {
        return 'unknown';
    }
    return $status;
}

function read_status($value)
{
    if (is_string($value)) {
        return strtolower($value);
    }
    if (is_array($value) && isset($value['status']) && is_string($value['status'])) {
        return strtolower($value['status']);
    }
    return null;
}
