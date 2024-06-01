package cit.ojtnsync.caps.Model;

import java.util.ArrayList;
import java.util.List;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Requirement;

public class RequirementWithCourseDTO {

    private int id;
    private String title;
    private String term;
    private String status;
    private int departmentId;
    private int courseId;
    private String courseName;
    private List<Document> documents = new ArrayList<>();

    // Constructors

    public RequirementWithCourseDTO() {
    }

    public RequirementWithCourseDTO(int id, String title, List<Document> documents, String term, String status, int departmentId, int courseId, String courseName) {
        this.id = id;
        this.title = title;
        this.documents = documents;
        this.term = term;
        this.status = status;
        this.departmentId = departmentId;
        this.courseId = courseId;
        this.courseName = courseName;
    }

    public RequirementWithCourseDTO(Requirement requirement) {
        this.id = requirement.getId();
        this.title = requirement.getTitle();
        this.documents = requirement.getDocuments();
        this.term = requirement.getTerm();
        this.status = requirement.getStatus();
        this.departmentId = requirement.getDepartment().getId();
        this.courseId = requirement.getCourse().getId();
        this.courseName = requirement.getCourse().getName();
    }

    // Getters and setters

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
}
