package cit.ojtnsync.caps.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name="tbl_user")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userid;

    @Column(name = "student_id", nullable = false, unique = true)
    private String studentID;

    private String firstName;
    private String lastName;
    private String companyName;
    private String companyAddress;
    private String contactPerson;
    private String designation;

    @Temporal(TemporalType.DATE)
    private Date dateStarted;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "course_id")
    private Course course;

    private String email;
    private String password;
    private String phone;
    
    private boolean isVerified;
    private String remarks;

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "year_semester_id")
    private YearSemester yearSemester;

    private String status = "active";

    public UserEntity() {
    }

    public UserEntity(Long userid, String studentID, String firstName, String lastName, String companyName, String companyAddress, String contactPerson, String designation, Date dateStarted, Course course, String email, String phone, boolean isVerified, String remarks, YearSemester yearSemester, String status) {
        this.userid = userid;
        this.studentID = studentID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.contactPerson = contactPerson;
        this.designation = designation;
        this.dateStarted = dateStarted;
        this.course = course;
        this.email = email;
        this.phone = phone;
        this.isVerified = isVerified;
        this.remarks = remarks;
        this.yearSemester = yearSemester;
        this.status = status;
    }

    public UserEntity(String studentID, String firstName, String lastName, String companyName, String companyAddress, String contactPerson, String designation, Date dateStarted, Course course, String email, String phone, String password, boolean isVerified, YearSemester yearSemester) {
        this.studentID = studentID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.contactPerson = contactPerson;
        this.designation = designation;
        this.dateStarted = dateStarted;
        this.course = course;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.isVerified = isVerified;
        this.yearSemester = yearSemester;
    }

    public Long getUserid() {
        return userid;
    }

    public String getStudentID() {
        return studentID;
    }

    public void setStudentID(String studentID) {
        this.studentID = studentID;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyAddress() {
        return companyAddress;
    }

    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Date getDateStarted() {
        return dateStarted;
    }

    public void setDateStarted(Date dateStarted) {
        this.dateStarted = dateStarted;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public YearSemester getYearSemester() {
        return yearSemester;
    }

    public void setYearSemester(YearSemester yearSemester) {
        this.yearSemester = yearSemester;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
