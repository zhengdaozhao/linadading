package com.lina.linadady.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Branch {
    @Id
    private String id;
    private String label;
    private String workflowId;
    private String upperStep;
    private String nextStep;
    private String rightStep;
    private String condition;
    private Map<String, Double> position;
}
