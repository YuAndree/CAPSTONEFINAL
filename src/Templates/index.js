import * as React from 'react';
import './styles.css';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Modal from '../common/Modal'

export default function Templates() {

    const [templates, setTemplates] = useState(null)
    const [file,setFile] = useState(null)
    const [title, setTitle] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const auth = JSON.parse(localStorage.getItem('auth'));

    const fetchTemplates = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/templates/all`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setTemplates(result)
                console.log("response: ",result)
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

    const deleteTemplate = async (templateId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/templates/delete/${templateId}`, {
            method: 'DELETE',
        })

        if (response.ok) {
            window.location.replace("/templates")
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

    const showTemplates = () => {
        return (
            templates && <ul>
                {templates.map((item, index) => (
                    <li key={index}> 
                        <a href={`${process.env.REACT_APP_API_URL}/templates/download/${item.id}`} target='_blank' rel='noopener noreferrer'>{item.title}</a>
                        { auth.adminid && auth.adminType && auth.adminType.toLowerCase() != 'nlo' &&
                            <a className='template-delete-btn' onClick={() => deleteTemplate(item.id)}>Delete</a>
                        }
                    </li>
                ))}
            </ul>
        );
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setFile(file)
        }
    };

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            let uploadUrl = `${process.env.REACT_APP_API_URL}/templates/upload`
            formData.append('title', title)
            formData.append('file', file);
            formData.append('adminid',auth.adminid);
    
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            })
    
            if (response.ok) {
                try {
                    const result = await response.json();
                    console.log("response: ",result.template)
                    window.location.reload()
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
        } catch (error) {
            console.error('Error during file upload:', error);
            // Handle unexpected errors
        }
    }

    useEffect(() => {
        fetchTemplates()
    }, []);


    return <div id='templates'>
        <div className='wrapper'>
            <h1><img src="/icons/template.png" />List of Requirements</h1>

            { auth.adminid && auth.adminType && auth.adminType.toLowerCase() != 'nlo' &&
                <a className='add-btn' href="#!" onClick={() => setShowModal(true)}>Add Template</a>
            }
            <div className='template-list'>
                <h4>Templates</h4>
                {showTemplates()}
            </div>
        </div>
            { showModal && 
            <Modal show={showModal} onHide={() => setShowModal(false)}>

                <h2>Add Template</h2>
                <input type='text' placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
                <input
                    type='file'
                    id='file-upload'
                    onChange={handleFileChange}
                />
                <button className='btn-yellow' type='button' onClick={submitHandler} >Upload</button>

            </Modal>
            }
    </div>;
}
