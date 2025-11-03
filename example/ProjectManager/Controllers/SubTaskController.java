package com.example.ProjectManager.Controllers;

import com.example.ProjectManager.entity.SubTask;
import com.example.ProjectManager.entity.Task;
import com.example.ProjectManager.repository.SubTaskRepository;
import com.example.ProjectManager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
public class SubTaskController {

    @Autowired
    TaskRepository taskRepository;
    @Autowired
    SubTaskRepository subTaskRepository;

    @PostMapping("/api/post/subtask/{taskId}")
    public ResponseEntity<?> addSubTask(@RequestBody SubTask subTask, @PathVariable long taskId){
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if(taskOptional.isPresent()) {
            if(subTask.getSubtaskName() == null || subTask.getSubtaskName().isEmpty()){
                return ResponseEntity.badRequest().body("Subtask must have a name!");
            }
            Task task = taskOptional.get();
            subTask.setTask(task);
            try {
                SubTask savedSubtask = subTaskRepository.save(subTask);
                return ResponseEntity.ok().body(savedSubtask);
            }catch (DataIntegrityViolationException e){
                return ResponseEntity.badRequest().body("Subtask already exists!");
            }
        }else{
            return ResponseEntity.badRequest().body("Task id is invalid!");
        }

    }
    @GetMapping("/api/get/subtasks/{taskId}")
    public List<SubTask> subTaskList(@PathVariable Long taskId){
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if(taskOptional.isPresent()) {
            Task task = taskOptional.get();
            return task.getSubTasks();
        }else{
            return Collections.emptyList();
        }
    }
}
