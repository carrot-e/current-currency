<?php
set_time_limit(-1);

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version1X;
use Components\CurrencyLayerClient;

require 'vendor/autoload.php';
$client = new Client(new Version1X('http://localhost:4001'));


while (true) {
    $client->initialize();

    $r = $client->read();
    if (!empty($r)) {
        $r = json_decode($r, true);
        $currencyApi = new CurrencyLayerClient();
        $amount = $currencyApi->convert($from = 'UAH', $to = 'EUR', $amount = intval($r[1]['msg']));
        if (!empty($amount)) {
            $client->emit('converted', ['amount' => $amount]);
        }
    }

    usleep(500);
    $client->close();
}
