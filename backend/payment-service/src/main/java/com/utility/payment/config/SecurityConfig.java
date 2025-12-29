package com.utility.payment.config;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public JwtDecoder jwtDecoder(Environment env) {

		String jwtSecret = env.getRequiredProperty("jwt.secret");

		SecretKey key = new SecretKeySpec(jwtSecret.getBytes(), "HmacSHA384");

		return NimbusJwtDecoder.withSecretKey(key)
				.macAlgorithm(org.springframework.security.oauth2.jose.jws.MacAlgorithm.HS384).build();
	}

	@Bean
	public JwtAuthenticationConverter jwtAuthenticationConverter() {

		JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();

		converter.setAuthoritiesClaimName("role");
		converter.setAuthorityPrefix("ROLE_");

		JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();

		jwtConverter.setJwtGrantedAuthoritiesConverter(converter);
		return jwtConverter;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

	    http
	        .csrf(csrf -> csrf.disable())
	        .authorizeHttpRequests(auth -> auth

	            
	            .requestMatchers(HttpMethod.POST, "/payments/online/initiate")
	                .hasRole("CONSUMER")

	            .requestMatchers(HttpMethod.POST, "/payments/online/confirm")
	                .hasRole("CONSUMER")

	            
	            .requestMatchers(HttpMethod.POST, "/payments/offline")
	                .hasRole("ACCOUNTS_OFFICER")

	            
	            .requestMatchers("/payments/bill/**")
	                .hasAnyRole("CONSUMER", "ACCOUNTS_OFFICER")

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