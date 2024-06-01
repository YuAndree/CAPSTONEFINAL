package cit.ojtnsync.caps.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Model.UserWithCourseDTO;
import cit.ojtnsync.caps.Repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    public List<UserEntity> getUsersByStatus(String status) {
        return userRepository.findByStatus(status);
    }
	
	// Search by studentID
    public UserEntity findByStudentID(String studentID) {
        if (userRepository.findByStudentID(studentID) != null)
            return userRepository.findByStudentID(studentID);
        else
            return null;
    }

    public UserEntity findById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }
    
    public boolean existsByStudentID(String studentID) {
        return userRepository.existsByStudentID(studentID);
    }

    public void updateUser(UserEntity user) {
        userRepository.save(user);
    }
    
    public void createUser(UserEntity userEntity) {
        userRepository.save(userEntity);
    }
    
    public List<UserEntity> searchUsers(String searchVal) {
        // Query the database to search for users by userid, firstName, lastName, or email
        return userRepository.findByStudentIDContainingOrFirstNameContainingOrLastNameContainingOrEmailContaining(searchVal, searchVal, searchVal, searchVal);
    }

    public List<UserWithCourseDTO> searchUserAttributes(String courseName, String lastName, String firstName) {
        // Query the database to search for users by Course.name, lastName, and firstName
        return userRepository.findByCourseNameAndLastNameAndFirstName(courseName, lastName, firstName);
    }

    public List<UserWithCourseDTO> getUsersByDepartmentId(int departmentId) {
        return userRepository.findByDepartmentId(departmentId);
    }

    public List<UserWithCourseDTO> getUsersByCourseId(int courseId) {
        return userRepository.findByCourseId(courseId);
    }

    public void deleteUser(UserEntity user) {
        userRepository.delete(user);
    }
    
}
