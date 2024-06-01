package cit.ojtnsync.caps.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="tbl_admin")

public class AdminEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminid;

    @Column(name = "faculity_id", nullable = true, unique = true)
    
    private String facultyId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;

	@ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "department_id")
    private Department department;

    public AdminEntity() {
    	}
    

	public AdminEntity(Long adminid, String facultyId, String firstName, String lastName, Department department,
			String email, String password) {
		super();
		this.adminid = adminid;
		this.facultyId = facultyId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.department = department;
		this.email = email;
		this.password = password;
	}

	public AdminEntity(String facultyId, String firstName, String lastName, Department department,
			String email, String password) {
		super();
		this.facultyId = facultyId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.department = department;
		this.email = email;
		this.password = password;
	}


	public Long getAdminid() {
		return adminid;
	}

	public void setAdminid(Long adminid) {
		this.adminid = adminid;
	}

	public String getFacultyId() {
		return facultyId;
	}

	public void setFacultyId(String facultyId) {
		this.facultyId = facultyId;
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

	public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
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
    
}
