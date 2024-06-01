import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation, Link } from 'react-router-dom';
import DataTable from '../../common/DataTable';

export default function Submission() {
    const [requirements, setRequirements] = useState(null)
    const [requirementTitle, setRequirementTitle] = useState(null)
    const [requirementTerm, setRequirementTerm] = useState("Prelim")
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(0)
    const [filteredCourses, setFilteredCourses] = useState(null)
    const [activeEditRecords, setActiveEditRecords] = useState(false)

    const auth = JSON.parse(localStorage.getItem('auth'));
    const ys = JSON.parse(Cookies.get('ys'));
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchCourses = async () => {
        
        const departmentId = searchParams.get('department');

        const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/get?departmentId=${departmentId}&ysId=${ys.id}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setCourses(result)
                console.log("courses: ",result)
                return result
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
        return null;
    }

    const fetchRequirements = async (courseId, isNlo = true) => {
        
        const departmentId = searchParams.get('department');

        let url = (courseId && !isNlo)
            ? `${process.env.REACT_APP_API_URL}/api/requirements/admin/department/${departmentId}/course/${courseId}?userid=${auth.adminid}`
            : `${process.env.REACT_APP_API_URL}/api/requirements/admin/department/nlo?adminId=${auth.adminid}`
        const response = await fetch(url, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
                console.log("resquirements: ",result)
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

    const handleSearch = (e) => {
        const searchVal = e.target.value
        const filtered = courses.filter((val) => (val.name.toLowerCase().includes(searchVal)))
        setFilteredCourses(filtered)
    }

    const showPrograms = () => {
        return (
            <div className='program-nav'>
                <input placeholder='Search' onChange={handleSearch} />
                {courses && <ul>
                    {(filteredCourses ? filteredCourses : courses ? courses : []).map((item, index) => (
                        <li className={(selectedCourse == index) ? "active" : ""} 
                            onClick={() => {
                                    setSelectedCourse(index);
                                    fetchRequirements((filteredCourses ? filteredCourses[index].id : courses[index].id), true);
                                }
                            } 
                            key={index}>{item.name}
                        </li>
                    ))}
                </ul>}
            </div>
        )
    }

    // Deep clone function
    function deepClone(obj) {
        if (Array.isArray(obj)) {
            return obj.map(deepClone);
        } else if (typeof obj === 'object' && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, val]) => [key, deepClone(val)])
            );
        } else {
            return obj;
        }
    }

    // const handleDocumentStatus = async (documentId = null) => {
    //     const formData = new FormData();
    //     formData.append('comment', comment)
    //     formData.append('status', documentStatus)
    //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/${documentId}`, {
    //         method: 'PUT',
    //         body: formData,
    //     })
    //     if(response && response.ok) {
    //         console.log("Update success")
    //         window.location.reload();
    //     } else {
    //         console.error('Upload failed:', response.status, response.statusText);
    //         try {
    //             const result = await response.json();
    //             // Access specific properties from the result if needed
    //             console.log('Error Message:', result.message);
    //             // Handle failure, e.g., display an error message to the user
    //         } catch (error) {
    //             console.error('Error parsing JSON:', error);
    //             // Handle unexpected JSON parsing error
    //         }
    //     }
    // }

    const showNloRequirements = () => {
        const nloRequirements = {
            'OC: Orientation Certificate'       : ['OC',null,'#677800'],
            'CL: Confirmation Letter'           : ['CL',null,'#E900FE'],
            'MOA: Memorandum of Agreement'      : ['MOA',null,'#000000'],
            'DOU: Deed of Undertaking'          : ['DOU',null,'#FF0808'],
            'EL: Endorsement Letter'            : ['EL',null,'#F19F00'],
            'W: Waiver'                         : ['W',null,'#047016'],
            'LOU: Letter of Undertaking'        : ['LOU',null,'#000AFF'],
            'OSL: Official Study Load'          : ['OSL',null,'#FF006B'],
            'COC: Certificate of Completion'    : ['COC',null,'#0DB09C'],
        }

        let students = []

        // Sets the status for requirement on each students
        courses[selectedCourse].students.forEach(student => {
            // copy the static nlo requirement and change the status of the requirements for each student
            const studentRequirement = deepClone(nloRequirements)
            requirements.forEach(item => {
                if(studentRequirement.hasOwnProperty(item.title) && item.documents && item.documents.length > 0) {
                    item.documents.forEach(doc => {
                        if(doc.submittedBy.userid == student.userid) {
                            studentRequirement[item.title][1] = doc.status.toLowerCase()
                        }
                    })
                }
            });
            students.push({details: student, documents: studentRequirement})
        })

        const requirementList = Object.entries(nloRequirements).map(([key, value]) => {
            return <th key={key} style={{color:value[2]}}>{value[0]}</th>
        })

        return (
            <>
                {requirements && 
                    <>
                        <div className='nlo-requirements'>
                            <ul>
                                {requirements
                                .filter(req => nloRequirements[req.title] && nloRequirements[req.title].length > 0)
                                .map((item, index) => (
                                    <li key={index}>
                                        <a style={{color: nloRequirements[item.title] ? nloRequirements[item.title][2] : '#000'}}>{item.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                }
                {students.length > 0 && 
                <div className='nlo-records'>
                    <div className='nlo-records-header'>
                        <h2>NLO RECORDS</h2>
                    </div>
                    <DataTable 
                        header={[
                            'User ID',
                            'Firstname',
                            'Lastname',
                            ...requirementList,
                            'Lacking Files',
                            'Action'
                        ]} 
                        data={students.map((item, index) => {
                                return [
                                    item.details.userid,
                                    item.details.firstName, 
                                    item.details.lastName, 
                                    ...Object.entries(item?.documents).map(([key, value]) => {
                                        return <td key={key}><i className={`status status-${value[1]}`}></i></td>
                                    }),
                                    Object.entries(item?.documents).filter((value) => {
                                        return (value?.[1]?.[1] != "approved")
                                    })
                                    .map(val => val[1]?.[0])
                                    .join(", "),
                                    <Link to={`/admin/requirements/view?userid=${item.details.userid}`}>View</Link>
                                ]
                            }
                        )} 
                    />
                </div>
                }
            </>
        );
    }

    useEffect(() => {
        fetchCourses().then((course) => {
            console.log("courses useeffect: ",course)
            fetchRequirements(course[0].id)
        })
    }, []);
  
    return (
        <div id='submission'>
            {courses && showPrograms()}
            <div className='wrapper'>
                <h1 className='page-title'><img src="/icons/documents.png" />OJT Records</h1>
                {requirements && showNloRequirements()}
            </div>
        </div>
    );
  }