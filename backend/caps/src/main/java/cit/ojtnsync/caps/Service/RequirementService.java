package cit.ojtnsync.caps.Service;

import org.aspectj.apache.bcel.classfile.Module.Require;
import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Entity.Course;
import cit.ojtnsync.caps.Repository.RequirementRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequirementService {

    private final RequirementRepository requirementRepository;

    public RequirementService(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

    public List<Requirement> getAllRequirements() {
        return requirementRepository.findAllRequirements();
    }

    public List<Requirement> getRequirementsByDepartmentName(String departmentName) {
        return requirementRepository.findByDepartmentName(departmentName);
    }

    // Add a method to filter documents for a specific requirement based on userid
    public List<Document> getFilteredDocumentsForRequirement(int requirementId, long userid) {
        Requirement requirement = requirementRepository.findById(requirementId).orElse(null);

        if (requirement != null) {
            List<Document> filteredDocuments = new ArrayList<>();

            for (Document document : requirement.getDocuments()) {
                if (document.getSubmittedBy() != null && document.getSubmittedBy().getUserid() == userid) {
                    filteredDocuments.add(document);
                }
            }

            return filteredDocuments;
        }

        return Collections.emptyList();
    }

    // Get requirements based on department
    public List<Requirement> getRequirementsByDepartment(int departmentId) {
        return requirementRepository.findAll().stream()
                .filter(requirement -> {
                    Department department = requirement.getDepartment();
                    return department != null && department.getId() == departmentId;
                })
                .collect(Collectors.toList());
    }

    public List<Requirement> getRequirementsByDepartmentAndYearSemesterId(int departmentId, int ysId) {
        return requirementRepository.findAllByDepartmentIdAndYearSemesterId(departmentId, ysId);
    }

    // Get requirements based on department
    public List<Requirement> getRequirementsByCourse(int courseId) {
        return requirementRepository.findAll().stream()
                .filter(requirement -> {
                    Course course = requirement.getCourse();
                    return course != null && course.getId() == courseId;
                })
                .collect(Collectors.toList());
    }

    public Requirement getRequirementById(int id) {
        return requirementRepository.findById(id)
                .orElse(null);
    }

    public Requirement createRequirement(Requirement requirement) {
        return requirementRepository.save(requirement);
    }

    public Requirement updateRequirement(int id, Requirement requirement) {
        if (requirementRepository.existsById(id)) {
            requirement.setId(id);
            return requirementRepository.save(requirement);
        }
        return null;
    }

    public void deleteRequirement(int id) {
        Requirement requirement = requirementRepository.findById(id).orElse(null);
        requirement.setStatus("Inactive");
        requirementRepository.save(requirement);
    }

    public List<Requirement> filterActive(List<Requirement> requirements) {
        // Filter requirements to include only those with status "Active"
        List<Requirement> activeRequirements = requirements.stream()
        .filter(requirement -> "Active".equals(requirement.getStatus()))
        .collect(Collectors.toList());
        return activeRequirements;
    }
}
