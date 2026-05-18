<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\ContactRequest;
use App\Service\ContactMailer;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Contact Form API Controller
 *
 * Handles contact form submissions from the frontend.
 * Validates input, delegates email sending to the ContactMailer service,
 * and returns structured JSON responses for all outcomes.
 */
final class ContactController extends AbstractController
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly ContactMailer $mailer,
    ) {
    }

    #[Route('/api/contact', name: 'api_contact', methods: ['POST'])]
    public function submit(Request $request): JsonResponse
    {
        $data = $request->toArray();

        $contactRequest = ContactRequest::fromArray($data);

        $violations = $this->validator->validate($contactRequest);

        if ($violations->count() > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $field = $violation->getPropertyPath();
                $errors[$field] = $violation->getMessage();
            }

            return $this->json(
                data: ['success' => false, 'errors' => $errors],
                status: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }

        try {
            $this->mailer->send($contactRequest);
        } catch (\Throwable $e) {
            return $this->json(
                data: [
                    'success' => false,
                    'error' => 'Не удалось отправить сообщение. Попробуйте позже.',
                ],
                status: Response::HTTP_INTERNAL_SERVER_ERROR,
            );
        }

        return $this->json(
            data: [
                'success' => true,
                'message' => 'Сообщение отправлено! Я свяжусь с вами в ближайшее время.',
            ],
        );
    }
}
