<?php
/**
 * Keep this file outside the public web folder if you can.
 * If it must sit next to domain-check.php, leave it as PHP so the
 * values are not printed when someone opens the file.
 */
return [
    // Private key this site sends in the X-ONEsite-Key header.
    'onesite_key' => 'CHANGE_ME',

    // LogicBoxes reseller id and API key. Already used by Webhero.
    'auth_userid' => 'YOUR_RESELLER_ID',
    'api_key' => 'YOUR_API_KEY',

    // Availability only. Do not point this at the register call.
    'endpoint' => 'https://domaincheck.httpapi.com/api/domains/available.json',
];
