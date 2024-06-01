import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';
import DataTable from '../common/DataTable';

export default function Records() {
    const [documents, setDocuments] = useState(null)
    const [activeNav, setActiveNav] = useState(0);
    const auth = JSON.parse(localStorage.getItem('auth'));
    const location = useLocation();
    
    const fetchDocuments = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/documents/user/${auth.userid}`, {
            method: 'GET',
        })
        if (response && response.ok) {
            try {
                const result = await response.json();
                setDocuments(result)
				console.log("documents: ",result)
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

    const getDocumentsBy = (departmentName) => {
        return documents.filter(doc => doc.departmentName.toLowerCase() === departmentName.toLowerCase())
    }

    const showDocuments = () => {
        return <div className='student-documents'>
            
            <DataTable 
                showFilter={false} 
                header={[
                    'File name',
                    'Requirement Name',
                    'Status'
                ]} 
                data={getDocumentsBy(activeNav === 0 ? auth.course.department.name : 'nlo').map((doc, index) => {
                        return [
                            <Link to={`${process.env.REACT_APP_API_URL}/file/download/${doc.id}`}>{doc.fileName}</Link>,
                            <p style={{textAlign:'left'}}>{doc.requirement.title}</p>,
                            <p style={{textAlign:'left'}}>{doc.status}</p>
                        ]
                    }
                )} 
            />
        </div>
    }

    // Deep clone function
    function deepClone(obj) {
        if (Array.isArray(obj)) {
            return obj.map(deepClone);
        } else if (typeof obj === 'object' && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, val]) => [key, deepClone(val)])
            );
        } else {
            return obj;
        }
    }

    const showNloRequirements = () => {
        const nloRequirements = {
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

        let nloDocuments = getDocumentsBy('nlo')

        const studentRequirement = deepClone(nloRequirements)

        nloDocuments.forEach(doc => {
            studentRequirement[doc.requirement.title][1] = doc.status.toLowerCase()
        })


        const requirementList = Object.entries(nloRequirements).map(([key, value]) => {
            return <th key={key} style={{color:value[2]}}>{value[0]}</th>
        })

        return (
            <>
                {activeNav === 1 && 
                    <div className='nlo-records'>

                        <div className='nlo-requirements'>
                            <ul>
                                {
                                    Object.entries(nloRequirements).map(([key, value]) => {
                                        return <li style={{color: value[2] ? value[2] : '#000'}}>{key}</li>
                                    })
                                }
                            </ul>
                        </div>

                        <div className='nlo-records-header' style={{marginTop: '30px'}}>
                            <h2>NLO RECORDS</h2>
                        </div>
                        <DataTable 
                            showFilter={false} 
                            header={[
                                ...requirementList,
                                'Lacking Files',
                                'Action'
                            ]} 
                            data={[[
                                ...Object.entries(studentRequirement).map(([key, value]) => {
                                    return <td key={key}><i className={`status status-${value[1]}`}></i></td>
                                }),
                                Object.entries(studentRequirement).filter((value) => {
                                    return (value?.[1]?.[1] != "approved")
                                })
                                .map(val => val[1]?.[0])
                                .join(", "),
                                auth.remarks
                            ]]} 
                        />
                    </div>
                }
            </>
        );
    }

    useEffect(() => {
        fetchDocuments()
    },[])

    return (
        <div className='student-records'>
            <div className='wrapper'>
                <h1>RECORDS</h1>

                <ul className='student-documents-nav'>
                    <li className={activeNav === 0 ? 'active' : ''} onClick={() => setActiveNav(0)}>{auth.course.department.name}</li>
                    <li className={activeNav === 1 ? 'active' : ''} onClick={() => setActiveNav(1)}>NLO</li>
                </ul>

                {documents && documents.length > 0 && 
                    <>
                    {activeNav === 0 && showDocuments()}
                    {activeNav === 1 && showNloRequirements()}
                    </>
                }
            </div>
        </div>
    )
  }