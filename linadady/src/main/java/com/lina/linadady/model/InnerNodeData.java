package com.lina.linadady.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InnerNodeData {
    private String label;
    private String nodeType;
    private String fields;
}
