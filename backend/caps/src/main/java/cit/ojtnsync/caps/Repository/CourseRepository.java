package cit.ojtnsync.caps.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import cit.ojtnsync.caps.Entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
    List<Course> findByDepartmentId(int departmentId);

    @Query("SELECT DISTINCT c FROM Course c LEFT JOIN c.students u " +
           "WHERE c.department.id = :departmentId AND (u.firstName LIKE %:searchVal% OR u.lastName LIKE %:searchVal% " +
           "OR u.email LIKE %:searchVal% OR u.studentID LIKE %:searchVal%)")
    List<Course> findByDepartmentIdAndUserAttributes(
            @Param("departmentId") int departmentId,
            @Param("searchVal") String searchVal);
}
