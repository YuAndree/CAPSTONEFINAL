package cit.ojtnsync.caps.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Model.UserWithCourseDTO;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>{

		UserEntity findByUserid(Long userid);
		UserEntity findByStudentID(String studentID);
		boolean existsByStudentID(String studentID);

        List<UserEntity> findByStatus(String status);

		// Define a custom query method to search for users by userid, firstName, lastName, or email
    	List<UserEntity> findByStudentIDContainingOrFirstNameContainingOrLastNameContainingOrEmailContaining(
            String studentID, String firstName, String lastName, String email);

        @Query("SELECT " +
            "NEW cit.ojtnsync.caps.Model.UserWithCourseDTO(u.userid, u.studentID, u.firstName, u.lastName, u.email, c, u.isVerified) " +
        "FROM " +
            "UserEntity u " +
        "JOIN " +
            "u.course c " +
        "WHERE " +
            "c.name LIKE CONCAT('%', :courseName, '%') " +
            "AND u.lastName LIKE CONCAT('%', :lastName, '%') " +
            "AND u.firstName LIKE CONCAT('%', :firstName, '%')")
        List<UserWithCourseDTO> findByCourseNameAndLastNameAndFirstName(
                @Param("courseName") String courseName,
                @Param("lastName") String lastName,
                @Param("firstName") String firstName);


        @Query("SELECT NEW cit.ojtnsync.caps.Model.UserWithCourseDTO(u.userid, u.studentID, u.firstName, u.lastName, u.email, c, u.isVerified) " +
        "FROM UserEntity u " +
        "JOIN u.course c " +
        "WHERE c.department.id = :departmentId")
         List<UserWithCourseDTO> findByDepartmentId(@Param("departmentId") int departmentId);

         @Query("SELECT NEW cit.ojtnsync.caps.Model.UserWithCourseDTO(u.userid, u.studentID, u.firstName, u.lastName, u.email, c, u.isVerified) " +
         "FROM UserEntity u " +
         "JOIN u.course c " +
         "WHERE c.id = :courseId AND u.status = 'active'")
        List<UserWithCourseDTO> findByCourseId(@Param("courseId") int courseId);
 

}
