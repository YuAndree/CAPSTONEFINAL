import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../icons/logo1.png';
import './homepage.css'
import StudentCourses from '../StudentCoursesForm/StudentCourses'

const HomePage = () => {
    return (
    
      <div id='homepage'>
        <div className='wrapper'>
          <div className="homepage-header">
            <h1>Dashboard</h1>
            <p>Welcome to OJTnSync (OJT Documentation)</p>
          </div>
          <StudentCourses/>
        </div>
      </div>
      
      );
}


export default HomePage;

