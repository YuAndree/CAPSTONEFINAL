import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './styles.css'
import DataTable from '../../common/DataTable'
import CustomModal from '../../common/Modal'
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const Validate = () => {

    const [documents, setDocuments] = useState(null)
    const [check, setCheck] = useState(false)
    const [checkInfo, setCheckInfo] = useState(null)
    const [commentModal, setCommentModal] = useState(false)
    const [comment, setComment] = useState(null)
    const [documentStatus, setDocumentStatus] = useState("pending")
    const [filter, setFilter] = useState("pending")
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const requirementId = searchParams.get('requirementId');

    const fetchDocuments = async (status = "pending") => {
        setFilter(status)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements/${requirementId}`, {
            method: 'GET',
        })
        if(response && response.ok) {
            try {
                const result = await response.json();
                console.log("documents: ",result.documents)
                if(!status)
                    setDocuments(result.documents)
                else
                    setDocuments(result.documents.filter((item) => item.status.toLowerCase() == status))
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

    const formatDate = (dateToFormat) => {
        const createdAtDate = new Date(dateToFormat);
        const month = createdAtDate.getMonth() + 1; // Months are zero-based, so add 1
        const day = createdAtDate.getDate();
        const year = createdAtDate.getFullYear();

        return `${month}/${day}/${year}`;
    }

    const showDocuments = () => {
        return (
            documents && 
            <table id='documents-table'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>File Uploaded</th>
                        <th>Date/Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((item, index) => (
                        <tr key={index}>
                            <td>{item.submittedBy.userid}</td>
                            <td>{item.submittedBy.firstName}</td>
                            <td>{item.submittedBy.lastName}</td>
                            <td>{item.fileName}</td>
                            <td>{formatDate(item.createdAt)}</td>
                            {
                                (filter && filter == "pending") ? <td><a href="#!" onClick={() => {setCheckInfo(item);setCheck(true);}} className='check-btn'>Check</a></td>
                                : <td style={{textAlign:"center"}}>-</td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    const handleDocumentStatus = async (documentId = null) => {
        const formData = new FormData();
        formData.append('comment', comment)
        formData.append('status', documentStatus)
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

    const showDocument = () => {
        return (
        <div className='document-con'>
            <button className='back-btn' onClick={() => setCheck(false)}>&lsaquo;</button>
            <div className='document-info'>
                <div className='header'>
                    <h4>{checkInfo.submittedBy.firstName} {checkInfo.submittedBy.lastName}</h4>
                    <div className='actions'>
                        <button onClick={() => {setDocumentStatus("Declined");setCommentModal(true)}}>Decline</button>
                        <button onClick={() => {setDocumentStatus("Approved");setCommentModal(true)}}>Approve</button>
                    </div>
                </div>
                {checkInfo.extName == "pdf" 
                    ?   <Document file={`${process.env.REACT_APP_API_URL}/file/download/${checkInfo.id}`} >
                            <Page pageNumber={1} />
                        </Document>
                    :   <figure><img src={`${process.env.REACT_APP_API_URL}/file/download/${checkInfo.id}`} /></figure>
                }
            </div>
        </div>
        )
    }

    useEffect(() => {
        fetchDocuments()
    }, []);

    return (
    
      <div id='validate'>
        <div className='wrapper'>
			<h1>Requirements</h1>
            <div className="validate-nav">
                <label htmlFor="status1" className={filter == "pending" ? "active" : ""}><input type='radio' name='status' id='status1' defaultChecked onChange={() => fetchDocuments("pending")} />FOR CHECKING</label>
                <label htmlFor="status2" className={filter == "approved" ? "active" : ""}><input type='radio' name='status' id='status2' onChange={() => fetchDocuments("approved")} />APPROVED</label>
                <label htmlFor="status3" className={filter == "declined" ? "active" : ""}><input type='radio' name='status' id='status3' onChange={() => fetchDocuments("declined")} />DECLINED</label>
            </div>
            {showDocuments()}
            {
            (check && checkInfo && commentModal) && 
                <CustomModal show={true} onHide={(val) => setCommentModal(val)}>
                    <div id='check-modal'>
                        {/* <a href={`${process.env.REACT_APP_API_URL}/file/download/${checkInfo.id}`} target='_blank' rel='noopener noreferrer'>Download</a> */}
                        <label>Enter Comments</label>
                        <textarea onChange={(e) => setComment(e.target.value)}></textarea>
                        <div className='modal-footer'>
                            <button onClick={() => setCommentModal(false)}>Cancel</button>
                            <button onClick={() => handleDocumentStatus(checkInfo.id)}>{documentStatus == "Declined" ? "Decline" : "Approve"}</button>
                        </div>
                    </div>
                </CustomModal>
            }
            {(check && checkInfo) && showDocument()}
        </div>
      </div>
      
      );
}


export default Validate;

