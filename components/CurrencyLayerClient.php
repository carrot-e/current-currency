<?php
namespace Components;

class CurrencyLayerClient
{
    private $_response = [];

    private $_url = 'http://apilayer.net/api/live?access_key=89a359981f1f468340c6ea339a4fa116&currencies=USD,EUR,UAH,PLN,AED';

    public function __construct()
    {
        $this->_get();

        return $this->_response;
    }

    private function _get()
    {
        $ch = \curl_init($this->_url);
        \curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $json = \curl_exec($ch);
        \curl_close($ch);

        $exchangeRates = \json_decode($json, true);

        if ($exchangeRates['success']) {
            $this->_response = $exchangeRates['quotes'];
        }
    }
}
