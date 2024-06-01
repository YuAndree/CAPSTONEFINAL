package cit.ojtnsync.caps.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cit.ojtnsync.caps.Entity.Course;
import cit.ojtnsync.caps.Repository.CourseRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get course by ID
    public Course getCourseById(int id) {
        Optional<Course> courseOptional = courseRepository.findById(id);
        return courseOptional.orElse(null);
    }

    // Create a new course
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    // Update an existing course
    public Course updateCourse(int id, Course newCourse) {
        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isPresent()) {
            Course existingCourse = courseOptional.get();
            existingCourse.setName(newCourse.getName());
            // Set other attributes as needed
            return courseRepository.save(existingCourse);
        } else {
            return null;
        }
    }

    // Delete a course by ID
    public boolean deleteCourse(int id) {
        Optional<Course> courseOptional = courseRepository.findById(id);
        if (courseOptional.isPresent()) {
            courseRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public List<Course> getCoursesByDepartmentId(int departmentId) {
        // Implement the logic to fetch courses by departmentId from your repository
        return courseRepository.findByDepartmentId(departmentId);
    }

    public List<Course> getCoursesByDepartmentIdAndUserAttributes(int departmentId, String searchVal) {
        return courseRepository.findByDepartmentIdAndUserAttributes(departmentId, searchVal);
    }
}
