package com.lina.linadady.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Step {
    @Id
    private String id;
    private String label;
    private String workflowId;
    private String templateId;
    private String templateName;
    private List<InnerNode> innerNodes;
    private String upperStep;
    private String nextStep;
    private String assignTo;
    private String status;
    private Map<String, Double> position;
    private LocalDateTime updatedAt;
}
