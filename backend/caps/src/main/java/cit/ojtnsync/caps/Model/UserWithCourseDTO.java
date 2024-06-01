package cit.ojtnsync.caps.Model;

import java.util.Date;

import cit.ojtnsync.caps.Entity.Course;
import cit.ojtnsync.caps.Entity.UserEntity;

public class UserWithCourseDTO {
    private Long userid;
    private String studentID;
    private String firstName;
    private String lastName;
    private String companyName;
    private String companyAddress;
    private String contactPerson;
    private String designation;
    private Date dateStarted;
    private String phone;
    private String email;
    private Course course;
    private String remarks;
    private int yearSemesterId;
    private String yearSemesterYear;
    private int yearSemesterSemester;
    private boolean isVerified;

    public UserWithCourseDTO(Long userid, String studentID, String firstName, String lastName, String companyName, String companyAddress, String contactPerson, String designation, Date dateStarted, String phone, String email, Course course, String remarks, int yearSemesterId, boolean isVerified) {
        this.userid = userid;
        this.studentID = studentID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.companyName = companyName;
        this.companyAddress = companyAddress;
        this.contactPerson = contactPerson;
        this.designation = designation;
        this.dateStarted = dateStarted;
        this.phone = phone;
        this.email = email;
        this.course = course;
        this.remarks = remarks;
        this.yearSemesterId = yearSemesterId;
        this.isVerified = isVerified;
    }

    public UserWithCourseDTO(UserEntity userEntity) {
        this.userid = userEntity.getUserid();
        this.studentID = userEntity.getStudentID();
        this.firstName = userEntity.getFirstName();
        this.lastName = userEntity.getLastName();
        this.companyName = userEntity.getCompanyName();
        this.companyAddress = userEntity.getCompanyAddress();
        this.contactPerson = userEntity.getContactPerson();
        this.designation = userEntity.getDesignation();
        this.dateStarted = userEntity.getDateStarted();
        this.phone = userEntity.getPhone();
        this.email = userEntity.getEmail();
        this.course = userEntity.getCourse();
        this.remarks = userEntity.getRemarks();
        this.yearSemesterId = userEntity.getYearSemester().getId();
        this.isVerified = userEntity.isVerified();
        this.yearSemesterYear = userEntity.getYearSemester().getYear();
        this.yearSemesterSemester = userEntity.getYearSemester().getSemester();
    }

    public String getYearSemesterYear() {
        return this.yearSemesterYear;
    }

    public void setYearSemesterYear(String yearSemesterYear) {
        this.yearSemesterYear = yearSemesterYear;
    }

    public int getYearSemesterSemester() {
        return this.yearSemesterSemester;
    }

    public void setYearSemesterSemester(int yearSemesterSemester) {
        this.yearSemesterSemester = yearSemesterSemester;
    }

    public Long getUserid() {
        return userid;
    }

    public void setUserid(Long userid) {
        this.userid = userid;
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

    public void setLastName(String lastName) {
        this.lastName = lastName;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public int getYearSemesterId() {
        return yearSemesterId;
    }

    public void setYearSemesterId(int yearSemesterId) {
        this.yearSemesterId = yearSemesterId;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }
    
}
