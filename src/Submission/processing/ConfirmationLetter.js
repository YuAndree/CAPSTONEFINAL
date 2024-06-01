import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

export default function ConfirmationLetter({requirement, defaultDocument, onDocChange}) {

    const auth = JSON.parse(localStorage.getItem('auth'));
    const [step, setStep] = useState(1)
    const [document, setDocument] = useState(defaultDocument)
    const [selectedRequirement, setSelectedRequirement] = useState(requirement)
    const [isReUpload, setIsReUpload] = useState(false)

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            let uploadUrl = `${process.env.REACT_APP_API_URL}/file/upload`
            formData.append('step',3)
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
                    setStep(3)
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
        return <div className='download-file'>
            <h2>Confirmation Letter</h2>
            <ol>
                <li>Download the file below.<br/><a href="/documents/Confirmation-Letter.pdf">Confirmation Letter.pdf</a></li>
                <li>Have you company fill the necessary information, with a signature attached.</li>
                <li>Have it notarized by a notary public</li>
                <li>Once completed, upload it in the next page.</li>
            </ol>
            <a className='btn-yellow' onClick={() => setStep(2)}>Next</a>
        </div>
    }

    const step2 = () => {
        return <div className='upload-file'>
            <h2>Upload Confirmation Letter</h2>
            <p>1. Follow the filename “Lastname_ConfirmationLetter.pdf”</p>
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

    const step3 = () => {
        return <div className='faculty-approval'>
            <img src='/icons/work-in-progress.png' />
            <p>Your Document is still on review.</p>
            <p>Please wait for the faculty to make` your document</p>
        </div>
    }

    const step4 = () => {
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
                <li className={step == 1 && 'active'}>Step 1 <span>Download File</span></li>
                <li className={step == 2 && 'active'}>Step 2 <span>Upload File</span></li>
                <li className={step == 3 && 'active'}>Step 3 <span>Faculty Approval</span></li>
                <li className={step == 4 && 'active'}>Step 4 <span>Status</span></li>
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
            { step && step == 4 &&
                <div>{step4()}</div>
            }

        </div>
    );
  }