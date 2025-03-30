package com.lina.linadady.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("workflow")
public class Workflow {
    @Id
    private String id;
    private String name;
    private String status;
    private List<Step> steps;
    private List<Branch> branches;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
