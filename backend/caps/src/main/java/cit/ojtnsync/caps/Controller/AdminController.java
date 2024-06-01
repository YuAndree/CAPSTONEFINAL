package cit.ojtnsync.caps.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cit.ojtnsync.caps.Entity.AdminEntity;
import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Service.AdminService;
import cit.ojtnsync.caps.Service.DepartmentService;

@RestController
@CrossOrigin(origins = "*")
public class AdminController {
	
	@Autowired
	private AdminService adminService;

	@Autowired
    private DepartmentService departmentService;
	
	@GetMapping("/admin/login")
	@CrossOrigin(origins = "*")
	public ResponseEntity loginFaculty(
			@RequestParam(name = "facultyId", required = false) String facultyId,
			@RequestParam(name = "password", required = false, defaultValue = "0") String password) {    

		AdminEntity admin = adminService.findByFacultyId(facultyId);
		if (admin != null && admin.getPassword().equals(password)) {
			int departmentId = admin.getDepartment().getId();

			String adminType = "faculty";
			if(admin.getDepartment().getName().equals("NLO"))
				adminType = "NLO";
			
			Map<String, Object> adminWithDepartmentId = new HashMap<>();
			adminWithDepartmentId.put("admin", admin);
			adminWithDepartmentId.put("departmentId", departmentId);
			adminWithDepartmentId.put("adminType", adminType);
			
			return ResponseEntity.ok(adminWithDepartmentId);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Log-in invalid");
		}
	}

	
	@PostMapping("/adminsignup")
	@CrossOrigin(origins = "*")
    public ResponseEntity<String> signup(
		@RequestParam("facultyId") String facultyId,
        @RequestParam("firstName") String firstName,
        @RequestParam("lastName") String lastName,
        @RequestParam("department_id") int department_id,
        @RequestParam("email") String email,
        @RequestParam("password") String password) {

		Department department = departmentService.getDepartmentById(department_id);
        AdminEntity user = new AdminEntity(facultyId, firstName, lastName, department, email, password);
		AdminEntity existingUser = adminService.findByFacultyId(facultyId);
        // Check if the adminId already exists
        if (existingUser != null) {
            return new ResponseEntity<>("FacultyID already exists", HttpStatus.BAD_REQUEST);
        }

        // Save the user if adminId is unique
        adminService.createAdmin(user);
        return new ResponseEntity<>("Admin created successfully", HttpStatus.CREATED);
    }
	 @GetMapping("/admins")
	    public ResponseEntity<List<AdminEntity>> getAllAdmins() {
	        List<AdminEntity> admins = adminService.getAllAdmins();
	        if (admins.isEmpty()) {
	            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	        }
	        return new ResponseEntity<>(admins, HttpStatus.OK);
	    }
	
}
