import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation, Link } from 'react-router-dom';
import CustomModal from '../../common/Modal'

export default function Submission() {
    const [requirements, setRequirements] = useState(null)
    const [isAddModal, setIsAddModal] = useState(false)
    const [requirementTitle, setRequirementTitle] = useState(null)
    const [requirementTerm, setRequirementTerm] = useState("Prelim")
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [nloIsSelected, setNloIsSelected] = useState(false)
    const [filteredCourses, setFilteredCourses] = useState(null)
    const [yearSemesters, setYearSemesters] = useState(null)
    const [selectedYearSemester, setSelectedYearSemester] = useState(null)

    const auth = JSON.parse(localStorage.getItem('auth'));
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const ys = JSON.parse(Cookies.get('ys'));

    const fetchCourses = async () => {
        
        const departmentId = searchParams.get('department');

        const response = await fetch(`${process.env.REACT_APP_API_URL}/courses/get?departmentId=${departmentId}&ysId=${ys.id}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setCourses(result)
                if(result.length > 0)
                    setSelectedCourse(result[0])
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

    const fetchRequirements = async (courseId, isNlo) => {
        
        const departmentId = searchParams.get('department');

        let url = (courseId && !isNlo)
            ? `${process.env.REACT_APP_API_URL}/api/requirements/admin/department/${departmentId}/course/${courseId}?userid=${auth.adminid}&ysId=${ys.id}`
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

    const fetchYearSemesters = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/yearSemesters`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setYearSemesters(result)
                console.log("year semesters: ",result)
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

    const handleDelete = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements/${id}`, {
            method: 'DELETE',
        })

        if (response.ok) {
            console.log("requirement deleted")
            window.location.reload()
        } else {
            console.error('Deletion failed:', response.status, response.statusText);
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
            requirements && <ul className='requirement-list'>
                {requirements.map((item, index) => (
                    (item.term && item.term.toLowerCase() == term) &&
                    <li key={index}>
                        <div className='title-con'><Link to={`/admin/validate?requirementId=${item.id}`}>{item.title}</Link></div>
                        { (auth.adminType != "NLO") &&
                            <a className='requirement-list-delete-btn' href="#!" onClick={() => handleDelete(item.id)}>Delete</a>
                        }
                    </li>
                ))}
            </ul>
        );
    }

    const showAddModal = () => {
        return (
            <CustomModal show={isAddModal} onHide={(val) => {setIsAddModal(val)}}>
                    <figure className='background'><img src="/images/folder_modal.png" /></figure>
                    <div className='add-requirement-modal'>
                        <div className='header'>
                            <h4>{selectedCourse.name} <a onClick={() => setIsAddModal(false)} href='#!'><img src="/icons/close.png" /></a></h4>
                            <h2>Create Requirement</h2>
                        </div>
                        <div className='title-con'><label>Title: </label><input type='text' id='add-modal-title' onChange={(e) => setRequirementTitle(e.target.value)} /></div>
                        <div className='body-con'>
                            <div className='sidebar'>
                                <h4>Choose</h4>
                                <label htmlFor="term1" className={requirementTerm == 'Prelim' ? "active-term" : ""}><input id='term1' type='radio' name="term" value="Prelim" onChange={handleTermChange} defaultChecked />Prelim</label>
                                <label htmlFor="term2" className={requirementTerm == 'Midterm' ? "active-term" : ""}><input id='term2' type='radio' name="term" value="Midterm" onChange={handleTermChange} />Midterm</label>
                                <label htmlFor="term3" className={requirementTerm == 'Pre-Final' ? "active-term" : ""}><input id='term3' type='radio' name="term" value="Pre-Final" onChange={handleTermChange} />Pre-Final</label>
                                <label htmlFor="term4" className={requirementTerm == 'Final' ? "active-term" : ""}><input id='term4' type='radio' name="term" value="Final" onChange={handleTermChange} />Final</label>
                            </div>
                            {/* <div className='sidebar'>
                                <h4>Year & Semester</h4>
                                <select value={selectedYearSemester} onChange={(e) => setSelectedYearSemester(e.target.value)}>
                                    {yearSemesters && yearSemesters.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.year} - {item.semester}
                                    </option>
                                    ))}
                                </select>
                            </div> */}
                            <a href="#!" className='confirm-btn' onClick={submitRequirement}>Confirm</a>
                        </div>
                    </div>
            </CustomModal>
        )
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
                        <li className={(selectedCourse.id == item.id && !nloIsSelected) ? "active" : ""} 
                            onClick={() => {
                                    setSelectedCourse(item);
                                    setNloIsSelected(false)
                                    fetchRequirements(courses[index].id, false);
                                }
                            } 
                            key={index}>{item.name}
                        </li>
                    ))}
                </ul>}
            </div>
        )
    }

    const handleTermChange = (event) => {
        setRequirementTerm(event.target.value);
    };

    const submitRequirement = async () => {
        const formData = new FormData();
        const departmentId = searchParams.get('department');
        formData.append('requirementTitle', requirementTitle)
        formData.append('requirementTerm', requirementTerm)
        formData.append('departmentId', departmentId)
        formData.append('ysId', ys.id)
        if(selectedCourse != null)
            formData.append('courseId', selectedCourse.id)

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements`, {
            method: 'POST',
            body: formData,
        })

        if(response && response.ok) {
            window.location.reload()
        }
    }

    useEffect(() => {
        fetchCourses().then((course) => {
            console.log("courses useeffect: ",course)
            fetchRequirements(course[0].id, false)
            fetchYearSemesters();
        })
    }, []);
  
    return (
        <div id='submission'>
            {/* left navbar */}
            {courses && showPrograms()}

            <div className='wrapper nav-wrapper'>
                <h1 className='page-title'><img src="/icons/documents.png" />Requirements</h1>
                { (auth.adminType != "NLO") &&
                    <div className='action-nav'>
                        <a href="#!" className='add-requirement' onClick={() => setIsAddModal(true)}><i className="fa-solid fa-plus"></i> Add Requirement</a>
                    </div>
                }
                { auth.adminType != "NLO" &&
                    <section>
                        <h2>PRELIM REQUIREMENTS</h2>
                        {showRequirements("prelim")}
                    </section>
                }
                <section>
                    <h2>MIDTERM REQUIREMENTS</h2>
                    {showRequirements("midterm")}
                </section>
                { auth.adminType != "NLO" &&
                    <section>
                        <h2>PRE-FINAL REQUIREMENTS</h2>
                        {showRequirements("pre-final")}
                    </section>
                }
                <section>
                    <h2>FINAL REQUIREMENTS</h2>
                    {showRequirements("final")}
                </section>
            </div>
            
            {isAddModal && showAddModal()}
            
        </div>
    );
  }