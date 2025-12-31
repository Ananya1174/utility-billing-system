package com.utility.billing.config;

import java.nio.charset.StandardCharsets;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    // 🔐 JWT Decoder
    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKey key = new SecretKeySpec(
                jwtSecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA384"
        );

        return NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS384)
                .build();
    }

    // 🔑 Extract ROLE_* from JWT
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter converter =
                new JwtGrantedAuthoritiesConverter();

        converter.setAuthoritiesClaimName("role");
        converter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtConverter =
                new JwtAuthenticationConverter();

        jwtConverter.setJwtGrantedAuthoritiesConverter(converter);
        return jwtConverter;
    }

    // 🔒 Billing Service Security Rules
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                /* ================= TARIFF MANAGEMENT ================= */
                .requestMatchers(HttpMethod.POST, "/tariffs/plans")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.PUT, "/tariffs/plans/*/deactivate")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.POST, "/tariffs/slabs")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/tariffs/plans/active")
                    .hasAnyRole("ADMIN", "BILLING_OFFICER")
                 .requestMatchers(HttpMethod.GET, "/tariffs")
                    .hasAnyRole("ADMIN", "BILLING_OFFICER", "CONSUMER")

                /* ================= BILL GENERATION ================= */
                .requestMatchers(HttpMethod.POST, "/bills")
                    .hasRole("BILLING_OFFICER")

                /* ================= BILL VIEW ================= */
                .requestMatchers(
                        HttpMethod.GET,
                        "/bills/**"
                ).hasAnyRole(
                        "CONSUMER",
                        "ACCOUNTS_OFFICER",
                        "BILLING_OFFICER"
                )

                /* ================= INTERNAL / DEFAULT ================= */
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth ->
                oauth.jwt(jwt ->
                    jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );

        return http.build();
    }
}