<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\View;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;

class Sendmail extends Mailable
{
    use Queueable, SerializesModels;

    public $mailData;

    /**
     * Create a new message instance.
     */
    public function __construct($mailData)
    {
        $this->mailData = $mailData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->mailData['title'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function build(): Sendmail
    {

            $this->subject($this->mailData['title']);
            $view = View::make('email', ['mailData' => $this->mailData])->render();
            return $this->subject($this->mailData['title'])
                ->html($view);
        
    }

    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments(): array
    {
        if (isset($this->mailData['attachment'])) {
            if (($this->mailData['attachment'])) {
                $attachments = [];

                foreach ($this->mailData['attachment'] as $attachmentPath) {
                    $attachments[] = Attachment::fromPath($attachmentPath);
                }

                return $attachments;
            }
        }

        return [];
    }
}
