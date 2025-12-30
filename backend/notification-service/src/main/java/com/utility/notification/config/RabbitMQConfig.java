package com.utility.notification.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "notification.exchange";
    public static final String ACCOUNT_QUEUE = "account.notification.queue";
    public static final String ACCOUNT_ROUTING_KEY = "account.approved";
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(EXCHANGE);
    }

    @Bean
    public Queue accountQueue() {
        return new Queue(ACCOUNT_QUEUE);
    }

    @Bean
    public Binding accountBinding() {
        return BindingBuilder
                .bind(accountQueue())
                .to(exchange())
                .with(ACCOUNT_ROUTING_KEY);
    }
}