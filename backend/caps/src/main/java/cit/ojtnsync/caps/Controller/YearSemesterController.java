package cit.ojtnsync.caps.Controller;

import cit.ojtnsync.caps.Entity.YearSemester;
import cit.ojtnsync.caps.Service.YearSemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/yearSemesters")
public class YearSemesterController {

    private final YearSemesterService yearSemesterService;

    @Autowired
    public YearSemesterController(YearSemesterService yearSemesterService) {
        this.yearSemesterService = yearSemesterService;
    }

    // Endpoint to retrieve all YearSemesters
    @GetMapping
    public ResponseEntity<List<YearSemester>> getAllYearSemestersSortedByYearAndSemesterDesc() {
        List<YearSemester> yearSemesters = yearSemesterService.getAllYearSemestersSortedByYearAndSemesterDesc();
        return new ResponseEntity<>(yearSemesters, HttpStatus.OK);
    }

    // Endpoint to retrieve a YearSemester by ID
    @GetMapping("/{id}")
    public ResponseEntity<YearSemester> getYearSemesterById(@PathVariable int id) {
        YearSemester yearSemester = yearSemesterService.getYearSemesterById(id);
        if (yearSemester != null) {
            return new ResponseEntity<>(yearSemester, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to create a new YearSemester
    @PostMapping
    public ResponseEntity<YearSemester> createYearSemester(
        @RequestParam("year") String year,
        @RequestParam("semester") int semester) {
            YearSemester createdYearSemester = new YearSemester(year,semester);
            yearSemesterService.saveOrUpdateYearSemester(createdYearSemester);
            return new ResponseEntity<>(createdYearSemester, HttpStatus.CREATED);
    }

    // Endpoint to update an existing YearSemester
    @PutMapping("/{id}")
    public ResponseEntity<YearSemester> updateYearSemester(@PathVariable int id, @RequestBody YearSemester yearSemester) {
        YearSemester existingYearSemester = yearSemesterService.getYearSemesterById(id);
        if (existingYearSemester != null) {
            yearSemester.setId(id);
            YearSemester updatedYearSemester = yearSemesterService.saveOrUpdateYearSemester(yearSemester);
            return new ResponseEntity<>(updatedYearSemester, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to delete a YearSemester by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteYearSemesterById(@PathVariable int id) {
        YearSemester existingYearSemester = yearSemesterService.getYearSemesterById(id);
        if (existingYearSemester != null) {
            yearSemesterService.deleteYearSemesterById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
