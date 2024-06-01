import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation, Link } from 'react-router-dom';

export default function Submission() {
    const [requirements, setRequirements] = useState(null)

    const auth = localStorage.getItem('auth');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchRequirements = async () => {
        
        const departmentId = searchParams.get('department');

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements/admin/department/${departmentId}?userid=${JSON.parse(auth).adminid}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
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

    const showRequirements = (term) => {
        return (
            requirements && <ul>
                {requirements.map((item, index) => (
                    (item.term && item.term.toLowerCase() == term) &&
                    <li key={index}>
                        <Link to={`/admin/validate?requirementId=${item.id}`}>{item.title}</Link>
                    </li>
                ))}
            </ul>
        );
    }

    useEffect(() => {
        fetchRequirements()
    }, []);
  
    return (
        <div id='submission'>
            <div className='wrapper'>
                <section>
                    <h2>PRELIM REQUIREMENTS</h2>
                    {showRequirements("prelim")}
                </section>
                <section>
                    <h2>MIDTERM REQUIREMENTS</h2>
                    {showRequirements("midterm")}
                </section>
                <section>
                    <h2>PRE-FINAL REQUIREMENTS</h2>
                    {showRequirements("pre-final")}
                </section>
                <section>
                    <h2>FINAL REQUIREMENTS</h2>
                    {showRequirements("final")}
                </section>
            </div>
        </div>
    );
  }