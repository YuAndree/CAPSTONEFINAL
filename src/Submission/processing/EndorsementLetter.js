import React, { useState, useEffect } from 'react';
import './styles.css';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { Document as ViewerDocument, Page as ViewerPage, pdfjs } from 'react-pdf';
import { Page, Text, View, Document, StyleSheet, PDFViewer, Image, pdf  } from '@react-pdf/renderer';

export default function EndorsementLetter({onGenerate, document, onDocChange}) {

    const auth = JSON.parse(localStorage.getItem('auth'));
    const [degree, setDegree] = useState('');
    const [salutation, setSalutation] = useState('Mr.');
    const [salutation2, setSalutation2] = useState('Mr.');
    const [firstName, setFirstName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [lastName, setLastName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [designation, setDesignation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyAddress, setCompanyAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [step, setStep] = useState(1)
    const [checkInfo, setCheckInfo] = useState (null)

    const [subjectCode, setSubjectCode] = useState (null)
    const [ojtHours, setOjtHours] = useState (null)
    const [ojtTrainingEnv, setOjtTrainingEnv] = useState ('Virtual')
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = {
            degree,
            salutation,
            firstName,
            middleInitial,
            lastName,
            contactPerson,
            designation,
            companyName,
            companyAddress,
            contactNumber,
        };
        console.log(formData);
        setStep(2)
        sendPDFToBackend()
        onDocChange({
            ...document,
            step : 2
        })
    };

    const step1 = () => {
        return <>
            <form onSubmit={handleSubmit}>
                <h1>ENDORSEMENT LETTER REQUEST</h1>
                <ol>
                    <li>
                        <h4>Degree Program (ex. BS in Information Technology)</h4>
                        <input
                            placeholder='Enter your answer'
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                        />
                    </li>
                    <li>
                        <h4>Subject Code (ex. IT412)</h4>
                        <input
                            placeholder='Enter your answer'
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                        />
                    </li>
                    <li>
                        <h4>OJT Hours to Render </h4>
                        <input
                            placeholder='Enter your answer'
                            value={ojtHours}
                            onChange={(e) => setOjtHours(e.target.value)}
                        />
                    </li>
                    <li>
                        <h4>OJT Training Environment</h4>
                        <label htmlFor="salutation-mr">
                        Virtual
                        <input
                            type='radio'
                            value="Virtual"
                            name='ojtTrainingEnv'
                            id='ojtTrainingEnv1'
                            checked={ojtTrainingEnv === 'Virtual'}
                            onChange={(e) => setOjtTrainingEnv(e.target.value)}
                        />
                        </label>
                        <label htmlFor="salutation-mrs">
                        Face to Face
                        <input
                            type='radio'
                            value="Face to Face"
                            name='ojtTrainingEnv'
                            id='ojtTrainingEnv2'
                            checked={ojtTrainingEnv === 'Face to Face'}
                            onChange={(e) => setOjtTrainingEnv(e.target.value)}
                        />
                        </label>
                    </li>
                </ol>
                <div>
                    <h2>Student Details</h2>

                    <ol>
                        <li>
                            <h4>Salutation</h4>
                            <label htmlFor="salutation-mr">
                            Mr. 
                            <input
                                type='radio'
                                value="Mr."
                                name='salutation'
                                id='salutation-mr'
                                checked={salutation === 'Mr.'}
                                onChange={(e) => setSalutation(e.target.value)}
                            />
                            </label>
                            <label htmlFor="salutation-mrs">
                            Mrs.
                            <input
                                type='radio'
                                value="Mrs."
                                name='salutation'
                                id='salutation-mrs'
                                checked={salutation === 'Mrs.'}
                                onChange={(e) => setSalutation(e.target.value)}
                            />
                            </label>
                        </li>
    
                        <li>
                            <h4>First Name (ex. Patrick)</h4>
                            <input
                            placeholder='Enter your answer'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            />
                        </li>
    
                        <li>
                            <h4>Middle Initial (ex. L.)</h4>
                            <input
                            placeholder='Enter your answer'
                            value={middleInitial}
                            onChange={(e) => setMiddleInitial(e.target.value)}
                            />
                        </li>
    
                        <li>
                            <h4>Last Name (ex. Bacalso)</h4>
                            <input
                            placeholder='Enter your answer'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            />
                        </li>
                    </ol>
                </div>

                <div>
                    <h2>Company Details</h2>

                    <ol>
                        <li>
                            <h4>Salutation</h4>
                            <label htmlFor="salutation-mr">
                            Mr.
                            <input
                                type='radio'
                                value="Mr."
                                name='salutation2'
                                id='salutation2-mr'
                                checked={salutation2 === 'Mr.'}
                                onChange={(e) => setSalutation2(e.target.value)}
                            />
                            </label>
                            <label htmlFor="salutation-mrs">
                            Mrs.
                            <input
                                type='radio'
                                value="Mrs."
                                name='salutation2'
                                id='salutation2-mrs'
                                checked={salutation2 === 'Mrs.'}
                                onChange={(e) => setSalutation2(e.target.value)}
                            />
                            </label>
                        </li>

                        <li>
                            <h4>Name of Contact Person (ex. Consuelo R. Migallos)</h4>
                            <input
                            placeholder='Enter your answer'
                            value={contactPerson}
                            onChange={(e) => setContactPerson(e.target.value)}
                            />
                        </li>
    
                        <li>
                            <h4>Designation (ex. HR Director)</h4>
                            <input
                            placeholder='Enter your answer'
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            />
                        </li>
    
                        <li>
                            <h4>Company Name (ex. Cebu Institute of Technology - University)</h4>
                            <input
                            placeholder='Enter your answer'
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </li>
    
                        <li>
                            <h4>Company Address (ex. N. Bacalso Avenue Cebu City 6000 Philippines)</h4>
                            <input
                            placeholder='Enter your answer'
                            value={companyAddress}
                            onChange={(e) => setCompanyAddress(e.target.value)}
                            />
                        </li>
    
                        {/* <li>
                            <h4>Contact Number (ex 032 - 411 2000 loc 110)</h4>
                            <input
                            placeholder='Enter your answer'
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </li> */}
                    </ol>

                    <p>Please review your answers before submitting</p>
                    <button type='submit' className='btn-yellow step-submit'>Submit</button>
                </div>
            </form>
        </>
    }

    const step2 = () => {
        return <div className='faculty-approval'>
            <img src='/icons/work-in-progress.png' />
            <p>Your Document is still on review.</p>
            <p>Please wait for the faculty to make` your document</p>
        </div>
    }

    const step3 = () => {
        return <div className='faculty-approval'>
            <img src='/icons/work-in-progress.png' />
            <p>Your Document is reviewed by the NLO department.</p>
            <p>Please wait for the NLO to Approve your document.</p>
        </div>
    }

    const showDocument = () => {
        return (
        <div className='document-con'>
            <div className='document-info'>
                <div className='header'>
                    <h4>{checkInfo.submittedBy.firstName} {checkInfo.submittedBy.lastName}</h4>
                    <div className='actions'>
                        <a href={`${process.env.REACT_APP_API_URL}/file/download/${checkInfo.id}`}>Download</a>
                    </div>
                </div>
                {checkInfo.extName == "pdf" 
                    ?   <ViewerDocument file={`${process.env.REACT_APP_API_URL}/file/download/${checkInfo.id}`} >
                            <ViewerPage pageNumber={1} />
                        </ViewerDocument>
                    :   <figure><img src={`${process.env.REACT_APP_API_URL}/file/download/${checkInfo.id}`} /></figure>
                }
            </div>
        </div>
        )
    }

    const getCurrentDate = () => {
        const currentDate = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return currentDate.toLocaleDateString('en-US', options);
      }

      // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: '20 50',
            fontSize: '13px'
        },
        section: {
            margin: 10,
            padding: 10,
            flexGrow: 1
        },
        paragraph: {
            marginBottom: '20px'
        },
        logo: {
            width: "70%",
            margin:"0 auto"
        },
        sign: {
            // borderTop: "2px solid #000",
            marginTop:"30px",
            display: "inline-block",
        },
        address: {
            marginTop:"30px",
            fontSize: "8px",
            textAlign: "center"
        }
    });

    const MyDocument = () => (
        <Document pageMode='fullScreen' title='mypdf.pdf'>
          <Page size="A4" style={styles.page}>
            <View style={styles.paragraph}>
                <Image style={styles.logo} src='/images/cit_logo.png' />
                <Text style={{textAlign:'center'}}>{degree}</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>{getCurrentDate()}</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>{salutation2} {contactPerson}</Text>
                <Text>{designation}</Text>
                <Text>{companyName}</Text>
                <Text>{companyAddress}</Text>
            </View>
            <View style={styles.paragraph}>
                <Text>Dear {salutation2} {contactPerson},</Text>
            </View>
            <View>
                <View style={{textAlign: 'justify'}}>
                    <Text style={styles.paragraph}>
                        In connection with the prescribed curriculum for the {degree} program in
                        Cebu Institute of Technology-University, we would like to request your office to accommodate
                        our student, {salutation} {firstName} {middleInitial}. {lastName} to undergo the required {ojtHours} hours (minimum) of On-the-Job 
                        Training for the subject/course {subjectCode}, which will be taken this {numberToOrdinal(auth.yearSemesterSemester)} Semester S.Y. {auth.yearSemesterYear} on a Virtual training environment.
                    </Text>

                    <Text style={styles.paragraph}>
                        Attached is information about the OJT Program, which includes among others, our requested areas of training and the training requirements we impose on our students.
                    </Text>

                    <Text>If our request is favorably granted, {salutation} {lastName}, can start anytime this month. Furthermore, we</Text>

                    <Text style={styles.paragraph}>
                        would like to request you to accomplish and return the attached confirmation letter to us in pdf, through email: nlof@citedu; cc: cstaromana@citedu, cheryl.pantaleon@citedu and patrick _bacalso@cit.edu for proper documentation.
                    </Text>
                </View>

                <Text style={styles.paragraph}>Thank you very much.</Text>

                <Text style={styles.paragraph}>Very truly yours,</Text>
            </View>
            <View style={[styles.paragraph, styles.sign]}>
                <Text>Cheryl B. Pantaleon</Text>
                <Text>Chair, IT Department</Text>
            </View>
            <View style={[styles.paragraph, styles.sign]}>
                <Text>Cherry Lyn C. Sta. Romana</Text>
                <Text>Dean, College of Computer Studies</Text>
            </View>
            <View style={styles.address}>
                <Text>A. Bacalso Avenue, Cebu City G10, Philippines</Text>
                <Text>Tel. No. 201.7741, Faxbel No. 261-7743</Text>
                <Text>www.cit.edu</Text>
            </View>
          </Page>
        </Document>
      );


    const sendPDFToBackend = async () => {
        const blob = await pdf(<MyDocument />).toBlob();
        if(onGenerate)
            onGenerate(blob)
    };

    const showSteps = () => {
        return <div className='steps'>
            <ul>
                <li className={step == 1 && 'active'}>Step 1 <span>Document Filing</span></li>
                <li className={step == 2 && 'active'}>Step 2 <span>Faculty Approval</span></li>
                <li className={step == 3 && 'active'}>Step 3 <span>NLO Approval</span></li>
                <li className={step == 4 && 'active'}>Step 4 <span>Download</span></li>
            </ul>
        </div>
    }

    const numberToOrdinal = (number) => {
        const ordinals = ["", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];
      
        const num = parseInt(number, 10);

        if (num > 0 && num < ordinals.length) {
          return ordinals[num];
        } else {
          return number;
        }
    };

    useEffect(() => {
        if(document)
            setStep(document.step || 1)
        setCheckInfo(document)
    }, []);
  
    return (
        <div id='endorsement-letter'>
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

                showDocument()
                // <PDFViewer className="pdf-viewer"   >
                //     <MyDocument />
                // </PDFViewer>
            }
        </div>
    );
  }