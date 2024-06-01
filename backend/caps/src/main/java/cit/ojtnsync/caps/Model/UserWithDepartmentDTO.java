package cit.ojtnsync.caps.Model;

import cit.ojtnsync.caps.Entity.Department;

public class UserWithDepartmentDTO {
    private Long userid;
    private String studentID;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private Department department;
    private String remarks;
    private boolean isVerified;
    // Add other department attributes as needed

    public UserWithDepartmentDTO(Long userid, String studentID, String firstName, String lastName, String phone, String email, Department department, String remarks, boolean isVerified) {
        this.userid = userid;
        this.studentID = studentID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.department = department;
        this.remarks = remarks;
        this.isVerified = isVerified;
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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean isVerified) {
        this.isVerified = isVerified;
    }

}
