package com.lina.linadady.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
// public class SecurityConfig extends WebSecurityConfiguration {
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**","/api/templates/**", "/api/workflows/**").permitAll()
                .anyRequest().authenticated())
            .build();
        // return http.build();
        return http.getOrBuild();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {        
        return new BCryptPasswordEncoder();
    }
}
