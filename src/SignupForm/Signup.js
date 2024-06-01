import React, { useState, useEffect } from 'react';
import logo1 from '../icons/logo1.png';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { TextField, Modal, Typography } from '@mui/material';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const SignupForm = () => {
	const [studentID, setStudentID] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phone, setPhone] = useState('');
	const [course, setCourse] = useState('');
	const [courses, setCourses] = useState(null)
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
	const [isErrorModalOpen, setErrorModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [yearSemesters, setYearSemesters] = useState(null)
    const [selectedYearSemester, setSelectedYearSemester] = useState('')
	const navigate = useNavigate();

	useEffect(() => {
		fetchCourses()
		fetchYearSemesters()
	}, []);
	
	const fetchCourses = async () => {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/courses`, {
			method: 'GET',
		});
	
		if (response.ok) {
			try {
				const result = await response.json();
				setCourses(result)
			} catch (error) {
				console.error('Error parsing JSON:', error);
			}
		} else {
			console.error('Fetching of courses failed:', response.status, response.statusText);
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

	const fetchYearSemesters = async () => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/yearSemesters`, {
            method: 'GET',
        })

        if (response.ok) {
            try {
                const result = await response.json();
                setYearSemesters(result)
                console.log("year semesters: ",result)
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
	
	const showCourses = () => {
		if(courses && courses.length > 0)
			return courses.map((course, index) => course.name != "NLO" && <MenuItem key={course.id} value={index}>{course.name}</MenuItem>);
	}

	const showYearSemesters = () => {
		if(yearSemesters && yearSemesters.length > 0)
			return yearSemesters.map((yearSemester, index) => <MenuItem key={yearSemester.id} value={index}>{yearSemester.year} - {yearSemester.semester}</MenuItem>);
	}

	const handleSignup = async () => {
		if (!studentID || !firstName || !lastName || !course || !email || !password) {
				setErrorMessage('Input all fields!');
				setErrorModalOpen(true);
				return;
		}
		if (password !== confirmPassword) {
			setErrorMessage("Password and Confirm Password don't match");
			setErrorModalOpen(true);
			return;
		}

		const formData = new FormData();
		formData.append('studentID', studentID);
		formData.append('firstName', firstName);
		formData.append('lastName', lastName);
		formData.append('phone', phone);
		formData.append('course_id', course.id);
		formData.append('email', email);
		formData.append('password', password);
		formData.append('ysId', selectedYearSemester.id);

		try {
			const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				console.log('User created successfully');
				setSuccessModalOpen(true);

			} else {
				const errorResponse = await response.text();
				setErrorMessage(errorResponse);
				setErrorModalOpen(true);
			}
		} catch (error) {
			console.error('Error during signup:', error);
			setErrorModalOpen(true);
		}
		};

		const handleCloseModal = () => {
			setSuccessModalOpen(false);
			navigate('/');

			
		};
		const handleCloseErrorModal = () => {
			setErrorModalOpen(false);
			
		};
		return (
			<div className= "App">

				<div className= "signup-container1">
					<div className='left-side'>
						<div className= "form">
							<div className='input'>
								<figure className='cit-logo'><img src="/images/cit_logo.png" /></figure>
								<h2>Signup</h2>
						
								<div className='input'>
									<TextField htmlFor="studentID" label="Student ID" variant="outlined"
								
										type="text"
										id="studentID"
										value={studentID}
										onChange={(e) => setStudentID(e.target.value)}
										style={{ width: '100%', height: '100%'}}>
									</TextField>
								</div>
	
	
								<div className='input'> 
									<TextField htmlFor="firstName" label="Firstname" variant="outlined"         
										type="text"
										id="firstName"
										value={firstName}
										onChange={(e) => setFirstName(e.target.value)}
										style={{ width: '100%', height: '100%'}}>
									</TextField>
								</div>
	
	
								<div className='input'> 
									<TextField htmlFor="lastName" label="Lastname" variant="outlined"      
										type="text"
										id="lastName"
										value={lastName}
										onChange={(e) => setLastName(e.target.value)}
										style={{ width: '100%', height: '100%'}}>         
									</TextField>
								</div>
	
								<div className='input'> 
									<TextField htmlFor="phone" label="Phone" variant="outlined"      
										type="text"
										id="phone"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										style={{ width: '100%', height: '100%'}}>         
									</TextField>
								</div>
							
								<div className='input'>
									<FormControl fullWidth>
										<InputLabel id="course-label">Course</InputLabel>
										<Select
										labelId="course-label"
										id="course"
										value={course.name}
										onChange={(e) => setCourse(courses[e.target.value])}
										>
										{showCourses()}
										</Select>
									</FormControl>
								</div>

								<div className='input'>
									<FormControl fullWidth>
										<InputLabel id="year-semester-label">Year & Semester</InputLabel>
										<Select
										labelId="year-semester-label"
										id="course"
										value={selectedYearSemester.id}
										onChange={(e) => setSelectedYearSemester(yearSemesters[e.target.value])}
										>
										{showYearSemesters()}
										</Select>
									</FormControl>
								</div>
	
								<div className='input'>
									<TextField htmlFor="email" label="Email" variant="outlined" 
										type="email"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										style={{ width: '100%', height: '100%'}}>
									</TextField>
								</div>
	
								<div className='input'>
									<TextField htmlFor="password" label="Password" variant="outlined"
										type="password"
										id="password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										style={{ width: '100%', height: '100%'}}>
									</TextField>
								</div>
								<div className='input'>
									<TextField
									htmlFor='confirmPassword'
									label='Confirm Password'
									variant='outlined'
									type='password'
									id='confirmPassword'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									style={{ width: '100%', height: '100%' }}
									/>
								</div> 
								<div className='input'>
									<h3 className='login-text'>Already have an account? <Link to="/">Login</Link></h3>
									<button className='login-button' onClick={handleSignup}>Signup</button>
								</div>
	
							</div>
						</div>
					</div>
					<div className= "right-side">
						<figure className='login-logo'><img src="/images/logo.png" /></figure>
					</div>
				</div>
				<Modal
					open={isSuccessModalOpen}
					onClose={handleCloseModal}
					aria-labelledby="user-created-modal-title"
					aria-describedby="user-created-modal-description"
				>
					<div className="modal-paper">
					<Typography variant="h6" id="user-created-modal-title">
						User Created Successfully!
					</Typography>
					<Typography id="user-created-modal-description">
						Congratulations! Your account has been successfully created.
					</Typography>
					<Button variant="contained" onClick={handleCloseModal}>
						Close
					</Button>
					</div>
				</Modal>
				<Modal
					open={isErrorModalOpen}
					onClose={handleCloseErrorModal}
					aria-labelledby="error-modal-title"
					aria-describedby="error-modal-description"
					>
					<div className="modal-paper">
						<Typography variant="h6" id="error-modal-title">
						Error
						</Typography>
						<Typography id="error-modal-description">
						{errorMessage || 'An error occurred during signup.'}
						</Typography>
						<Button variant="contained" onClick={handleCloseErrorModal}>
						Close
						</Button>
					</div>
				</Modal>  
			</div>
		);

		
};

export default SignupForm;
