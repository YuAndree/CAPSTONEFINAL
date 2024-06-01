package cit.ojtnsync.caps.Repository;

import cit.ojtnsync.caps.Entity.YearSemester;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface YearSemesterRepository extends JpaRepository<YearSemester, Integer> {
    @Query("SELECT ys FROM YearSemester ys ORDER BY ys.year DESC, ys.semester DESC")
    List<YearSemester> findAllSortedByYearAndSemesterDesc();
}
