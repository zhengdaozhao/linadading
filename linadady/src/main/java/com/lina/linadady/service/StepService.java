package com.lina.linadady.service;

import com.lina.linadady.model.Step;
import com.lina.linadady.repository.StepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class StepService {

    @Autowired
    private StepRepository stepRepository;

    public Step getStepById(String id) {
        return stepRepository.findById(id).orElse(null);
    }

    public List<Step> getStepsByWorkflowId(String workflowId) {
        return StreamSupport.stream(stepRepository.findAll().spliterator(), false)
                .filter(step -> step !=null && workflowId.equals(step.getWorkflowId()))
                .collect(Collectors.toList());
    }

    public Step saveStep(Step step) {
        step.setUpdatedAt(LocalDateTime.now());
        return stepRepository.save(step);
    }

    public Step updateStep(Step step) {
        step.setUpdatedAt(LocalDateTime.now());
        return stepRepository.save(step);
    }

    public void deleteStep(String id) {
        stepRepository.deleteById(id);
    }
}
