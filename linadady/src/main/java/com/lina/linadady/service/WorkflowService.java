package com.lina.linadady.service;

import com.lina.linadady.model.Step;
import com.lina.linadady.model.Task;
import com.lina.linadady.model.Workflow;
import com.lina.linadady.repository.StepRepository;
import com.lina.linadady.repository.TaskRepository;
import com.lina.linadady.repository.WorkflowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class WorkflowService {

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private StepRepository stepRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<Workflow> getAllWorkflows() {
        List<Workflow> workflows = new ArrayList<>();
        workflowRepository.findAll().forEach(workflow -> {
            if (workflow != null ) {
                // Fetch steps for the workflow
                List<Step> steps = StreamSupport.stream(stepRepository.findAll().spliterator(), false)
                    .filter(step -> step != null && step.getWorkflowId().equals(workflow.getId()))
                    .collect(Collectors.toList());

    
                // Fetch tasks for each step
                for (Step step : steps) {
                    List<Task> tasks = StreamSupport.stream(taskRepository.findAll().spliterator(), false)
                        .filter(task -> task != null && task.getStepId().equals(step.getId()))
                        .collect(Collectors.toList());
                    // step.setTasks(tasks);
                    step.setTasks(tasks.stream().sorted((t1, t2) -> t1.getName().compareTo(t2.getName())).collect(Collectors.toList()));
                }
                workflow.setSteps(steps);
                workflows.add(workflow);
            }
        });
        return workflows;
    }
    public Workflow getWorkflowById(String id) {
        Optional<Workflow> workflow = workflowRepository.findById(id);
        if (workflow.isPresent()) {
            Workflow wf = workflow.get();
            // Fetch steps for the workflow
            List<Step> steps = StreamSupport.stream(stepRepository.findAll().spliterator(), false)
                .filter(step -> step != null && step.getWorkflowId().equals(wf.getId()))
                .collect(Collectors.toList());


            // Fetch tasks for each step
            for (Step step : steps) {
                List<Task> tasks = StreamSupport.stream(taskRepository.findAll().spliterator(), false)
                    .filter(task -> task != null && task.getStepId().equals(step.getId()))
                    .collect(Collectors.toList());
                // step.setTasks(tasks);
                step.setTasks(tasks.stream().sorted((t1, t2) -> t1.getName().compareTo(t2.getName())).collect(Collectors.toList()));
            }
            wf.setSteps(steps);
            return wf;
        }
        return null;
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

        // Save workflow first
        // Workflow savedWorkflow = workflowRepository.save(workflow);

        // Save steps and tasks
        if (workflow.getSteps() != null) {
            workflow.getSteps().forEach(step -> {
                // Set ID if not provided
                if (step.getId() == null || step.getId().isEmpty()) {
                    step.setId(UUID.randomUUID().toString());
                }
                step.setWorkflowId(workflow.getId());
                step.setUpdatedAt(now);

                // Save tasks
                if (step.getTasks() != null && !step.getTasks().isEmpty()) {
                    step.getTasks().forEach(task -> {
                        // Set ID if not provided
                        if (task.getId() == null || task.getId().isEmpty()) {
                            task.setId(UUID.randomUUID().toString());
                        }
                        task.setStepId(step.getId());
                        task.setCreatedAt(now);
                        task.setUpdatedAt(now);

                        // Save task
                        taskRepository.save(task);

                    });
                };
                // Save step
                // 2025/4/9 toczpd add
                // step.setStatus(step.getLabel()=="STEP 1" ? "Active" : "Waiting");
                step.setStatus(step.getStatus());
                step.setTasks(null);
                stepRepository.save(step);
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

        // 2025/4/9 toczpd add
        workflow.setSteps(null);
        // Save workflow first
        Workflow savedWorkflow = workflowRepository.save(workflow);
        return savedWorkflow;
    }

    public Workflow updateWorkflow(Workflow workflow) {
        // Set update timestamp
        LocalDateTime now = LocalDateTime.now();
        workflow.setUpdatedAt(now);

        // Save workflow first
        // Workflow savedWorkflow = workflowRepository.save(workflow);

        // Update steps and tasks
        if (workflow.getSteps() != null) {
            workflow.getSteps().forEach(step -> {
                step.setWorkflowId(workflow.getId());
                step.setUpdatedAt(now);

                // Update tasks
                if (step.getTasks() != null && !step.getTasks().isEmpty()) {
                    step.getTasks().forEach(task -> {
                        task.setStepId(step.getId());
                        task.setUpdatedAt(now);

                        // Save or update task
                        taskRepository.save(task);
                    });
                }

                // Save or update step
                step.setTasks(null);
                stepRepository.save(step);
            });
        }

        if (workflow.getBranches() != null) {
            workflow.getBranches().forEach(branch -> {
                branch.setWorkflowId(workflow.getId());
            });
        }
       // Save workflow finally
       workflow.setSteps(null);
       Workflow savedWorkflow = workflowRepository.save(workflow);

        return savedWorkflow;
    }

    public void deleteWorkflow(String id) {
        // Fetch the workflow
        Optional<Workflow> workflow = workflowRepository.findById(id);
        if (workflow.isPresent()) {
                // Workflow wf = workflow.get();
                // Fetch steps for the workflow
                List<Step> steps = StreamSupport.stream(stepRepository.findAll().spliterator(), false)
                    .filter(step -> step != null && step.getWorkflowId().equals(workflow.get().getId()))
                    .collect(Collectors.toList());
    
                // Delete tasks for each step
                for (Step step : steps) {
                    List<Task> tasks = StreamSupport.stream(taskRepository.findAll().spliterator(), false)
                                            .filter(task -> task != null && task.getStepId().equals(step.getId()))
                                            .collect(Collectors.toList());
                    for (Task task : tasks) {
                        taskRepository.deleteById(task.getId());
                    }
                    // Delete step
                    stepRepository.deleteById(step.getId());
                }
                // Delete workflow
                workflowRepository.deleteById(id);
        }
    }
}