package cit.ojtnsync.caps.Entity;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.aspectj.apache.bcel.classfile.Module.Require;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private Timestamp createdAt;

    @OneToMany(mappedBy = "department", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Requirement> requirements = new ArrayList<>();

    @OneToMany(mappedBy = "department", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonIgnore
    private List<Course> courses = new ArrayList<>();

    // Constructors, getters, and setters (you can generate them using your IDE)

    public Department() {
        // Default constructor
    }

    public Department(String name, Timestamp createdAt) {
        this.name = name;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public List<Requirement> getRequirements() {
        return requirements.stream()
            .filter(requirement -> "Active".equals(requirement.getStatus()))
            .collect(Collectors.toList());
    }
    
    public void setRequirements(List<Requirement> requirements) {
        this.requirements = requirements;
    }
    
}
