package com.lina.linadady.controller;

import com.lina.linadady.model.Step;
import com.lina.linadady.service.StepService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/steps")
public class StepController {

    @Autowired
    private StepService stepService;

    @GetMapping("/{id}")
    public ResponseEntity<Step> getStepById(@PathVariable String id) {
        Step step = stepService.getStepById(id);
        if (step != null) {
            return ResponseEntity.ok(step);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/workflow/{workflowId}")
    public ResponseEntity<List<Step>> getStepsByWorkflowId(@PathVariable String workflowId) {
        List<Step> steps = stepService.getStepsByWorkflowId(workflowId);
        return ResponseEntity.ok(steps);
    }

    @PostMapping
    public ResponseEntity<Step> saveStep(@RequestBody Step step) {
        Step savedStep = stepService.saveStep(step);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStep);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Step> updateStep(@PathVariable String id, @RequestBody Step step) {
        if (!id.equals(step.getId())) {
            return ResponseEntity.badRequest().build();
        }
        Step updatedStep = stepService.updateStep(step);
        return ResponseEntity.ok(updatedStep);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStep(@PathVariable String id) {
        stepService.deleteStep(id);
        return ResponseEntity.noContent().build();
    }
}
