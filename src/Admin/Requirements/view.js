import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { Link, useLocation } from 'react-router-dom';
import DataTable from '../../common/DataTable';
import CustomModal from '../../common/Modal'
import { Document, Page, pdfjs } from 'react-pdf';

export default function Submission() {
    const [requirements, setRequirements] = useState(null)
    const [studentRequirements, setStudentRequirements] = useState(null)
    const [student, setStudent] = useState(null)
    const [activeEditRecords, setActiveEditRecords] = useState(false)
    const [remarks, setRemarks] = useState('')
    const [check, setCheck] = useState(false)
    const [checkInfo, setCheckInfo] = useState(null)

    const auth = localStorage.getItem('auth');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const ys = JSON.parse(Cookies.get('ys'));
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    const fetchUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/userByID/${searchParams.get('userid')}`, {
            method: 'GET',
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("student: ",result)
                setStudent(result)
                setRemarks(result.remarks)
                return result
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

    const toggleNloRecords = async (requirementId, status, documentId) => {
        const formData = new FormData();
        formData.append('requirementId', requirementId)
        formData.append('userId', student.userid)
        formData.append('status', status)
        formData.append('documentId', documentId ? documentId : 0)

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/nlo/create-or-update`, {
            method: 'POST',
            body: formData,
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
                console.log("nlo record toggle: ",result)
                fetchRequirements(student, JSON.parse(auth).departmentId, true);
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

    const fetchRequirements = async (student, departmentId, isNlo) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements?userid=${student.userid}`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                if(isNlo)
                    setRequirements(result)
                else
                    setStudentRequirements(result)
                console.log("requirements: ",result)
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

    const showNloRequirements = () => {

        const  nloRequirements = {
            'OC: Orientation Certificate'       : ['OC',null,'#677800',null],
            'CL: Confirmation Letter'           : ['CL',null,'#E900FE',null],
            'MOA: Memorandum of Agreement'      : ['MOA',null,'#000000',null],
            'DOU: Deed of Undertaking'          : ['DOU',null,'#FF0808',null],
            'EL: Endorsement Letter'            : ['EL',null,'#F19F00',null],
            'W: Waiver'                         : ['W',null,'#047016',null],
            'LOU: Letter of Undertaking'        : ['LOU',null,'#000AFF',null],
            'OSL: Official Study Load'          : ['OSL',null,'#FF006B',null],
            'COC: Certificate of Completion'    : ['COC',null,'#0DB09C',null],
        }
        
        if(requirements) {
            // Sets the status for each requirements
            requirements.forEach(item => {
                if(nloRequirements.hasOwnProperty(item.title)) {
                    nloRequirements[item.title][1] = item?.documents?.[0]?.status.toLowerCase()
                    nloRequirements[item.title][3] = item?.documents?.[0]?.id
                }
            });
        }

        const requirementDetails = studentRequirements?.filter(item => item?.documents?.[0]).map(item2 => {
            return [
                <a href="#!" onClick={() => {setCheck(true);setCheckInfo(item2.documents[0])}}>{item2.documents[0].fileName}</a>,
                item2.title,
                item2.documents[0].status
            ]
        })
        
        return (
            requirements && 
            <>
                <div className='student-documents requirement-section'>
                    <DataTable 
                        showFilter={false}
                        header={['File name', 'Requirement Name', 'Status']} 
                        data={requirementDetails} 
                    />
                </div>

                { JSON.parse(auth).adminType && JSON.parse(auth).adminType.toLowerCase() == 'nlo' &&
                    <div className='nlo-requirements-con requirement-section'>
                        <div className='nlo-requirements'>
                            <div className='nlo-requirements-header'>
                                <h2>NLO RECORDS</h2>
                                {JSON.parse(auth).adminType && JSON.parse(auth).adminType.toLowerCase() == 'nlo' &&
                                    <a href='#!' className='edit-btn btn-yellow' onClick={() => setActiveEditRecords(true)}>EDIT</a>
                                }
                            </div>
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
                                                return <td>
                                                    <a key={key} href='#!' className={`status status-${value[1]}`} onClick={() => {
                                                        if(activeEditRecords) {
                                                            const req = requirements.find(item => item.title == key)
                                                            const newStatus = (value[1] == 'approved') ? 'Disapproved' : 'Approved'
                                                            if(['OC: Orientation Certificate', 'MOA: Memorandum of Agreement', 'LOU: Letter of Undertaking'].includes(req.title))
                                                                toggleNloRecords(req.id, newStatus, value[3])
                                                        }
                                                    }}></a>
                                                </td>
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
                                            <input 
                                                type='text' 
                                                onChange={(e) => setRemarks(e.target.value)} 
                                                value={remarks} 
                                                className='tbl-requirements-status-remarks'
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <a className='edit-records-accept-btn btn-yellow' href='#!' onClick={() => {
                            updateRemarks()
                            setActiveEditRecords(false)
                        }}>Accept</a>
                    </div>
                }
            </>
        );
    }

    const updateRemarks = async () => {
        const formData = new FormData();
        formData.append('remarks', remarks);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/user/remarks/update/${searchParams.get('userid')}`, {
            method: 'PUT',
            body: formData,
        })

        if (response && response.ok) {
            try {
                const result = await response.json();
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle unexpected JSON parsing error
            }
        } else {
            console.error('Upload failed:');
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

    const showEditRecordsModal = () => {
        return <div className="edit-records-modal">
            <CustomModal show={true} onHide={() => setActiveEditRecords(false)}>
                <div className='edit-records-modal-header'>
                    <h2>Edit Records</h2>
                    <a href='#!' onClick={() => setActiveEditRecords(false)}><img src="/icons/close.png" /></a>
                </div>
                {showNloRequirements()}
            </CustomModal>
        </div>
    }

    const showDocument = () => {
        return (
        <div className='document-con'>
            <button className='back-btn' onClick={() => setCheck(false)}>&lsaquo;</button>
            <div className='document-info'>
                <div className='header'>
                    <h4>{checkInfo.submittedBy.firstName} {checkInfo.submittedBy.lastName}</h4>
                    <div className='actions'>
                        <a href={`${process.env.REACT_APP_API_URL}/file/download/${checkInfo.id}`}>Download</a>
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
        const fetchData = async () => {
            const student = await fetchUser();
            fetchRequirements(student, 1, true);
            fetchRequirements(student, student.course.department.id, false)
        };
    
        fetchData();
    }, []);
  
    return (
        <div id='requirements-view'>
            <div className='wrapper'>
                <a className='back' onClick={() => {window.history.back()}}><img src="/icons/back.png" /></a>
                <div className='profile requirement-section'>
                    <section><img src="/images/profile_placeholder.png" /></section>
                    <section>
                        <p>Name</p>
                        <p>Email</p>
                        <p>Company Name</p>
                    </section>
                    <section>
                        {student && 
                            <>
                                <p>{student.firstName} {student.lastName}</p>
                                <p>{student.email}</p>
                                <p>{student.companyName}</p>
                            </>
                        }
                    </section>
                    <section>
                    <Link to={`/profile?userid=${student?.userid}`} className='btn-yellow'>View Profile</Link>
                    </section>
                </div>
                <div className='requirements-content'>
                    {showNloRequirements()}
                </div>
            </div>
            {activeEditRecords && showEditRecordsModal()}
            {(check && checkInfo) && showDocument()}
        </div>
    );
  }