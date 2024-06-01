package cit.ojtnsync.caps.Entity;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Requirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private Timestamp created_at;

    private String term;

    private String status;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "department_id")
    private Department department;

    @OneToMany(mappedBy = "requirement", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("requirement")
    private List<Document> documents = new ArrayList<>();

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "year_semester_id")
    private YearSemester yearSemester;

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public Requirement() {
    }

    // Parameterized constructor
    public Requirement(String title, Timestamp created_at, Department department, Course course, String term, YearSemester yearSemester) {
        this.title = title;
        this.created_at = created_at;
        this.department = department;
        this.course = course;
        this.term = term;
        this.yearSemester = yearSemester;
        this.status = "Active";
    }

    public Requirement(String title, Department department, Course course, String term, YearSemester yearSemester) {
        this.title = title;
        this.department = department;
        this.course = course;
        this.term = term;
        this.yearSemester = yearSemester;
        this.status = "Active";
    }

    // Getters and Setters (generated using your IDE)

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Timestamp getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public List<Document> getDocuments() {
        return this.documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    @PrePersist
    protected void onCreate() {
        created_at = Timestamp.from(Instant.now());
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public YearSemester getYearSemester() {
        return yearSemester;
    }

    public void setYearSemester(YearSemester yearSemester) {
        this.yearSemester = yearSemester;
    }
}
