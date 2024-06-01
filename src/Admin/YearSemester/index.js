import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../../common/DataTable';
import CustomModal from '../../common/Modal'

const YearSemester = () => {

    const [yearSemesters, setYearSemesters] = useState(null)
    const [activeAddModal, setActiveAddModal] = useState(false)
    const [yearInput, setYearInput] = useState(null)
    const [semesterInput, setSemesterInput] = useState(null)
    const navigate = useNavigate();

    const fetchYearSemesters = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/yearSemesters`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("year semesters: ",result)
				setYearSemesters(result)
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

    const numberToOrdinal = (number) => {
        const ordinals = ["", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];
      
        const num = parseInt(number, 10);

        if (num > 0 && num < ordinals.length) {
          return ordinals[num];
        } else {
          return number;
        }
    };

    const onSave = async () => {
        const formData = new FormData();
		formData.append('year', yearInput);
		formData.append('semester', semesterInput);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/yearSemesters`, {
            method: 'POST',
            body: formData,
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("year semesters: ",result)
				window.location.reload()
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

    const showYearSemesters = () => {
        return <>
            { yearSemesters && yearSemesters.map((ys, index) => {
                return <section key={index} onClick={() => onYearSemesterClick(ys)}>
                    <p>{numberToOrdinal(ys.semester)} Semester</p>
                    <h4>S.Y. {ys.year}</h4>
                </section>
            })}
        </>
    }

    const onYearSemesterClick = (ys) => {
        Cookies.set('ys', JSON.stringify(ys));
        navigate('/admin/homepage')
    }

    useEffect(() => {
        fetchYearSemesters()
    }, []);

    return(
        <div id= "school-year">
            <div className='wrapper'>
                <div className='header'>
                    <h1>Year Semester</h1>
                    <a href='#!' className='btn-yellow' onClick={() => setActiveAddModal(true)}>Add Folder</a>
                </div>
                {yearSemesters && 
                    <div className='boxes'>
                        {showYearSemesters()}
                    </div>
                }
            </div>
            { activeAddModal &&
                <CustomModal show={true} onHide={() => {setActiveAddModal(false)}}>
                        <div className='ojt-folder-modal'>
                            <h2>Creating OJT Folder</h2>
    
                            <div className='ojt-folder-input-con'>
                                <div className='ojt-folder-input'>
                                    <label>Semester: </label>
                                    <input 
                                        name='semester' 
                                        type='number' 
                                        id='modal-semester'
                                        value={semesterInput}
                                        onChange={(e) => setSemesterInput(e.target.value)}/>
                                </div>
        
                                <div className='ojt-folder-input'>
                                    <label>School Year: </label>
                                    <input 
                                        name='year' 
                                        type='text' 
                                        id='modal-year'
                                        value={yearInput}
                                        onChange={(e) => setYearInput(e.target.value)}/>
                                </div>
                            </div>
                            
                            <a onClick={() => onSave()} href='#!' className='btn-yellow'>Save</a>
                        </div>

                </CustomModal>
            }
        </div>
    )
}

export default YearSemester