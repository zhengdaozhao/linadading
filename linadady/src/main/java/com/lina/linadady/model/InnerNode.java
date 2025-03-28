package com.lina.linadady.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InnerNode {
    private String id;
    private InnerNodeData data;
}