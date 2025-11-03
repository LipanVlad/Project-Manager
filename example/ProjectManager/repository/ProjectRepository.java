package com.example.ProjectManager.repository;

import com.example.ProjectManager.entity.Project;
import com.example.ProjectManager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByName (String name);
    Optional<Project> findByNameAndOwner(String name, User owner);
    List<Project> findByOwner(User owner);
}

