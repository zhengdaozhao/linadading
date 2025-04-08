package com.lina.linadady.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("user")
public class User {
    @Id
    private String id;
    private String mail;
    private String password;
    private String team;
    private boolean isManager;
    private LocalDateTime createAt;
    private LocalDateTime upadatAt;

    // Getters and Setters
}
