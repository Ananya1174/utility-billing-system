package com.utility.notification.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.utility.notification.config.RabbitMQConfig;
import com.utility.notification.dto.AccountApprovedEvent;
import com.utility.notification.service.EmailService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AccountNotificationListener {

    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.ACCOUNT_QUEUE)
    public void handleAccountApproved(AccountApprovedEvent event) {

        emailService.sendCredentialsEmail(
                event.getEmail(),
                event.getUsername(),
                event.getTemporaryPassword()
        );

        System.out.println(" Credentials email sent to " + event.getEmail());
    }
}