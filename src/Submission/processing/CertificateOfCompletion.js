import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

export default function CertificateOfCompletion({requirement, defaultDocument, onDocChange}) {

    const auth = JSON.parse(localStorage.getItem('auth'));
    const [step, setStep] = useState(1)
    const [document, setDocument] = useState(defaultDocument)
    const [selectedRequirement, setSelectedRequirement] = useState(requirement)
    const [isReUpload, setIsReUpload] = useState(false)

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            let uploadUrl = `${process.env.REACT_APP_API_URL}/file/upload`
            formData.append('step',2)
            if(!isReUpload) {
                formData.append('file', document);
                formData.append('userId',auth.userid);
                formData.append('requirementId', selectedRequirement.id);
                formData.append('isReUpload',isReUpload)
            }
            else {
                formData.append('file', document);
                formData.append('documentId', selectedRequirement.documents[0].id)
                formData.append('userId',auth.userid);
                uploadUrl = `${process.env.REACT_APP_API_URL}/file/reupload`
            }
    
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            })
    
            if (response.ok) {
                try {
                    const result = await response.json();
                    console.log("response: ",result.document)
                    setDocument(result.document)
                    setStep(2)
                    onDocChange(result.document)
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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setDocument(file)
        }
    };

    const step1 = () => {
        return <div className='uploaad-file'>
            <h2>Certificate of Completion</h2>
            <p>1. Upload a pdf file of your Certificate of Completion.</p>
            <p>2. Follow the filename “Lastname_COC.pdf”</p>
            <div className='attached-container'>
                {document && (
                    <div>
                        <div className='file-info'>{document.name} <a className='delete-btn' onClick={() => {setDocument(null)}}>Delete</a></div>
                        <div style={{textAlign:'center'}}><a className='btn-yellow' onClick={submitHandler}>Submit</a></div>
                    </div>
                )}
                {!document && (
                    <div className='file-container'>
                        <a type='button' className='file-upload'><img src="/icons/upload.png" />Upload Document</a>
                        <input
                        type='file'
                        id='file-upload'
                        onChange={handleFileChange}
                        />
                    </div>
                )}
            </div>
        </div>
    }

    const step2 = () => {
        return <div className='faculty-approval'>
            <img src='/icons/work-in-progress.png' />
            <p>Your Document is still on review.</p>
            <p>Please wait for the faculty to make` your document</p>
        </div>
    }

    const step3 = () => {
        return <div className='study-load-status'>
            <h2>Submission Status</h2>
            <div className='field-con'><label>Approval Status</label><input type='text' value={document.status} disabled /></div>
            <div className='field-con'><label>File</label><input type='text' value={document.fileName} disabled /></div>
            <div className='field-con'><label>Comments</label><input type='text' value={document.comment} disabled /></div>
        </div>
    }

    const showSteps = () => {
        return <div className='steps'>
            <ul>
                <li className={step == 1 && 'active'}>Step 1 <span>Upload File</span></li>
                <li className={step == 2 && 'active'}>Step 2 <span>Faculty Approval</span></li>
                <li className={step == 3 && 'active'}>Step 3 <span>Status</span></li>
            </ul>
        </div>
    }

    useEffect(() => {
        if(defaultDocument) {
            setStep(defaultDocument.step || 1)
            if(defaultDocument.status.toLowerCase() === 'declined')
                setIsReUpload(true)
        }
    }, []);
  
    return (
        <div id='study-load'>

            {showSteps()}

            { step && step == 1 &&
                <div>{step1()}</div>
            }
            { step && step == 2 &&
                <div>{step2()}</div>
            }
            { step && step == 3 &&
                <div>{step3()}</div>
            }

        </div>
    );
  }