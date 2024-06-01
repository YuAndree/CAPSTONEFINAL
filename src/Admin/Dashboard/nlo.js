import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

// Chart.js
import "chart.js/auto";
import { Line, Pie, Bar } from 'react-chartjs-2';

export default function Dashboard() {

    const [courses, setCourses] = useState(null)
    const [requirements, setRequirements] = useState(null)
    const [documents, setDocuments] = useState(null)

	const auth = localStorage.getItem('auth');
    const ys = JSON.parse(Cookies.get('ys'));

    const fetchDocuments = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/ys/${ys.id}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
				setDocuments(result)
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

    const fetchStudents = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/get?departmentId=${JSON.parse(auth).departmentId}&ysId=${ys.id}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
				setCourses(result)
                return result;
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

    const fetchRequirements = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements/admin/department/${JSON.parse(auth).departmentId}/ys/${ys.id}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
				setRequirements(result)
                console.log("requirements: ",result)
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

    const showStudentCounts = () => {
        if(courses && courses.length > 0) {
            return <>
                { courses.map((course, index) => {
                    return <section key={index} className='dashboard-section'>
                        <span>{course.name}</span>
                        <h2>{course.students.length}</h2>
                    </section>
                })}
            </>
        }
    }

    const pieData = {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
    };
        
    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                    beginAtZero: true,
                    },
                },
            ],
        },
    };


    // const courseChart = () => {
    //     const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    //     const data = {
    //       labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    //       datasets: [
    //         {
    //           label: 'Dataset 1',
    //           data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    //           borderColor: 'rgb(255, 99, 132)',
    //           backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //         },
    //         {
    //           label: 'Dataset 2',
    //           data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    //           borderColor: 'rgb(53, 162, 235)',
    //           backgroundColor: 'rgba(53, 162, 235, 0.5)',
    //         },
    //       ],
    //     };
    
    //     const options = {
    //         indexAxis: 'y',
    //         elements: {
    //           bar: {
    //             borderWidth: 2,
    //           },
    //         },
    //         responsive: true,
    //         plugins: {
    //           legend: {
    //             position: 'right',
    //           },
    //           title: {
    //             display: true,
    //             text: 'Chart.js Horizontal Bar Chart',
    //           },
    //         },
    //     };
    
    //     return (
    //       <div>
    //         <h2>Horizontal Bar Chart Example</h2>
    //         <Bar
    //           data={data}
    //           options={options}
    //           height={400}
    //           width={600}
    //         />
    //       </div>
    //     );
    //   }


	useEffect(() => {
        fetchStudents()
        fetchRequirements()
        fetchDocuments()
    }, []);

    return <div className='student-courses'>
        <div className='wrapper'>
            <h1>Dashboard</h1>
            <p style={{textAlign:"left"}}>Welcome to OJTnSync</p>
            <main id='dashboard-main'>
                {courses && 
                    <div className='student-counts'>
                        {showStudentCounts()}
                    </div>
                }
                {/* {courses &&
                    courseChart()
                } */}
            </main>
        </div>
    </div>;
}
