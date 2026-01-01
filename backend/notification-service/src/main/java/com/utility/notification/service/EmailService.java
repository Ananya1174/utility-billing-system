package com.utility.notification.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.utility.common.dto.event.BillGeneratedEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendCredentialsEmail(
            String to,
            String username,
            String tempPassword) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Your Utility Billing Account Credentials");

        message.setText("""
                Hello,

                Your account has been approved.

                Username: %s
                Temporary Password: %s

                Please login and change your password immediately.

                Regards,
                Utility Billing System
                """.formatted(username, tempPassword));

        mailSender.send(message);
    }
    public void sendRejectionEmail(String to) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Account Request Update");

        message.setText("""
                Hello,

                Your account request has been reviewed.
                Unfortunately, it was not approved at this time.

                Please contact support for further assistance.

                Regards,
                Utility Billing System
                """);

        mailSender.send(message);
    }
 // ---------------- BILL GENERATED ----------------
    public void sendBillEmail(String to, BillGeneratedEvent event) {

        if (to == null || to.isBlank()) {
            throw new IllegalArgumentException("Email is missing in BillGeneratedEvent");
        }

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("charliektest11@gmail.com");
        message.setTo(to);
        message.setSubject("Your Utility Bill Has Been Generated");

        message.setText("""
                Hello,

                Your utility bill has been generated successfully.

                Bill ID      : %s
                Utility Type : %s
                Tariff Plan  : %s
                Amount       : ₹%.2f
                Due Date     : %s

                Please pay before the due date to avoid penalties.

                Regards,
                Utility Billing System
                """.formatted(
                    event.getBillId(),
                    event.getUtilityType(),
                    event.getTariffPlan(),
                    event.getAmount(),
                    event.getDueDate()
                ));

        mailSender.send(message);
    }
}