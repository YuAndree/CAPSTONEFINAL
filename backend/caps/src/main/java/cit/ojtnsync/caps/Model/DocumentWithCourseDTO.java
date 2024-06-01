package cit.ojtnsync.caps.Model;

import java.sql.Timestamp;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Entity.UserEntity;

public class DocumentWithCourseDTO {

    private int id;
    private String comment;
    private String fileName;
    private String extName;
    private String hashedFileName;
    private String status;
    private int step;
    private Timestamp createdAt;
    private Requirement requirement;
    private UserEntity submittedBy;
    private int courseId;
    private String courseName;
    private int departmentId;
    private String departmentName;

    // Constructors, getters, and setters (omitted for brevity)

    // Default constructor
    public DocumentWithCourseDTO() {
    }

    // Parameterized constructor
    public DocumentWithCourseDTO(Document document) {
        this.id = document.getId();
        this.comment = document.getComment();
        this.fileName = document.getFileName();
        this.extName = document.getExtName();
        this.hashedFileName = document.getHashedFileName();
        this.requirement = document.getRequirement();
        this.submittedBy = document.getSubmittedBy();
        this.createdAt = document.getCreatedAt();
        this.status = document.getStatus();
        this.courseId = document.getSubmittedBy().getCourse().getId();
        this.courseName = document.getSubmittedBy().getCourse().getName();
        this.step = document.getStep();
        this.departmentId = document.getRequirement().getDepartment().getId();
        this.departmentName = document.getRequirement().getDepartment().getName();
    }

    // Getters and Setters (generated using your IDE)

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getExtName() {
        return extName;
    }

    public void setExtName(String extName) {
        this.extName = extName;
    }

    public String getHashedFileName() {
        return hashedFileName;
    }

    public void setHashedFileName(String hashedFileName) {
        this.hashedFileName = hashedFileName;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Requirement getRequirement() {
        return requirement;
    }

    public void setRequirement(Requirement requirement) {
        this.requirement = requirement;
    }

    public UserEntity getSubmittedBy() {
        return this.submittedBy;
    }

    public void setSubmittedBy(UserEntity submittedBy) {
        this.submittedBy = submittedBy;
    }

    public int getStep() {
        return this.step;
    }

    public void setStep(int step) {
        this.step = step;
    }

    public int getCourseId() {
        return this.courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return this.courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public int getDepartmentId() {
        return this.departmentId;
    }

    public void setDeparmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return this.departmentName;
    }

    public void setDeparmentName(String departmentName) {
        this.departmentName = departmentName;
    }
}
