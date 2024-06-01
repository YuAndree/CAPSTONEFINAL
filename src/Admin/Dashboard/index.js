import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

// Chart.js
import "chart.js/auto";
import { Line, Pie } from 'react-chartjs-2';

export default function Dashboard() {

    const [courses, setCourses] = useState(null)
    const [requirements, setRequirements] = useState(null)

	const auth = localStorage.getItem('auth');
    const ys = JSON.parse(Cookies.get('ys'));

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

    const showDocumentStatusChart = () => {
        const dataCharts = []
        const statusPerCourse = []
        const colors = [
            '#8B008B',
            '#FF6347',
            '#4682B4',
            '#3CB371',
            '#FF69B4',
            '#FFD700',
            '#00FFFF',
            '#8A2BE2',
            '#00FF00',
            '#FF4500'
        ];

        courses.forEach(course => {
            const status = {
                pending: 0,
                approved: 0,
            declined: 0
            }
            requirements.forEach(req => {
                if(req.documents && req.documents.length > 0) {
                    if(course.id == req.courseId) {
                        req.documents.forEach(doc => {
                            if(doc.status) {
                                status[doc.status.toLowerCase()]++
                            }
                        })
                    }
                }
                if(course.id == req.courseId && req.documents?.[0]?.status)
                    status[req.documents?.[0]?.status.toLowerCase()] = status[req.documents?.[0]?.status.toLowerCase()] + 1
            })
            statusPerCourse.push({
                course: course.name,
                status: status
            })
        })
        statusPerCourse.forEach(item => {
            const data = {
                labels: Object.entries(item.status).map(([key, value]) => key),
                datasets: [
                  {
                    data: Object.entries(item.status).map(([key, value]) => value),
                    backgroundColor: colors,
                    hoverBackgroundColor: colors,
                  },
                ],
            };
            dataCharts.push({course: item.course, data: data})
        })
        return <>
            {dataCharts.map((item,index) => {
                return <section key={index} className='dashboard-section'>
                    <span>{item.course}</span>
                    <Pie data={item.data} />
                </section>
            })}
        </>
    }

    const lineData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
            label: 'Sales',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.2)',
            borderColor: 'rgba(75,192,192,1)',
            borderWidth: 2,
            },
        ],
    };

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


	useEffect(() => {
        fetchStudents()
        fetchRequirements()
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
                {/* <Line data={lineData} options={options} /> */}
                {courses && requirements && JSON.parse(auth).adminType.toLowerCase() != 'nlo' && 
                    <div className='student-documents-status'>
                        {showDocumentStatusChart()}
                    </div>
                }
            </main>
        </div>
    </div>;
}
