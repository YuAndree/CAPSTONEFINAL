package cit.ojtnsync.caps.Entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "templates")
public class Template {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "hashed_file_name")
    private String hashedFileName;

    private String status;

    @Column(name = "ext_name")
    private String extName;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private AdminEntity createdBy;

    @Column(name = "created_at")
    private Timestamp createdAt;

    public Template() {
    }

    public Template(String title, String fileName, String hashedFileName, String status, String extName, AdminEntity createdBy, Timestamp createdAt) {
        this.title = title;
        this.fileName = fileName;
        this.hashedFileName = hashedFileName;
        this.status = status;
        this.extName = extName;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getHashedFileName() {
        return hashedFileName;
    }

    public void setHashedFileName(String hashedFileName) {
        this.hashedFileName = hashedFileName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getExtName() {
        return extName;
    }

    public void setExtName(String extName) {
        this.extName = extName;
    }

    public AdminEntity getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(AdminEntity createdBy) {
        this.createdBy = createdBy;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
