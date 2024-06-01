import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';
import DataTable from '../../common/DataTable';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const StudentDocuments = () => {

    const auth = JSON.parse(localStorage.getItem('auth'));
    const [documents, setDocuments] = useState(null)
    const [courses, setCourses] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState()
    const [check, setCheck] = useState(false)
    const [checkInfo, setCheckInfo] = useState(null)
    const [userProfile, setUserProfile] = useState(null)
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchDocuments = async () => {
        const userId = searchParams.get('userid');
        const courseId = searchParams.get('course');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/user/${userId}`, {
            method: 'GET',
        })
        const response2 = await fetch(`${process.env.REACT_APP_API_URL}/courses?departmentId=${auth.departmentId}`, {
            method: 'GET',
        })
        const response3 = await fetch(`${process.env.REACT_APP_API_URL}/userByID/${userId}`, {
            method: 'GET',
        })

        if (response && response.ok && response2 && response.ok && response3 && response3.ok) {
            try {
                const result = await response.json();
                const result2 = await response2.json();
                const result3 = await response3.json();
                setCourses(result2)
                setDocuments(result)
                setSelectedCourse(result2.findIndex((item) => item.id == courseId))
                setUserProfile(result3)
				console.log("documents: ",result)
                console.log("courses: ",result2)
                console.log("user profile: ",result3)
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

    const showDocuments = () => {
        return (
            <DataTable 
                showFilter={false} 
                header={['File name', 'Status']} 
                data={(documents && documents.length > 0) && documents
                    .map((item, index) => ([
                        <a key={index} href="#!" onClick={() => {setCheck(true);setCheckInfo(item)}}>{item.fileName}</a>, 
                        item.status
                    ]))
                } 
            />
        )
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
        fetchDocuments()
    }, []);

    return(
        <div id= "students">
            <div className="wrapper">
                <Link to="/admin/students" className='back'><img src="/icons/back.png" /></Link>
                <div className="records-profile">
                    <section>
                        <figure><img src="/images/profile_placeholder.png" /></figure>
                    </section>
                    <section>
                        <p>Name</p>
                        <p>Email</p>
                        <p>Company Name</p>
                    </section>
                    <section>
                        { userProfile &&
                        <>
                            <p>{userProfile?.firstName} {userProfile?.lastName}</p>
                            <p>{userProfile?.email}</p>
                            <p>{userProfile?.companyName}</p>
                        </>
                        }
                    </section>
                    <section>
                        <Link to={'/profile?userid='+searchParams.get('userid')} href="#!">View Profile</Link>
                    </section>
                </div>
                {showDocuments()}
            </div>
            {(check && checkInfo) && showDocument()}
        </div>
    )
}

export default StudentDocuments