package cit.ojtnsync.caps.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import cit.ojtnsync.caps.Entity.AdminEntity;
import cit.ojtnsync.caps.Entity.Course;
import cit.ojtnsync.caps.Entity.Department;
import cit.ojtnsync.caps.Entity.Document;
import cit.ojtnsync.caps.Entity.Requirement;
import cit.ojtnsync.caps.Entity.UserEntity;
import cit.ojtnsync.caps.Entity.YearSemester;
import cit.ojtnsync.caps.Model.RequirementWithCourseDTO;
import cit.ojtnsync.caps.Model.UserWithCourseDTO;
import cit.ojtnsync.caps.Service.AdminService;
import cit.ojtnsync.caps.Service.CourseService;
import cit.ojtnsync.caps.Service.DepartmentService;
import cit.ojtnsync.caps.Service.RequirementService;
import cit.ojtnsync.caps.Service.YearSemesterService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/requirements")
public class RequirementController {

    private final RequirementService requirementService;
    private final DepartmentService departmentService;
    private final CourseService courseService;
    private final AdminService adminService;
    private final YearSemesterService yearSemesterService;

    public RequirementController(RequirementService requirementService, DepartmentService departmentService, CourseService courseService, AdminService adminService, YearSemesterService yearSemesterService) {
        this.requirementService = requirementService;
        this.departmentService = departmentService;
        this.courseService = courseService;
        this.adminService = adminService;
        this.yearSemesterService = yearSemesterService;
    }

    @GetMapping
    public ResponseEntity<List<Requirement>> getAllRequirements(long userid) {
        List<Requirement> requirements = requirementService.getAllRequirements();

        // Filter documents for each requirement based on userid
        for (Requirement requirement : requirements) {
            List<Document> filteredDocuments = requirementService.getFilteredDocumentsForRequirement(requirement.getId(), userid);
            requirement.setDocuments(filteredDocuments);
        }

        return ResponseEntity.ok(requirements);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Requirement> getRequirementById(@PathVariable int id) {
        Requirement requirement = requirementService.getRequirementById(id);
        return ResponseEntity.ok(requirement);
    }

    @PostMapping
    public ResponseEntity<Requirement> createRequirement(
            @RequestParam("requirementTitle") String requirementTitle,
            @RequestParam("requirementTerm") String requirementTerm,
            @RequestParam("departmentId") int departmentId,
            @RequestParam("ysId") int ysId,
            @RequestParam(value = "courseId", required = false) Integer courseId) {
        Department department = departmentService.getDepartmentById(departmentId);
        Course course = courseId != null ? courseService.getCourseById(courseId) : null;
        YearSemester yearSemester = yearSemesterService.getYearSemesterById(ysId);
        Requirement requirement = new Requirement(requirementTitle, department, course, requirementTerm, yearSemester);
        Requirement createdRequirement = requirementService.createRequirement(requirement);
        return ResponseEntity.ok(createdRequirement);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Requirement> updateRequirement(
            @PathVariable int id,
            @RequestBody Requirement requirement) {
        Requirement updatedRequirement = requirementService.updateRequirement(id, requirement);
        return ResponseEntity.ok(updatedRequirement);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequirement(@PathVariable int id) {
        requirementService.deleteRequirement(id);
        return ResponseEntity.noContent().build();
    }
    
    // Mapping to get requirements by course
    @GetMapping("/department/{departmentId}/course/{courseId}")
    public ResponseEntity<List<Requirement>> getRequirementsByCourse(long userid, int ysId, @PathVariable int departmentId, @PathVariable int courseId) {
        Department department = departmentService.getDepartmentById(departmentId);
        List<Requirement> requirements = new ArrayList<>();

        if(department.getName().equalsIgnoreCase("nlo"))
            requirements = requirementService.getRequirementsByDepartment(departmentId);
        else
            requirements = requirementService.getRequirementsByCourse(courseId);

        requirements = requirementService
            .filterActive(requirements)
            .stream()
            .filter(r -> r != null && r.getYearSemester() != null && r.getYearSemester().getId() == ysId)
            .collect(Collectors.toList());
        
        // Filter documents for each requirement based on userid
        for (Requirement requirement : requirements) {
            List<Document> filteredDocuments = requirementService.getFilteredDocumentsForRequirement(requirement.getId(), userid);
            requirement.setDocuments(filteredDocuments);
        }
        return ResponseEntity.ok(requirements);
    }

    // Mapping to get all requirements by department
    @GetMapping("/admin/department/{departmentId}")
    public ResponseEntity<List<RequirementWithCourseDTO>> getRequirementsByDepartment(@PathVariable int departmentId) {
        List<Requirement> requirements = requirementService.getRequirementsByDepartment(departmentId);
        List<RequirementWithCourseDTO> requirementWithCourseDTO = new ArrayList<>();
        for (Requirement req : requirements) {
            requirementWithCourseDTO.add(new RequirementWithCourseDTO(
                    req.getId(),
                    req.getTitle(),
                    req.getDocuments(),
                    req.getTerm(),
                    req.getStatus(),
                    req.getDepartment().getId(),
                    req.getCourse() != null ? req.getCourse().getId() : 0,
                    req.getCourse() != null ? req.getCourse().getName() : null
            ));
        }
        return ResponseEntity.ok(requirementWithCourseDTO);
    }

    // Mapping to get all requirements by department
    @GetMapping("/admin/department/{departmentId}/ys/{ysId}")
    public ResponseEntity<List<RequirementWithCourseDTO>> getRequirementsByDepartmentAndYearSemester(@PathVariable int departmentId, @PathVariable int ysId) {
        List<Requirement> requirements = requirementService.getRequirementsByDepartmentAndYearSemesterId(departmentId, ysId);
        List<RequirementWithCourseDTO> requirementWithCourseDTO = new ArrayList<>();
        for (Requirement req : requirements) {
            requirementWithCourseDTO.add(new RequirementWithCourseDTO(
                    req.getId(),
                    req.getTitle(),
                    req.getDocuments(),
                    req.getTerm(),
                    req.getStatus(),
                    req.getDepartment().getId(),
                    req.getCourse() != null ? req.getCourse().getId() : 0,
                    req.getCourse() != null ? req.getCourse().getName() : null
            ));
        }
        return ResponseEntity.ok(requirementWithCourseDTO);
    }

    // Mapping to get all requirements by NLO
    @GetMapping("/admin/department/nlo")
    public ResponseEntity<List<Requirement>> getRequirementsByNlo(long adminId) {
        AdminEntity adminEntity = adminService.findById(adminId);
        if(adminEntity == null)
            return ResponseEntity.badRequest().build();
        List<Requirement> requirements = requirementService.getRequirementsByDepartmentName("NLO");
        return ResponseEntity.ok(requirements);
    }

    // Mapping to get requirements by course for Admin
    @GetMapping("/admin/department/{departmentId}/course/{courseId}")
    public ResponseEntity<List<Requirement>> getAdminRequirementsByCourse(long userid, int ysId, @PathVariable int departmentId, @PathVariable int courseId) {
        List<Requirement> requirements = requirementService.getRequirementsByCourse(courseId);
        requirements = requirementService
            .filterActive(requirements)
            .stream()
            .filter(r -> r != null && r.getYearSemester() != null && r.getYearSemester().getId() == ysId)
            .collect(Collectors.toList());
        return ResponseEntity.ok(requirements);
    }
}
