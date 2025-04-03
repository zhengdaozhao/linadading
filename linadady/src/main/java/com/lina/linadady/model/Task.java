package com.lina.linadady.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {
    @Id
    private String id;
    private String name;
    private String description;
    private String stepId;
    private String assignTeam;
    private String status;
    private List<InnerNode> innerNodes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
