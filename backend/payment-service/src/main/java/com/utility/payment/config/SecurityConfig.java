package com.utility.payment.config;

import com.utility.payment.security.JwtAuthenticationFilter;
import com.utility.payment.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtUtil jwtUtil;

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtUtil);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // ---------- PAYMENT APIs ----------
                .requestMatchers(HttpMethod.POST,
                        "/payments/online/initiate",
                        "/payments/online/confirm")
                    .hasRole("CONSUMER")

                .requestMatchers(HttpMethod.POST,
                        "/payments/offline")
                    .hasRole("ACCOUNTS_OFFICER")

                .requestMatchers(HttpMethod.GET,
                        "/payments/bill/**",
                        "/payments/consumer/**",
                        "/payments/outstanding/**",
                        "/payments/invoice/**")
                    .hasAnyRole("CONSUMER", "ACCOUNTS_OFFICER")

                .anyRequest().authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}