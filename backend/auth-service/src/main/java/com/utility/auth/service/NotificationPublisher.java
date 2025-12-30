package com.utility.auth.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.utility.auth.config.RabbitMQConfig;
import com.utility.auth.dto.event.AccountApprovedEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishAccountApproved(AccountApprovedEvent event) {

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.ACCOUNT_ROUTING_KEY,
                event
        );
    }
}