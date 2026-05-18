<?php

declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

/**
 * Contact Form Request DTO
 *
 * Immutable data transfer object representing a contact form submission.
 * Uses Symfony Validator constraints for declarative validation rules
 * that mirror the frontend validation logic.
 */
final readonly class ContactRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Имя обязательно для заполнения')]
        #[Assert\Length(max: 100, maxMessage: 'Имя не должно превышать {{ limit }} символов')]
        public string $name,

        #[Assert\NotBlank(message: 'Email обязателен для заполнения')]
        #[Assert\Email(message: 'Введите корректный email адрес')]
        public string $email,

        #[Assert\Regex(
            pattern: '/^\+?[\d\s\-()]{7,20}$/',
            message: 'Введите корректный номер телефона',
        )]
        public ?string $phone = null,

        #[Assert\Length(max: 1000, maxMessage: 'Комментарий не должен превышать {{ limit }} символов')]
        public ?string $comment = null,
    ) {
    }

    /**
     * Factory method to create a ContactRequest from an associative array.
     *
     * Extracts known fields from the input data, trimming string values
     * and treating empty strings as null for optional fields.
     *
     * @param array<string, mixed> $data Raw request data
     */
    public static function fromArray(array $data): self
    {
        $name = trim((string) ($data['name'] ?? ''));
        $email = trim((string) ($data['email'] ?? ''));
        $phone = trim((string) ($data['phone'] ?? ''));
        $comment = trim((string) ($data['comment'] ?? ''));

        return new self(
            name: $name,
            email: $email,
            phone: $phone !== '' ? $phone : null,
            comment: $comment !== '' ? $comment : null,
        );
    }
}
