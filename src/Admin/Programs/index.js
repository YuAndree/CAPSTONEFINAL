import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function ActionAreaCard() {

	const [courses, setCourses] = useState(null);
	const auth = localStorage.getItem('auth');
    const ys = JSON.parse(Cookies.get('ys'));

	const fetchCourses = async () => {
		let response = null
        let response2 = null
		if(JSON.parse(auth).adminid) {
            response = await fetch(`${process.env.REACT_APP_API_URL}/courses/get/department/${JSON.parse(auth).departmentId}`, {
				method: 'GET',
			})
		}
        

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("response: ",result)
				setCourses(result)
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle unexpected JSON parsing error
            }
        } else {
            console.error('Upload failed:', response.status, response.statusText);
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

    const showCourses = () => {
        return (
				courses && <div className='cards'>
					{courses.map((item, index) => (
						<div className="card" key={index}>
							<h2>{item.name} DEPARTMENT</h2>
							<Link to={"/admin/submission?department="+item.department.id}></Link>
						</div>
					))}
				</div>
			
        );
    }

	useEffect(() => {
        fetchCourses()
    }, []);

  return <div className='student-courses'>{showCourses()}</div>;
}
