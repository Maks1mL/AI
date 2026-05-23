<?php

namespace App\MailStructure;

use Exception;

use App\Models\EmailConfig;
use App\Mail\NewAccountMail;
use Illuminate\Support\Facades\Mail;
use App\Mail\RequestForgetPasswordMail;

class MailStructure
{
    /**
     * @throws Exception
     */
    public function EmailConfig(): void
    {
        $emailConfig = EmailConfig::first();
        
        if (!$emailConfig->emailConfigName) {
            throw new Exception("Email config name is not set");
        }

        config([
            'mail.mailers.smtp.host' => $emailConfig->emailHost,
            'mail.mailers.smtp.port' => $emailConfig->emailPort,
            'mail.mailers.smtp.encryption' => $emailConfig->emailEncryption,
            'mail.mailers.smtp.username' => $emailConfig->emailUser,
            'mail.mailers.smtp.password' => $emailConfig->emailPass,
            'mail.mailers.smtp.local_domain' => env('MAIL_EHLO_DOMAIN'),
            'mail.from.address' => $emailConfig->emailUser,
            'mail.from.name' => $emailConfig->emailConfigName,
        ]);
    }




    /**
     * @throws Exception
     */
    public function newAccount($userMail, $user): void
    {
        $this->EmailConfig();

      
        $email = Mail::to($userMail)
            ->send(new NewAccountMail('emails.NewAccount',
                "Your account has been created!", $user));

        if (!$email) {
            throw new Exception("Email not sent");
        }
    }

    /**
     * @throws Exception
     */
    public function requestForgetPassword($userMail, $mailData): void
    {
        $this->EmailConfig();

        $email = $email = Mail::to($userMail)
        ->send(new RequestForgetPasswordMail($mailData));
        if (!$email) {
            throw new Exception("Email not sent");
        }
    }

}