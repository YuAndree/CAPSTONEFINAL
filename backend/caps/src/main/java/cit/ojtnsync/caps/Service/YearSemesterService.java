package cit.ojtnsync.caps.Service;

import cit.ojtnsync.caps.Entity.YearSemester;
import cit.ojtnsync.caps.Repository.YearSemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class YearSemesterService {

    private final YearSemesterRepository yearSemesterRepository;

    @Autowired
    public YearSemesterService(YearSemesterRepository yearSemesterRepository) {
        this.yearSemesterRepository = yearSemesterRepository;
    }

    // Method to retrieve all YearSemesters
    public List<YearSemester> getAllYearSemesters() {
        return yearSemesterRepository.findAll();
    }

    public List<YearSemester> getAllYearSemestersSortedByYearAndSemesterDesc() {
        return yearSemesterRepository.findAllSortedByYearAndSemesterDesc();
    }
    
    // Method to find YearSemester by ID
    public YearSemester getYearSemesterById(int id) {
        return yearSemesterRepository.findById(id).orElse(null);
    }


    // Method to save or update a YearSemester
    public YearSemester saveOrUpdateYearSemester(YearSemester yearSemester) {
        return yearSemesterRepository.save(yearSemester);
    }

    // Method to delete a YearSemester by ID
    public void deleteYearSemesterById(int id) {
        yearSemesterRepository.deleteById(id);
    }
}
