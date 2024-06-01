package cit.ojtnsync.caps.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.ojtnsync.caps.Entity.AdminEntity;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
	// AdminEntity findByFacultyId(String FacultyId);

	// boolean existsByFacultyId(String id);

	AdminEntity findById(long id);

	AdminEntity findByFacultyId(String id);

	boolean existsById(long id);
}
