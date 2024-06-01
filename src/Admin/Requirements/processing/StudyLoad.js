import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import DataTable from '../../../common/DataTable';
import CustomModal from '../../../common/Modal'

export default function StudyLoad({requirementId}) {

    const [documents, setDocuments] = useState(null)
    const [document, setDocument] = useState(null)
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null)
    const [commentModal, setCommentModal] = useState(false)
    const [comment, setComment] = useState(null)
    const [check, setCheck] = useState(false)
    const [documentStatus, setDocumentStatus] = useState("pending")
    const [selectedFilter, setSelectedFilter] = useState('pending')

    const openStatusModal = () => setStatusModalOpen(true);
    const closeStatusModal = () => setStatusModalOpen(false);

    const openUploadModal = () => setUploadModalOpen(true);
    const closeUploadModal = () => {setUploadModalOpen(false)};

    const auth = JSON.parse(localStorage.getItem('auth'));
    const ys = JSON.parse(Cookies.get('ys'));
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


    const showDocument = () => {
        return (
        <div className='document-con'>
            <button className='back-btn' onClick={() => setCheck(false)}>&lsaquo;</button>
            <div className='document-info'>
                <div className='header'>
                    <h4>{selectedDocument.submittedBy.firstName} {selectedDocument.submittedBy.lastName}</h4>
                    <div className='actions'>
                        <button onClick={() => {setDocumentStatus("Declined");setCommentModal(true)}}>Decline</button>
                        <button onClick={() => {setDocumentStatus("Approved");setCommentModal(true)}}>Approve</button>
                    </div>
                </div>
                {selectedDocument.extName == "pdf" 
                    ?   <Document file={`${process.env.REACT_APP_API_URL}/file/download/${selectedDocument.id}`} >
                            <Page pageNumber={1} />
                        </Document>
                    :   <figure><img src={`${process.env.REACT_APP_API_URL}/file/download/${selectedDocument.id}`} /></figure>
                }
            </div>
        </div>
        )
    }

    const StatusModal = ({ closeModal, children }) => {
        return (
          <div className="modal-container">
            <img className='modal-bg' src='/images/folder.png' />
            <div className='modal-back' onClick={closeModal}><span>&lsaquo;</span>{selectedDocument.fileName}</div>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className='status-title'>{}</h2>
                <h3>Submission Status</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Submission Status</td>
                            <td>Submitted</td>
                        </tr>
                        <tr>
                            <td>Approval Status</td>
                            <td>{selectedDocument.status}</td>
                        </tr>
                        <tr>
                            <td>File</td>
                            <td><a href={`${process.env.REACT_APP_API_URL}/file/download/${selectedDocument.id}`}>{selectedDocument.fileName}</a></td>
                        </tr>
                        <tr>
                            <td>Comments</td>
                            <td>{selectedDocument.comment}</td>
                        </tr>
                    </tbody>
                </table>

                <div className='submission-status-btn-con' >
                    {/* <button type='button' onClick={() => {
                        setCommentModal(true)
                    }}>Decline</button> */}
    
                    <button type='button' onClick={() => {
                        closeStatusModal(); 
                        openUploadModal();
                    }}>Re-Upload</button>
                </div>

            </div>
          </div>
        );
    };

    const UploadModal = ({ closeModal, title }) => {
        return (
            <div className="modal-container">
                <img className='modal-bg' src='/images/folder.png' />
                <div className='modal-back' onClick={closeModal}><span>&lsaquo;</span>{selectedDocument.fileName}</div>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>{title}</h2>
                    <h4>Attach Files</h4>
                    <div className='attached-container'>
                        {document && (
                            <div>
                                <div className='file-info'>{document.name} <a className='delete-btn' onClick={() => {setDocument(null)}}>Delete</a></div>
                                <a className='btn-submit' onClick={submitHandler}>Submit</a>
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
            </div>
        );
    };

    const submitHandler = async () => {
        try {
            const formData = new FormData();

            formData.append('file', document);
            formData.append('documentId', selectedDocument.id)
            formData.append('userId',selectedDocument.submittedBy.userid);
            formData.append('status', 'Pending')
            formData.append('step', selectedDocument.step)
            const uploadUrl = `${process.env.REACT_APP_API_URL}/file/admin/reupload`
    
            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData,
            })
    
            if (response.ok) {
                try {
                    const result = await response.json();
                    console.log("response: ",result.document)
                    setDocument(null)
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

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setDocument(file)
        }
    };

    const fetchDocuments = async (filterStatus = 'pending') => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/requirement/${requirementId}/ys/${ys.id}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                let result = await response.json();
                setSelectedFilter(filterStatus)
                result = result.filter(res => (filterStatus === 'pending' && res.status.toLowerCase() === 'pending' && res.step === 2))
                setDocuments(result)
                showTable()
                console.log("documents: ",result)
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

    const showTable = () => {
        return (
        <DataTable 
            showFilter={true}
            header={[
                'Date',
                'Student ID',
                'Name',
                'Course',
                '',
            ]} 
            data={
                documents.map(doc => {
                    return [
                        formatDate(doc.createdAt), 
                        doc.submittedBy.studentID, 
                        doc.submittedBy.firstName+' '+doc.submittedBy.lastName, doc.courseName, 
                        <a href="#!" onClick={() => {
                            if(doc.status.toLowerCase() === 'declined')
                                openStatusModal();
                            else
                                setCheck(true)
                            setSelectedDocument(doc)
                        }}>View</a>
                    ]
                })
            }
        />
        )
    }

    const handleDocumentStatus = async (documentId = null) => {
        const formData = new FormData();
        formData.append('comment', comment)
        formData.append('status', documentStatus)
        formData.append('step', selectedDocument.step + 1)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/${documentId}`, {
            method: 'PUT',
            body: formData,
        })
        if(response && response.ok) {
            console.log("Update success")
            window.location.reload();
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

    const formatDate = (dateData) => {
        const date = new Date(dateData);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
        const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        fetchDocuments()
    }, []);
    useEffect(() => {
        fetchDocuments()
    }, [requirementId])
  
    return (
        <div id='endorsement-letter'>
            {!check && 
                <>
                    {selectedFilter && 
                        <h1>{selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Request</h1>
                    }
                    {documents && showTable()}

                    
                </>
            }
            {check && showDocument()}
            {isStatusModalOpen && (
                <StatusModal closeModal={closeStatusModal} />
            )}
            {isUploadModalOpen && (
                <UploadModal closeModal={closeUploadModal} title={"Upload Document"} />
            )}
            {commentModal && 
                <CustomModal show={true} onHide={(val) => setCommentModal(val)}>
                    <div id='check-modal'>
                        {/* <a href={`${process.env.REACT_APP_API_URL}/file/download/${checkInfo.id}`} target='_blank' rel='noopener noreferrer'>Download</a> */}
                        <label>Enter Comments</label>
                        <textarea onChange={(e) => setComment(e.target.value)}></textarea>
                        <div className='modal-footer'>
                            <button onClick={() => setCommentModal(false)}>Cancel</button>
                            <button onClick={() => handleDocumentStatus(selectedDocument.id)}>{documentStatus == "Declined" ? "Decline" : "Approve"}</button>
                        </div>
                    </div>
                </CustomModal>
            }
        </div>
    );
  }