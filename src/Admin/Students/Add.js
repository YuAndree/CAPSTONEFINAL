import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import DataTable from '../../common/DataTable';
import CustomModal from '../../common/Modal'

const Students = () => {

    const [program, setProgram] = useState("")
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [students, setStudents] = useState("")
    const [successModal, setSuccessModal] = useState(false)

    const handleSearch = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/searchUserAttributes?courseName=${program}&firstName=${firstName}&lastName=${lastName}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("response: ",result)
				setStudents(result)
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

    const fetchStudents = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("response: ",result)
				setStudents(result)
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

    const handleAddStudent = async (index) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${students[index].studentID}/verify`, {
            method: 'PUT',
        })

        if (response && response.ok) {
            try {
                setSuccessModal(true)
                console.log("response: ",response)
                fetchStudents()
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

    const showStudents = () => {
        return (
            <DataTable 
                header={['Course', 'Student Name', 'Action']} 
                data={students && students.length > 0 && students.map((item, index) => (
                    [
                        item.course.name, 
                        (item.lastName + ", " + item.firstName), 
                        (!item.verified 
                            ? (<a key={index} href='#!' onClick={() => handleAddStudent(index)}>Add Student</a>) 
                            : ('-'))
                    ]
                ))} 
            />
        )
    }

    const handleClear = () => {
        setFirstName("")
        setLastName("")
        setProgram("")
    }

    useEffect(() => {
        fetchStudents()
    }, []);

    return(
        <div id= "students">
            <div className='wrapper'>
                <h2>Search for Student</h2>
                <ul className='filter'>
                    <li>
                        <label>Program</label>
                        <input type='text' value={program} onChange={(e) => setProgram(e.target.value)} />
                    </li>
                    <li>
                        <label>Lastname</label>
                        <input type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </li>
                    <li>
                        <label>Firstname</label>
                        <input type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </li>
                </ul>
                <div className='filter-options'>
                    <button onClick={handleSearch}>Search</button>
                    <button onClick={handleClear}>clear</button>
                </div>
                {showStudents()}
            </div>
            {successModal && <CustomModal show={true} onHide={() => {}}>
                <div className='success-modal'>
                    <h2>Student Added</h2>
                    <p onClick={() => setSuccessModal(false)}>Close</p>
                </div>
            </CustomModal>}
        </div>
    )
}

export default Students