import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './LoginForm/Login';
import Signup from './SignupForm/Signup';
import HomePage from './HomeForm/HomePage';
import AdminLoginForm from './AdminLoginForm/AdminLoginForm';
import AdminSignupForm from './AdminSignupForm/AdminSignup';
import SplashScreen from './SplashScreen'; // Import the SplashScreen component
import Templates from './Templates';
import Navbar from './NavBar/Navbar';
import Submission from './Submission';
import NloSubmission from './Submission/nlo'
import AdminHomepage from './Admin/Homepage';
import AdminSubmission from './Admin/Submission';
import AdminNloRequirements from './Admin/Requirements/nlo'
import Validate from './Admin/Validate'
import Requirements from './Admin/Requirements'
import NLORequirements from './Admin/Requirements/nlo-records'
import ViewNLORequirements from './Admin/Requirements/view'
import Students from './Admin/Students';
import AddStudent from './Admin/Students/Add';
import DeleteStudent from './Admin/Students/Delete';
import StudentDocuments from './Admin/Students/Documents';
import Dashboard from './Admin/Dashboard';
import NloDashboard from './Admin/Dashboard/nlo';
import Profile from './Profile';
import YearSemester from './Admin/YearSemester';
import StudentRecords from './Records';
import './App.css';

function App() {
	const currentPath = window.location.pathname;
	const auth = localStorage.getItem('auth');

	// Check if the current path is "/signup" or "/login"
	const isSignupOrLogin = currentPath === '/signup' || currentPath === '/login' || currentPath === '/' || currentPath === '' || currentPath === '/admin';

	// Conditionally render the Nav component
	const renderNav = () => {
		if (!isSignupOrLogin && auth && (currentPath != '/' && currentPath != '/admin/' &&  currentPath != '/admin/')) {
			return <Navbar />;
		}
		return null;
	};

	return (
		<div id='main-content' className={renderNav() && 'with-nav'}>
			<Router>
				{renderNav()}
				<Routes>
					<Route path="/" element={<Login />} /> 
					<Route path="/login" element={<Login />} />
					<Route path= "/admin" element={<AdminLoginForm/>} />
					<Route path="/signup" element={<Signup />} />
					<Route path= "/adminsignupform" element={<AdminSignupForm/>} />
					{ auth &&(
					<>
						<Route path="/homepage" element={<HomePage />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/templates" element={<Templates/>} />
						<Route path="/submission" element={<Submission/>} />
						<Route path='/submission/nlo' element={<NloSubmission/>} />
						{/* <Route path="/admin/homepage" element={<AdminHomepage />} /> */}
						<Route path="/admin/submission" element={<AdminSubmission />} />
						<Route path="/admin/validate" element={<Validate />} />
						{ (JSON.parse(auth).adminType && JSON.parse(auth).adminType.toLowerCase() == 'nlo')
							? <>
								<Route path="/admin/requirements" element={<NLORequirements />} />
								<Route path="/admin/requirements/view" element={<ViewNLORequirements />} />
								<Route path="/admin/homepage" element={<NloDashboard />} />
							  </>
							: <>
								<Route path="/admin/requirements" element={<Requirements />} />
								<Route path="/admin/requirements/view" element={<ViewNLORequirements />} />
								<Route path="/admin/homepage" element={<Dashboard />} />
							  </>
						}
						<Route path="/admin/students" element={<Students />} />
						<Route path="/admin/students/add" element={<AddStudent />} />
						<Route path="/admin/students/delete" element={<DeleteStudent />} />
						<Route path="/admin/student/documents" element={<StudentDocuments />} />
						<Route path="/admin/yearSemester" element={<YearSemester />} />
						<Route path="/admin/requirements/nlo" element={<AdminNloRequirements />} />
						<Route path="/records" element={<StudentRecords />} />
					</>
					)
					}
	
				</Routes>
			</Router>
		</div>
	);
}

export default App;

