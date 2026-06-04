<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class NotificationService
{
    public function send($title, $message)
    {
        try {

            Http::post(
                env('NODE_SERVICE_URL') . '/notifications/send',
                [
                    'title' => $title,
                    'message' => $message,
                ]
            );

        } catch (\Exception $e) {

            \Log::error(
                'Notification service failed: ' .
                $e->getMessage()
            );
        }
    }
}