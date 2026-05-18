<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * API Exception Subscriber
 *
 * Intercepts unhandled exceptions for /api/* routes and converts them
 * into structured JSON error responses. Prevents Symfony from returning
 * HTML error pages for API endpoints.
 *
 * In dev environment: includes the exception message for debugging.
 * In prod environment: returns a generic error message for security.
 */
final readonly class ExceptionSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private string $environment,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::EXCEPTION => ['onKernelException', 0],
        ];
    }

    public function onKernelException(ExceptionEvent $event): void
    {
        $request = $event->getRequest();

        // Only handle exceptions for API routes
        if (!str_starts_with($request->getPathInfo(), '/api/')) {
            return;
        }

        $exception = $event->getThrowable();
        $statusCode = $this->resolveStatusCode($exception);

        $errorMessage = match ($this->environment) {
            'dev', 'test' => $exception->getMessage(),
            default => 'Internal server error',
        };

        $response = new JsonResponse(
            data: [
                'success' => false,
                'error' => $errorMessage,
            ],
            status: $statusCode,
        );

        $event->setResponse($response);
    }

    /**
     * Resolves the HTTP status code from the exception.
     */
    private function resolveStatusCode(\Throwable $exception): int
    {
        if (method_exists($exception, 'getStatusCode')) {
            return $exception->getStatusCode();
        }

        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }
}
