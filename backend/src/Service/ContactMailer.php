<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\ContactRequest;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

/**
 * Contact Mailer Service
 *
 * Responsible for sending contact form emails:
 * 1. Notification to the site owner with all submitted data
 * 2. Confirmation copy to the user acknowledging receipt
 *
 * Uses Twig templates for professional HTML email rendering.
 */
final readonly class ContactMailer
{
    public function __construct(
        private MailerInterface $mailer,
        private Environment $twig,
        private string $ownerEmail,
        private string $ownerName,
    ) {
    }

    /**
     * Sends both notification and confirmation emails.
     *
     * @param ContactRequest $request Validated contact form data
     *
     * @throws \Symfony\Component\Mailer\Exception\TransportExceptionInterface
     */
    public function send(ContactRequest $request): void
    {
        $this->sendToOwner($request);
        $this->sendToUser($request);
    }

    /**
     * Sends notification email to the site owner with all form data.
     */
    private function sendToOwner(ContactRequest $request): void
    {
        $html = $this->twig->render('emails/contact_owner.html.twig', [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'comment' => $request->comment,
        ]);

        $email = (new Email())
            ->from($this->ownerEmail)
            ->to($this->ownerEmail)
            ->replyTo($request->email)
            ->subject("Новое сообщение с портфолио от {$request->name}")
            ->html($html);

        $this->mailer->send($email);
    }

    /**
     * Sends confirmation email to the user with a copy of their message.
     */
    private function sendToUser(ContactRequest $request): void
    {
        $html = $this->twig->render('emails/contact_user.html.twig', [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'comment' => $request->comment,
            'ownerName' => $this->ownerName,
        ]);

        $email = (new Email())
            ->from($this->ownerEmail)
            ->to($request->email)
            ->subject("Ваше сообщение получено — {$this->ownerName}")
            ->html($html);

        $this->mailer->send($email);
    }
}
