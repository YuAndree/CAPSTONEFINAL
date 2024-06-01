package cit.ojtnsync.caps.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import cit.ojtnsync.caps.Entity.Course;
import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Service.CourseService;
import cit.ojtnsync.caps.Service.DepartmentService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private DepartmentService departmentService;

    // Get all courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }

    // Get course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable int id) {
        Course course = courseService.getCourseById(id);
        if (course != null) {
            return ResponseEntity.ok(course);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new course
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return new ResponseEntity<>(createdCourse, HttpStatus.CREATED);
    }

    // Update an existing course
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable int id, @RequestBody Course course) {
        Course updatedCourse = courseService.updateCourse(id, course);
        if (updatedCourse != null) {
            return ResponseEntity.ok(updatedCourse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a course by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable int id) {
        boolean deleted = courseService.deleteCourse(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get")
    public ResponseEntity<List<Course>> getCoursesByDepartmentId(@RequestParam(name = "departmentId") int departmentId, @RequestParam(name = "ysId") int ysId) {
        Department department = departmentService.getDepartmentById(departmentId);
        List<Course> courses;
        if(department.getName().equalsIgnoreCase("nlo"))
            courses = courseService.getAllCourses();
        else
            courses = courseService.getCoursesByDepartmentId(departmentId);
        
        if (!courses.isEmpty()) {
            List<Course> filteredCourses = courses.stream()
                .map(course -> {
                    List<UserEntity> students = course.getStudents().stream()
                    .filter(student -> student.getYearSemester().getId() == ysId)
                    .collect(Collectors.toList());
                    course.setStudents(students);
                    return course;
                })
                .collect(Collectors.toList());

            return ResponseEntity.ok(filteredCourses);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/get/department/{departmentId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<Course>> getCoursesByDepartmentIdNew(@PathVariable int departmentId) {
        Department department = departmentService.getDepartmentById(departmentId);
        List<Course> courses;
        if(department.getName().equalsIgnoreCase("nlo"))
            courses = courseService.getAllCourses();
        else
            courses = courseService.getCoursesByDepartmentId(departmentId);
        
        if (!courses.isEmpty()) {
            return ResponseEntity.ok(courses);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Course>> getCoursesByDepartmentIdAndUserAttributes(
            @RequestParam(name = "departmentId") int departmentId,
            @RequestParam(name = "searchVal") String searchVal) {
        
        List<Course> courses = courseService.getCoursesByDepartmentIdAndUserAttributes(departmentId, searchVal);
        
        if (!courses.isEmpty()) {
            return ResponseEntity.ok(courses);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
