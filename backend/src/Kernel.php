<?php

declare(strict_types=1);

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

/**
 * Application Kernel
 *
 * Minimal Symfony kernel using MicroKernelTrait for streamlined configuration.
 * Automatically loads bundles from config/bundles.php and configuration
 * from config/packages/*.yaml.
 */
final class Kernel extends BaseKernel
{
    use MicroKernelTrait;
}
