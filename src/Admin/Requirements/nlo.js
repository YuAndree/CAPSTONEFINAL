import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import EndorsementLetter from './processing/EndorsementLetter';
import StudyLoad from './processing/StudyLoad';
import DeedOfUndertaking from './processing/DeedOfUndertaking';
import ConfirmationLetter from './processing/ConfirmationLetter';
import Waiver from './processing/Waiver';
import CertificateOfCompletion from './processing/CertificateOfCompletion';
import NloEndorsementLetter from './processing/NloEndorsementLetter';
import CustomModal from '../../common/Modal'

export default function Submission() {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    const [isStatusModalOpen, setStatusModalOpen] = useState(false);
    const [document, setDocument] = useState(null);
    const [requirements, setRequirements] = useState(null)
    const [selectedRequirement, setSelectedRequirement] = useState(null)
    const [isReUpload, setIsReUpload] = useState(false)
    const [department, setDepartment] = useState(null)
    const [departments, setDepartments] = useState(null);
    const [elDoc, setElDoc] = useState(null);
    const [oslDoc, setOslDoc] = useState(null);
    const [douDoc, setDouDoc] = useState(null);
    const [clDoc, setClDoc] = useState(null);
    const [wDoc, setWDoc] = useState(null);
    const [cocDoc, setCocDoc] = useState(null);
    const [showDisableModal, setShowDisableModal] = useState(false);
  
    const openUploadModal = () => setUploadModalOpen(true);
    const closeUploadModal = () => {setUploadModalOpen(false);setIsReUpload(false)};

    const openStatusModal = () => setStatusModalOpen(true);
    const closeStatusModal = () => setStatusModalOpen(false);

    const auth = localStorage.getItem('auth');
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const fetchRequirements = async () => {

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/requirements/admin/department/1`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setRequirements(result)
                result.forEach(item => {
                    switch(item.title) {
                        case 'EL: Endorsement Letter':
                            if(JSON.parse(auth).adminType.toLowerCase() === 'nlo')
                                setSelectedRequirement(item)
                            if(item?.documents[0]?.step) {
                                setElDoc(item.documents[0])
                            }
                            break;
                        case 'OSL: Official Study Load':
                            if(JSON.parse(auth).adminType.toLowerCase() !== 'nlo')
                                setSelectedRequirement(item)
                            if(item?.documents[0]?.step) {
                                setOslDoc(item.documents[0])
                            }
                            break;
                        case 'DOU: Deed of Undertaking':
                            if(item?.documents[0]?.step) {
                                setDouDoc(item.documents[0])
                            }
                            break;
                        case 'CL: Confirmation Letter':
                            if(item?.documents[0]?.step) {
                                setClDoc(item.documents[0])
                            }
                            break;
                        case 'W: Waiver':
                            if(item?.documents[0]?.step) {
                                setWDoc(item.documents[0])
                            }
                            break;
                        case 'COC: Certificate of Completion':
                            if(item?.documents[0]?.step) {
                                setCocDoc(item.documents[0])
                            }
                            break;
                    }
                })
                console.log("nlo requirements: ",result)
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
            'OC: Orientation Certificate'       : ['Orientation Certificate',null,'#677800',7],
            'CL: Confirmation Letter'           : ['Confirmation Letter',null,'#E900FE',4],
            'MOA: Memorandum of Agreement'      : ['Memorandum of Agreement',null,'#000000',8],
            'DOU: Deed of Undertaking'          : ['Deed of Undertaking',null,'#FF0808',3],
            'EL: Endorsement Letter'            : ['Endorsement Letter',null,'#F19F00',2],
            'W: Waiver'                         : ['Waiver',null,'#047016',5],
            'LOU: Letter of Undertaking'        : ['Letter of Undertaking',null,'#000AFF',9],
            'OSL: Official Study Load'          : ['Official Study Load',null,'#FF006B',1],
            'COC: Certificate of Completion'    : ['Certificate of Completion',null,'#0DB09C',6],
        }
        
        if(requirements) {
            // Sets the status for each requirements
            requirements.forEach(item => {
                if(nloRequirements.hasOwnProperty(item.title)) {
                    nloRequirements[item.title][1] = item?.documents?.[0]?.status.toLowerCase()
                }
            });
        }

        const couApproved = (douDoc && douDoc.status.toLowerCase() === 'approved');
        
        return (
            requirements && 
            <>
                <div className='nlo-requirements-nav'>
                    <ul>
                        { requirements && requirements.length > 0 &&
                            requirements
                            .filter(req => JSON.parse(auth).adminType.toLowerCase() === 'nlo' 
                                ? req.title === 'EL: Endorsement Letter' 
                                : !['MOA: Memorandum of Agreement','OC: Orientation Certificate', 'LOU: Letter of Undertaking'].includes(req.title))
                            .sort((a, b) => nloRequirements[a.title][3] - nloRequirements[b.title][3])
                            .map((req, index) => {
                                return <li 
                                        key={req.id} 
                                        className={`${(selectedRequirement.id == req.id) ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedRequirement(req)
                                        }}>
                                            {nloRequirements[req.title][0]}
                                    </li>
                            })
                        }
                    </ul>
                </div>
            </>
        );
    }

    useEffect(() => {
        fetchRequirements()
    }, []);
  
    return (
        <div id='nlo-requirements'>
            <div className='wrapper'>

                <div className='nlo-requirements-content'>
                    {requirements && showNloRequirements()}
                </div>

                { selectedRequirement && selectedRequirement.title == "EL: Endorsement Letter" && 
                    (JSON.parse(auth).adminType.toLowerCase() === 'nlo' ? <NloEndorsementLetter requirementId={selectedRequirement.id} /> : <EndorsementLetter requirementId={selectedRequirement.id} />)
                }
                { selectedRequirement && selectedRequirement.title == "OSL: Official Study Load" && 
                    <StudyLoad requirementId={selectedRequirement.id} />
                }
                { selectedRequirement && selectedRequirement.title == "DOU: Deed of Undertaking" && 
                    <DeedOfUndertaking requirementId={selectedRequirement.id} />
                }
                { selectedRequirement && selectedRequirement.title == "CL: Confirmation Letter" && 
                    <ConfirmationLetter requirementId={selectedRequirement.id} />
                }
                { selectedRequirement && selectedRequirement.title == "W: Waiver" && 
                    <Waiver requirementId={selectedRequirement.id} />
                }
                { selectedRequirement && selectedRequirement.title == "COC: Certificate of Completion" && 
                    <CertificateOfCompletion requirementId={selectedRequirement.id} />
                }
            </div>
            
            {/* modals */}
            {/* {(isUploadModalOpen && JSON.parse(auth).verified) && (
                <UploadModal closeModal={closeUploadModal} title={selectedRequirement.title} />
            )}

            {(isStatusModalOpen && JSON.parse(auth).verified) && (
                <StatusModal closeModal={closeStatusModal} />
            )}

            {(showDisableModal && JSON.parse(auth).verified) && (
                <CustomModal show={showDisableModal} onHide={(val) => {setShowDisableModal(val)}}>
                    <p>You need to finish the "Deed of Undertaking" process to proceed</p>
                </CustomModal>
            )} */}
            {/* end modals */}
        </div>
    );
  }