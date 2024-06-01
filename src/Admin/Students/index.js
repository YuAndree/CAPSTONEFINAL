import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';

const Students = () => {

    const auth = JSON.parse(localStorage.getItem('auth'));
    const ys = JSON.parse(Cookies.get('ys'));
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(0)

    const fetchStudents = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/get?departmentId=${auth.departmentId}&ysId=${ys.id}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("courses: ",result)
				setCourses(result)
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle unexpected JSON parsing error
            }
        } else {
            console.error('Response failed:', response.status, response.statusText);
            try {
                const result = await response.json();
                // Access specific properties from the result if needed
                console.log('Error Message:', result.message);
                // Handle failure, e.g., display an error message to the user
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle unexpected JSON parsing error
            }
        }
    }

    const getApprovedDocuments = (course, student) => {
        let approvedCount = 0
        const requirements = course.department.requirements
        requirements.forEach(requirement => {
            requirement.documents.forEach(document => {
                if(document.submittedBy.userid == student.userid && document.status.toLowerCase() == 'approved')
                    approvedCount++;
            });
        });
        return approvedCount
    }

    const showStudents = () => {
        return (
            <DataTable 
                header={['User ID', 'Firstname', 'Lastname', 'Email', 'Documents Approved', 'Action']} 
                data={(courses && courses.length > 0) && courses[selectedCourse].students
                    .filter(item => item.status === 'active') // Filter out students with status 'active'
                    .map((item, index) => ([
                        item.userid, 
                        item.firstName, 
                        item.lastName, 
                        item.email, 
                        getApprovedDocuments(courses[selectedCourse], item), 
                        // <Link to={`/admin/student/documents?userid=${item.userid}&course=${courses[selectedCourse].id}`}>View</Link>
                        <Link key={index} to={`/admin/requirements/view?userid=${item.userid}`}>View</Link>
                    ]))
                } 
            />
        )
    }

    const showCoursesNav = () => {
        return (<div className='course-nav'>
            {(courses && courses.length > 0) && 
                courses.map((item, index) => (
                    <a className={selectedCourse == index ? "active" : ""} key={index} onClick={() => setSelectedCourse(index)}>{item.name} DEPARTMENT</a>
                ))
            }
            
        </div>)
    }

    useEffect(() => {
        fetchStudents()
    }, []);

    return(
        <div id= "students">
            <div className='wrapper'>
                <h1><img src="/icons/records.png" />Records</h1>
                {showCoursesNav()}
                <div className='header'>
                    <div className='header-actions'>
                        <Link to='/admin/students/add'>Add Student</Link>
                        <Link to='/admin/students/delete'>Delete Student</Link>
                    </div>
                </div>
                {showStudents()}
            </div>
        </div>
    )
}

export default Students