package cit.ojtnsync.caps.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.Requirement;

public interface RequirementRepository extends JpaRepository<Requirement, Integer> {

    @Query(value = "SELECT * FROM Requirement", nativeQuery = true)
    List<Requirement> findAllRequirements();

    List<Requirement> findByDepartmentName(String departmentName);

    @Query("SELECT r FROM Requirement r WHERE r.department.id = ?1 AND (r.yearSemester.id = ?2 OR r.yearSemester IS NULL)")
    List<Requirement> findAllByDepartmentIdAndYearSemesterId(int departmentId, int yearSemesterId);

}
