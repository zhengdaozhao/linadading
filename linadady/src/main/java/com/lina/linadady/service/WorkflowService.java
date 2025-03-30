package com.lina.linadady.service;

import com.lina.linadady.model.Workflow;
import com.lina.linadady.repository.WorkflowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkflowService {

    @Autowired
    private WorkflowRepository workflowRepository;

    public List<Workflow> getAllWorkflows() {
        List<Workflow> workflows = new ArrayList<>();
        workflowRepository.findAll().forEach(workflows::add);
        return workflows;
    }

    public Workflow getWorkflowById(String id) {
        Optional<Workflow> workflow = workflowRepository.findById(id);
        return workflow.orElse(null);
    }

    public Workflow saveWorkflow(Workflow workflow) {
        // Set ID if not provided
        if (workflow.getId() == null || workflow.getId().isEmpty()) {
            workflow.setId(UUID.randomUUID().toString());
        }
        
        // Set timestamps
        LocalDateTime now = LocalDateTime.now();
        workflow.setCreatedAt(now);
        workflow.setUpdatedAt(now);
        
        // Set workflow ID for steps and branches
        if (workflow.getSteps() != null) {
            workflow.getSteps().forEach(step -> {
                if (step.getId() == null || step.getId().isEmpty()) {
                    step.setId(UUID.randomUUID().toString());
                }
                step.setWorkflowId(workflow.getId());
                step.setUpdatedAt(now);
            });
        }
        
        if (workflow.getBranches() != null) {
            workflow.getBranches().forEach(branch -> {
                if (branch.getId() == null || branch.getId().isEmpty()) {
                    branch.setId(UUID.randomUUID().toString());
                }
                branch.setWorkflowId(workflow.getId());
            });
        }
        
        return workflowRepository.save(workflow);
    }

    public Workflow updateWorkflow(Workflow workflow) {
        // Set update timestamp
        workflow.setUpdatedAt(LocalDateTime.now());
        
        // Update workflow ID for steps and branches
        if (workflow.getSteps() != null) {
            workflow.getSteps().forEach(step -> {
                step.setWorkflowId(workflow.getId());
                step.setUpdatedAt(LocalDateTime.now());
            });
        }
        
        if (workflow.getBranches() != null) {
            workflow.getBranches().forEach(branch -> {
                branch.setWorkflowId(workflow.getId());
            });
        }
        
        return workflowRepository.save(workflow);
    }

    public void deleteWorkflow(String id) {
        workflowRepository.deleteById(id);
    }
}
