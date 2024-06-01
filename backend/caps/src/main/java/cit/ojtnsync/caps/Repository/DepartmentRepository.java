package cit.ojtnsync.caps.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import cit.ojtnsync.caps.Entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findByNameIgnoreCase(String name);
}
