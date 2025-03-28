package com.lina.linadady.model;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@RedisHash("templates")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Template {
    @Id
    private String id;
    private String label;
    private String nodeType;
    private List<InnerNode> innerNodes;
    private LocalDateTime createdAt;
}
