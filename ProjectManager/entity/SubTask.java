package com.example.ProjectManager.entity;
import jakarta.persistence.*;

@Entity
@Table(name="sub_task",
uniqueConstraints = @UniqueConstraint(columnNames = {"task_id", "subtaskName"})
)
public class SubTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subtaskName;

    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getSubtaskName() {
        return subtaskName;
    }

    public void setName(String name) {
        this.subtaskName = name;
    }
}
