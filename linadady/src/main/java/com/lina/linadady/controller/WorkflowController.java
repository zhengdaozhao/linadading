package com.lina.linadady.controller;

import com.lina.linadady.model.Workflow;
import com.lina.linadady.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/workflows")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    // Get all workflows
    @GetMapping
    public ResponseEntity<List<Workflow>> getAllWorkflows() {
        List<Workflow> workflows = workflowService.getAllWorkflows();
        return ResponseEntity.ok(workflows);
    }

    // Get workflow by ID
    @GetMapping("/{id}")
    public ResponseEntity<Workflow> getWorkflowById(@PathVariable String id) {
        Workflow workflow = workflowService.getWorkflowById(id);
        if (workflow == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(workflow);
    }

    // Save new workflow
    @PostMapping
    public ResponseEntity<Workflow> saveWorkflow(@RequestBody Workflow workflow) {
        Workflow savedWorkflow = workflowService.saveWorkflow(workflow);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedWorkflow);
    }

    // Update existing workflow
    @PutMapping("/{id}")
    public ResponseEntity<Workflow> updateWorkflow(@PathVariable String id, @RequestBody Workflow updatedWorkflow) {
        Workflow workflow = workflowService.getWorkflowById(id);
        if (workflow == null) {
            return ResponseEntity.notFound().build();
        }

        updatedWorkflow.setId(id); // Ensure ID is not changed
        Workflow savedWorkflow = workflowService.updateWorkflow(updatedWorkflow);
        return ResponseEntity.ok(savedWorkflow);
    }

    // Delete workflow
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable String id) {
        Workflow workflow = workflowService.getWorkflowById(id);
        if (workflow == null) {
            return ResponseEntity.notFound().build();
        }

        workflowService.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }
}
