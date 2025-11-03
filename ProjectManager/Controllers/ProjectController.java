package com.example.ProjectManager.Controllers;

import com.example.ProjectManager.entity.Project;
import com.example.ProjectManager.entity.User;
import com.example.ProjectManager.repository.ProjectRepository;
import com.example.ProjectManager.repository.UserRepository;
import com.example.ProjectManager.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class ProjectController {
    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/api/post/project")
    public ResponseEntity<?> addProject(@RequestBody Project project, Authentication authentication){
        if(project.getName() == null || project.getName().isEmpty()){
            return ResponseEntity.badRequest().body("Project must have a name!");
        }

        String username = authentication.getName();
        User loggedInUser = userRepository.findByUsername(username).get();
        Optional<Project> presenceCheck = projectRepository.findByNameAndOwner(project.getName(), loggedInUser);

        if(presenceCheck.isPresent()){
                return ResponseEntity.badRequest().body("Project already exists!");
        }
        project.setUser(loggedInUser);
        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(savedProject);
    }
    @GetMapping("/api/get/projects")
    public List<Project> getProjects(Authentication authentication){
        String username = authentication.getName();
        User loggedInUser = userRepository.findByUsername(username).get();

        List<Project> allProjects = projectRepository.findByOwner(loggedInUser);
        return allProjects;
    }
}
