package cit.ojtnsync.caps.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cit.ojtnsync.caps.Entity.AdminEntity;
import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Repository.AdminRepository;
import cit.ojtnsync.caps.Repository.DepartmentRepository;
import cit.ojtnsync.caps.Repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/department")
@CrossOrigin(origins = "*")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    @Autowired
    public DepartmentController(DepartmentRepository departmentRepository, UserRepository userRepository, AdminRepository adminRepository) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable int id) {
        return departmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        Department createdDepartment = departmentRepository.save(department);
        return ResponseEntity.ok(createdDepartment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(@PathVariable int id, @RequestBody Department updatedDepartment) {
        if (!departmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        updatedDepartment.setId(id);
        Department savedDepartment = departmentRepository.save(updatedDepartment);
        return ResponseEntity.ok(savedDepartment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable int id) {
        if (!departmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        departmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{userType}/{userId}")
    public ResponseEntity<List<Department>> getDepartmentByUserId(@PathVariable String userType, @PathVariable Long userId) {
        List<Department> departments = new ArrayList<>();
        if ("user".equals(userType)) {
            UserEntity user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            departments.add(user.getCourse().getDepartment());

            // Check if the department name is not 'NLO' (case insensitive)
            if (!"NLO".equalsIgnoreCase(user.getCourse().getDepartment().getName())) {
                Optional<Department> nloDepartment = departmentRepository.findByNameIgnoreCase("NLO");
                nloDepartment.ifPresent(departments::add);
            }
        }
        else {
            AdminEntity user = adminRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            if(user.getDepartment().getName().equalsIgnoreCase("NLO"))
                departments = departmentRepository.findAll();
            else
                departments.add(user.getDepartment());
        }

        return ResponseEntity.ok(departments);
    }



}
