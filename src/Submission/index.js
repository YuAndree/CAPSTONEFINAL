import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

export default function Submission() {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [document, setDocument] = useState(null);
    const [requirements, setRequirements] = useState(null)
    const [selectedRequirement, setSelectedRequirement] = useState(null)
    const [isReUpload, setIsReUpload] = useState(false)
    const [department, setDepartment] = useState(null)
    const [departments, setDepartments] = useState(null);
  
    const openUploadModal = () => setUploadModalOpen(true);
    const closeUploadModal = () => {setUploadModalOpen(false);setIsReUpload(false)};

    const openStatusModal = () => setStatusModalOpen(true);
    const closeStatusModal = () => setStatusModalOpen(false);

    const auth = localStorage.getItem('auth');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchDepartments = async () => {
		let response = null
		if(JSON.parse(auth).userid) {
			response = await fetch(`${process.env.REACT_APP_API_URL}/department/user/${JSON.parse(auth).userid}`, {
				method: 'GET',
			})
		}
        

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("departments: ",result)
				setDepartments(result)
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

    const fetchRequirements = async (departmentId = searchParams.get('department')) => {

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements/department/${departmentId}/course/${JSON.parse(auth).course.id}?userid=${JSON.parse(auth).userid}&ysId=${JSON.parse(auth).yearSemesterId}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
                console.log("response: ",result)
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

    const fetchDepartment = async (departmentId = searchParams.get('department')) => {

        const response = await fetch(`${process.env.REACT_APP_API_URL}/department/${departmentId}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setDepartment(result)
                console.log("department: ",result)
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

    const showDepartments = () => {
        return (
            departments && 
            <>
                <ul>
                    {departments.map((item, index) => (
                        department && 
                        <li key={index}>
                            <a className={department.id == item.id ? 'active' : ''} onClick={() => {
                                fetchRequirements(item.id)
                                setDepartment(item)
                            }}>{item.name}</a>
                        </li>
                    ))}
                </ul>
            </>
        );
    }

    const showRequirements = (term) => {
        return (
            requirements && 
            <>
                <table className='tbl-requirements'>
                    <tbody>
                        {requirements.map((item, index) => (
                            (!term || (item.term && item.term.toLowerCase() == term)) &&
                            <tr key={index}>
                                <td>
                                    <a href="#!" onClick={() => {
                                        // open upload modal if status is not available for this document
                                        if(item.documents.length == 0)
                                            openUploadModal();
                                        else
                                            openStatusModal();
                                        setSelectedRequirement(item)
                                    }}>{item.title}</a>
                                </td>
                                <td>
                                    {  
                                        item.documents.length > 0 && 
                                        <span className={"status-"+item.documents[0].status.toLowerCase()}>{(item.documents.length > 0 && item.documents[0].status)}</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    }

    const showNloRequirements = (term) => {

        const  nloRequirements = {
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
        
        if(requirements) {
            // Sets the status for each requirements
            requirements.forEach(item => {
                if(nloRequirements.hasOwnProperty(item.title))
                    nloRequirements[item.title][1] = item?.documents?.[0]?.status.toLowerCase()
            });
        }
        
        return (
            requirements && 
            <>
                <div className='nlo-requirements'>
                    <ul>
                        {requirements
                        .filter(req => nloRequirements[req.title] && nloRequirements[req.title].length > 0)
                        .map((item, index) => (
                            <li key={index}>
                                <a style={{color: nloRequirements[item.title] ? nloRequirements[item.title][2] : '#000'}} href='#!' onClick={() => {
                                    // open upload modal if status is not available for this document
                                    if(item.documents.length == 0)
                                        openUploadModal();
                                    else
                                        openStatusModal();
                                    setSelectedRequirement(item)
                                }}>{item.title}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='tbl-requirements-status-con'>
                    <table className='tbl-requirements-status tbl-requirements-status1'>
                        <thead>
                            <tr>
                                {
                                    Object.entries(nloRequirements).map(([key, value]) => {
                                        return <th key={key} style={{color:value[2]}}>{value[0]}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                { nloRequirements && requirements &&
                                    Object.entries(nloRequirements).map(([key, value]) => {
                                        return <td key={key}><i className={`status status-${value[1]}`}></i></td>
                                    })
                                }
                            </tr>
                        </tbody>
                    </table>
                    <table className='tbl-requirements-status'>
                        <thead>
                            <tr>
                                <th>Lacking File/Files</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {
                                        nloRequirements && 
                                        Object.entries(nloRequirements).filter((value) => {
                                            return (value?.[1]?.[1] != "approved")
                                        })
                                        .map(val => val[1]?.[0])
                                        .join(", ")
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='tbl-requirements-status'>
                        <thead>
                            <tr><th>Remarks</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {JSON.parse(auth)?.remarks}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setDocument(file)
        }
    };

    const submitHandler = async () => {
        try {
            const formData = new FormData();
            let uploadUrl = `${process.env.REACT_APP_API_URL}/file/upload`
            formData.append('step',2)
            if(!isReUpload) {
                formData.append('file', document);
                formData.append('userId',JSON.parse(auth).userid);
                formData.append('requirementId', selectedRequirement.id);
                formData.append('isReUpload',isReUpload)
            }
            else {
                formData.append('file', document);
                formData.append('documentId', selectedRequirement.documents[0].id)
                formData.append('userId',JSON.parse(auth).userid);
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
      

    const UploadModal = ({ closeModal, title }) => {
        return (
            <div className="modal-container">
                <img className='modal-bg' src='/images/folder.png' />
                <div className='modal-back' onClick={closeModal}><span>&lsaquo;</span>{department ? department.name : ""} Department</div>
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

    const StatusModal = ({ closeModal, children }) => {
        return (
          <div className="modal-container">
            <img className='modal-bg' src='/images/folder.png' />
            <div className='modal-back' onClick={closeModal}><span>&lsaquo;</span>{department ? department.name : ""} Department</div>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className='status-title'>{selectedRequirement.title}</h2>
                <h3>Submission Status</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Submission Status</td>
                            <td>Submitted</td>
                        </tr>
                        <tr>
                            <td>Approval Status</td>
                            <td>{selectedRequirement.documents[0].status}</td>
                        </tr>
                        <tr>
                            <td>File</td>
                            <td>{selectedRequirement.documents[0].fileName}</td>
                        </tr>
                        <tr>
                            <td>Comments</td>
                            <td>{selectedRequirement.documents[0].comment ? selectedRequirement.documents[0].comment : "-"}</td>
                        </tr>
                    </tbody>
                </table>
                {
                    selectedRequirement.documents[0].status != "Approved" ? (
                        <button type='button' onClick={() => {
                            setIsReUpload(true); 
                            closeStatusModal(); 
                            openUploadModal();
                        }}>Re-Upload</button>
                    ) : null
                }
            </div>
          </div>
        );
    };

    useEffect(() => {
        fetchDepartments()
        fetchRequirements()
        fetchDepartment()
    }, []);
  
    return (
        <div id='requirements'>
            <div className='wrapper'>
                <div className='requirements-header'>
                    <h1><img src='/icons/documents.png' />Requirements</h1>
                    
                </div>
                {/* <div className='requirements-nav'>
                    {showDepartments()}
                </div> */}
                <div className='requirements-content'>
                    {department && department.name.toLowerCase() != 'nlo' 
                        ? 
                        <>
                            <section>
                                <h2>PRELIM REQUIREMENTS</h2>
                                {showRequirements("prelim")}
                            </section>
                            <section>
                                <h2>MIDTERM REQUIREMENTS</h2>
                                {showRequirements("midterm")}
                            </section>
                            <section>
                                <h2>PRE-FINAL REQUIREMENTS</h2>
                                {showRequirements("pre-final")}
                            </section>
                            <section>
                                <h2>FINAL REQUIREMENTS</h2>
                                {showRequirements("final")}
                            </section>
                        </>
                        : showNloRequirements()}
                </div>
            </div>
            
            {/* modals */}
            {(isUploadModalOpen && JSON.parse(auth).verified) && (
                <UploadModal closeModal={closeUploadModal} title={selectedRequirement.title} />
            )}

            {(isStatusModalOpen && JSON.parse(auth).verified) && (
                <StatusModal closeModal={closeStatusModal} />
            )}
            {/* end modals */}
        </div>
    );
  }