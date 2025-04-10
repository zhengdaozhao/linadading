package com.lina.linadady.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lina.linadady.model.Task;
import com.lina.linadady.service.TaskService;

@RestController
@CrossOrigin
@RequestMapping("/api/tasks")
public class TaskController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> searchTasks(@RequestParam(required = false) String taskId,
                                 @RequestParam(required = false) String status,
                                 @RequestParam(required = false) String assignedStaffName) {
        logger.info("taskId:"+taskId); 
        logger.info("status:"+status); 
        logger.info("assignedStaffName:"+assignedStaffName); 
        return taskService.searchTasks(taskId, status, assignedStaffName);
    }

    @PutMapping("/{taskId}")
    public Task updateTask(@PathVariable String taskId, @RequestBody Task taskData) {
        return taskService.updateTask(taskId, taskData);
    }
}
