package cit.ojtnsync.caps.Entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
public class YearSemester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String year;
    private int semester;
    private Timestamp createdAt;


    public YearSemester() {
    }

    public YearSemester(String year, int semester) {
        this.year = year;
        this.semester = semester;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public Timestamp createdAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

}
