package cit.ojtnsync.caps.Service;

import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(int id) {
        return departmentRepository.findById(id)
                .orElse(null);
    }
    

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(int id, Department updatedDepartment) {
        Optional<Department> existingDepartmentOptional = departmentRepository.findById(id);
        if (existingDepartmentOptional.isPresent()) {
            Department existingDepartment = existingDepartmentOptional.get();
            existingDepartment.setName(updatedDepartment.getName());
            // Set other attributes as needed
            return departmentRepository.save(existingDepartment);
        } else {
            // Handle not found scenario
            return null;
        }
    }

    public void deleteDepartment(int id) {
        departmentRepository.deleteById(id);
    }
}
