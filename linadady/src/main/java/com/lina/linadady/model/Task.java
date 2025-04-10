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
@RedisHash("tasks")
public class Task {
    @Id
    private String id;
    private String name;
    private String description;
    private String stepId;
    private String assignTeam;
    private String status;
    private String templateId;
    private List<InnerNode> innerNodes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
