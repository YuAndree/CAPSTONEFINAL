package cit.ojtnsync.caps.Repository;

import cit.ojtnsync.caps.Entity.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TemplateRepository extends JpaRepository<Template, Integer> {
    // You can add custom query methods here if needed
}
