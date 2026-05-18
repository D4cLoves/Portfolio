<?php

/**
 * Symfony Front Controller
 *
 * Entry point for all HTTP requests. Boots the kernel,
 * handles the request, and sends the response.
 */

use App\Kernel;

require_once dirname(__DIR__) . '/vendor/autoload_runtime.php';

return function (array $context): Kernel {
    return new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
};
