package com.example.ProjectManager.Controllers;

import com.example.ProjectManager.entity.Project;
import com.example.ProjectManager.entity.Task;
import com.example.ProjectManager.repository.ProjectRepository;
import com.example.ProjectManager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
public class TaskController {

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    ProjectRepository projectRepository;

    @PostMapping("/api/post/task/project/{projectId}")
    public ResponseEntity<?> addTask(@RequestBody Task task, @PathVariable long projectId){
        if(task.getTaskName() == null || task.getTaskName().isEmpty()){
            return ResponseEntity.badRequest().body("Task must have a name!");
        }

        Optional<Project> optionalProject = projectRepository.findById(projectId);
        if(optionalProject.isPresent()){
            Project project = optionalProject.get();
            task.setProject(project);
            try {
                Task savedTask = taskRepository.save(task);
                return ResponseEntity.ok(savedTask);
            }catch(DataIntegrityViolationException e){
                return ResponseEntity.badRequest().body("Task already exists!");
            }
        }

        return ResponseEntity.badRequest().body("Project with id " + projectId + " does not exist!");
    }
    @GetMapping("/api/get/tasks/{projectId}")
    public List<Task> getTasks(@PathVariable long projectId){
        Optional<Project> optionalProject = projectRepository.findById(projectId);
        if(optionalProject.isPresent()) {
            Project project = optionalProject.get();
            return project.getTasks();
        }else{
            return Collections.emptyList();
        }
    }
}
