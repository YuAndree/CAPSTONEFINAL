package cit.ojtnsync.caps.Controller;

import java.util.List;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cit.ojtnsync.caps.Entity.Course;
import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Entity.YearSemester;
import cit.ojtnsync.caps.Model.UserWithCourseDTO;
import cit.ojtnsync.caps.Model.UserWithDepartmentDTO;
import cit.ojtnsync.caps.Service.CourseService;
import cit.ojtnsync.caps.Service.DepartmentService;
import cit.ojtnsync.caps.Service.UserService;
import cit.ojtnsync.caps.Service.YearSemesterService;

@RestController
@CrossOrigin(origins = "*")
public class UserController {
	
	@Autowired
	private UserService userService;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private YearSemesterService yearSemesterService;

    @GetMapping("/users")
    public ResponseEntity<List<UserWithCourseDTO>> getAllUsersWithCourse() {
        List<UserEntity> users = userService.getUsersByStatus("active");
        List<UserWithCourseDTO> usersWithCourse = new ArrayList<>();

        for (UserEntity user : users) {
            usersWithCourse.add(new UserWithCourseDTO(
                    user.getUserid(),
                    user.getStudentID(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getCompanyName(),
                    user.getCompanyAddress(),
                    user.getContactPerson(),
                    user.getDesignation(),
                    user.getDateStarted(),
                    user.getPhone(),
                    user.getEmail(),
                    user.getCourse(),
                    user.getRemarks(),
                    user.getYearSemester().getId(),
                    user.isVerified()
            ));
        }

        if (!usersWithCourse.isEmpty()) {
            return ResponseEntity.ok(usersWithCourse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


	
	@GetMapping("/getByUserid")
    public ResponseEntity findByUserid(
            @RequestParam(name = "studentID", required = false, defaultValue = "0") String studentID,
            @RequestParam(name = "password", required = false, defaultValue = "0") String password) {

        UserEntity user = userService.findByStudentID(studentID);

        if (user != null && user.getPassword().equals(password)) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Log-in invalid");
        }
    }

    @GetMapping("/searchUsers")
    public ResponseEntity<List<UserWithCourseDTO>> searchUsers(
            @RequestParam(name = "searchVal", required = true) String searchVal) {

        // Search for users by userid, firstName, lastName, or email
        List<UserEntity> users = userService.searchUsers(searchVal);
        List<UserWithCourseDTO> usersWithCourse = new ArrayList<>();

        for (UserEntity user : users) {
            usersWithCourse.add(new UserWithCourseDTO(
                    user.getUserid(),
                    user.getStudentID(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getCompanyName(),
                    user.getCompanyAddress(),
                    user.getContactPerson(),
                    user.getDesignation(),
                    user.getDateStarted(),
                    user.getPhone(),
                    user.getEmail(),
                    user.getCourse(),
                    user.getRemarks(),
                    user.getYearSemester().getId(),
                    user.isVerified()
            ));
        }

        return ResponseEntity.ok(usersWithCourse);

    }

    @GetMapping("/searchUserAttributes")
    public ResponseEntity<List<UserWithCourseDTO>> searchUserAttributes(
            @RequestParam(name = "courseName", required = false) String courseName,
            @RequestParam(name = "lastName", required = false) String lastName,
            @RequestParam(name = "firstName", required = false) String firstName) {

        // Search for users by Course.name, lastName, or userName
        List<UserWithCourseDTO> users = userService.searchUserAttributes(courseName, lastName, firstName);
        List<UserWithCourseDTO> usersWithCourse = new ArrayList<>();

        for (UserWithCourseDTO user : users) {
            usersWithCourse.add(new UserWithCourseDTO(
                    user.getUserid(),
                    user.getStudentID(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getCompanyName(),
                    user.getCompanyAddress(),
                    user.getContactPerson(),
                    user.getDesignation(),
                    user.getDateStarted(),
                    user.getPhone(),
                    user.getEmail(),
                    user.getCourse(),
                    user.getRemarks(),
                    user.getYearSemesterId(),
                    user.isVerified()
            ));
        }

        return ResponseEntity.ok(usersWithCourse);
    }

    @GetMapping("/users/department/{departmentId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<UserWithCourseDTO>> getUsersByDepartmentId(@PathVariable int departmentId) {
        List<UserWithCourseDTO> users = userService.getUsersByDepartmentId(departmentId);
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users/course/{courseId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<UserWithCourseDTO>> getUsersByCourseId(@PathVariable int courseId) {
        List<UserWithCourseDTO> users = userService.getUsersByCourseId(courseId);
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/user/{studentID}/verify")
    public ResponseEntity<String> verifyUser(@PathVariable("studentID") String studentID) {
        // Fetch the user from the database
        UserEntity user = userService.findByStudentID(studentID);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the user's isVerified field to true
        user.setVerified(true);

        // Save the updated user
        userService.updateUser(user);

        return ResponseEntity.ok("User verified successfully");
    }

    @PutMapping("/user/update/{studentId}")
    public ResponseEntity<String> updateStudent(
        @PathVariable("studentId") String studentId,
        @RequestParam(name = "firstName", required = false) String firstName,
        @RequestParam(name = "lastName", required = false) String lastName,
        @RequestParam(name = "companyName", required = false) String companyName,
        @RequestParam(name = "companyAddress", required = false) String companyAddress,
        @RequestParam(name = "contactPerson", required = false) String contactPerson,
        @RequestParam(name = "designation", required = false) String designation,
        @RequestParam(name = "dateStarted", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateStarted,
        @RequestParam(name = "phone", required = false) String phone,
        @RequestParam(name = "email", required = false) String email,
        @RequestParam(name = "status", required = false) String status
    ) {
        // Fetch the user from the database
        UserEntity user = userService.findByStudentID(studentId);

        // Update the user's properties if they exist in the form data
        if (firstName != null) 
            user.setFirstName(firstName);
        if (lastName != null) 
            user.setLastName(lastName);
        if (companyName != null) 
            user.setCompanyName(companyName);
        if (companyAddress != null) 
            user.setCompanyAddress(companyAddress);
        if (contactPerson != null) 
            user.setContactPerson(contactPerson);
        if (designation != null) 
            user.setDesignation(designation);
        if (dateStarted != null) 
            user.setDateStarted(dateStarted);
        if (phone != null) 
            user.setPhone(phone);
        if (email != null) 
            user.setEmail(email);
        if (status != null) 
            user.setStatus(status);

        // Save the updated user
        userService.createUser(user);

        return ResponseEntity.ok("User updated successfully");
    }


    @PutMapping("/user/remarks/update/{userid}")
    public ResponseEntity<String> updateRemarks(
        @PathVariable("userid") long userid,
        @RequestParam(name = "remarks", required = true) String remarks
    ) {
        UserEntity user = userService.findById(userid);

        user.setRemarks(remarks);
        userService.createUser(user);

        return ResponseEntity.ok("Remarks updated successfully");
    }


    @GetMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestParam(name = "studentID", required = false, defaultValue = "0") String studentID,
            @RequestParam(name = "password", required = false, defaultValue = "0") String password) {

        UserEntity user = userService.findByStudentID(studentID);

        if (user != null && user.getPassword().equals(password) && user.getStatus().equals("active")) {
            // User authentication successful
            LoginResponse response = new LoginResponse("Login successful", user);
            return ResponseEntity.ok(response);
        } else {
            // User authentication failed
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse("Login invalid", null));
        }
    }

    @DeleteMapping("/user/{studentID}")
    public ResponseEntity<String> deleteUser(@PathVariable("studentID") String studentID) {
        // Fetch the user from the database
        UserEntity user = userService.findByStudentID(studentID);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Delete the user
        userService.deleteUser(user);

        return ResponseEntity.ok("User deleted successfully");
    }


    // Custom class to represent the login response
    private static class LoginResponse {
        private final String message;
        private final UserWithCourseDTO user;

        public LoginResponse(String message, UserEntity user) {
            this.message = message;
            this.user = new UserWithCourseDTO(user);
        }

        public String getMessage() {
            return message;
        }

        public UserWithCourseDTO getUser() {
            return user;
        }
    }
	
	@PostMapping("/signup")
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> signup(
        @RequestParam("studentID") String studentID,
        @RequestParam("firstName") String firstName,
        @RequestParam("lastName") String lastName,
        @RequestParam("phone") String phone,
        @RequestParam("course_id") int course_id,
        @RequestParam("email") String email,
        @RequestParam("password") String password,
        @RequestParam("ysId") int ysId) {

        Course course = courseService.getCourseById(course_id);
        YearSemester yearSemester = yearSemesterService.getYearSemesterById(ysId);
        UserEntity user = new UserEntity(studentID, firstName, lastName, null, null, null, null, null, course, email, phone, password, false, yearSemester);
        // Check if the studentID already exists
        if (userService.existsByStudentID(user.getStudentID())) {
            return new ResponseEntity<>("StudentID already exists", HttpStatus.BAD_REQUEST);
        }

        // Save the user if studentID is unique
        userService.createUser(user);
        return new ResponseEntity<>("User created successfully", HttpStatus.CREATED);
    }
	
	@GetMapping("/userByStudentID/{studentID}")
    public ResponseEntity<UserEntity> getUserByStudentID(@PathVariable String studentID) {
        // Call the service method to fetch user data by studentID
        UserEntity user = userService.findByStudentID(studentID);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/userByID/{id}")
    public ResponseEntity<UserWithCourseDTO> getUserByID(@PathVariable long id) {
        // Call the service method to fetch user data by id
        UserEntity user = userService.findById(id);
        if(user != null) {
            UserWithCourseDTO userWithCourseDTO = new UserWithCourseDTO(
                user.getUserid(),
                user.getStudentID(),
                user.getFirstName(),
                user.getLastName(),
                user.getCompanyName(),
                user.getCompanyAddress(),
                user.getContactPerson(),
                user.getDesignation(),
                user.getDateStarted(),
                user.getPhone(),
                user.getEmail(),
                user.getCourse(),
                user.getRemarks(),
                user.getYearSemester().getId(),
                user.isVerified()
            );
            return ResponseEntity.ok(userWithCourseDTO);
        }
        else
            return ResponseEntity.notFound().build();
    }
}
