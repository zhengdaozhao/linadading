package com.lina.linadady.service;

import com.lina.linadady.model.Task;
import com.lina.linadady.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

        public List<Task> searchTasks(String taskId, String status, String assignedStaffName) {
            Iterable<Task> tasksIterable = taskRepository.findAll();
            List<Task> tasks = new ArrayList<>();
            tasksIterable.forEach(tasks::add);
            return tasks.stream()
                    .filter(task -> task!=null && (taskId == "" || task.getId().equals(taskId))
                            && (status == "" || task.getStatus().equals(status))
                            && (assignedStaffName == "" || task.getAssignTeam().equals(assignedStaffName)))
                    .collect(Collectors.toList());
        }
    public Task updateTask(String taskId, Task taskData) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setAssignTeam(taskData.getAssignTeam());
        task.setStatus(taskData.getStatus());
        task.setDescription(taskData.getDescription());
        task.setInnerNodes(taskData.getInnerNodes());
        return taskRepository.save(task);
    }
}
