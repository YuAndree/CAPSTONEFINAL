package cit.ojtnsync.caps.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.UserEntity;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Integer> {
    List<Document> findBySubmittedBy(UserEntity submittedBy);
    List<Document> findByRequirementId(int requirementId);
}

