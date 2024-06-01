import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';
import Cookies from 'js-cookie';

export default function Profile() {
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [isEditingCompany, setIsEditingComppany] = useState(false)
    const [profile, setProfile] = useState(null)
    const [isReadOnly, setIsReadOnly] = useState(true)
    const auth = JSON.parse(localStorage.getItem('auth'));
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const editProfileHandler = async (section = 'profile') => {
        if(isEditingProfile || isEditingCompany) {
            const formData = new FormData();
            formData.append('studentID', profile.studentID);
            formData.append('firstName', profile.firstName);
            formData.append('lastName', profile.lastName);
            formData.append('companyName', profile.companyName);
            formData.append('companyAddress', profile.companyAddress);
            formData.append('contactPerson', profile.contactPerson);
            formData.append('designation', profile.designation);
            if (profile.dateStarted != null)
                formData.append('dateStarted', profile.dateStarted);
            formData.append('phone', profile.phone);
            formData.append('course_id', profile.course.id);
            formData.append('email', profile.email);

            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update/${profile.studentID}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (response.ok) {
                    auth.firstName = profile.firstName
                    auth.lastName = profile.lastName
                    auth.companyName = profile.companyName
                    auth.companyAddress = profile.companyAddress
                    auth.contactPerson = profile.contactPerson
                    auth.designation = profile.designation
                    auth.dateStarted = profile.dateStarted
                    auth.phone = profile.phone
                    auth.email = profile.email
                    auth.course = profile.course
                    localStorage.setItem('auth', JSON.stringify(auth));
                    console.log('User updated successfully');

                } else {
                    console.log("Error updating user")
                }
            } catch (error) {
                console.error('Error during user update:', error);
            }
        }
        if(section == 'profile')
            setIsEditingProfile(!isEditingProfile)
        else if(section == 'company')
            setIsEditingComppany(!isEditingCompany)
    }

    const formatDate = (dateData) => {
        const date = new Date(dateData);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading zero if needed
        const day = ('0' + date.getDate()).slice(-2); // Add leading zero if needed
        return `${year}-${month}-${day}`;
    }

    const fetchUser = async (userId) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/userByID/${userId}`, {
            method: 'GET',
        })
        if (response && response.ok) {
            try {
                const result = await response.json();
                setProfile(result)
				console.log("user profile: ",result)
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

    useEffect(() => {
        const userId = searchParams.get('userid')
        if(userId) {
            fetchUser(userId)
        }
        else {
            setIsReadOnly(false)
            setProfile({
                userid          : auth.userid,
                studentID       : auth.studentID,
                firstName       : auth.firstName,
                lastName        : auth.lastName,
                companyName     : auth.companyName,
                companyAddress  : auth.companyAddress,
                contactPerson   : auth.contactPerson,
                designation     : auth.designation,
                dateStarted     : auth.dateStarted ? formatDate(auth.dateStarted) : null,
                email           : auth.email,
                phone           : auth.phone,
                course          : auth.course,
                verified        : auth.verified,
            })
        }
        
    },[])

    return (
        <div id='profile'>
            <div className='wrapper'>
                { isReadOnly &&
                <a className='back' onClick={() => {window.history.back()}}><img src="/icons/back.png" /></a>
                }
                <div className='profile-con'>
                    <div className='profile-top'>
                        <section className='profile-top-left'>
                            <figure><img src='/images/profile_placeholder.png' /></figure>
                            <h2>{profile?.firstName} {profile?.lastName}</h2>
                            <p>{auth?.course?.name}</p>
                            <p>{profile?.phone}</p>
                        </section>
                        <section className='profile-top-right'>
                            <div className='profile-field-con'>
                                <div className='profile-field'>
                                    {!isEditingProfile ?
                                        <>
                                            <label>Full Name</label>
                                            <input 
                                                disabled
                                                value={profile?.firstName+' '+profile?.lastName}
                                            />
                                        </>
                                        : <>
                                           <div style={{ display: 'flex', height:"100%", alignItems: "center" }}>
                                                <label style={{ width: '344px' }}>First Name</label>
                                                <input 
                                                    value={profile?.firstName}
                                                    onChange={(e) => {
                                                        setProfile(prevProfile => ({
                                                            ...prevProfile,
                                                            firstName: e.target.value
                                                        }));
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', height:"100%", alignItems: "center" }}>
                                                <label style={{ width: '344px' }}>Last Name</label>
                                                <input 
                                                    value={profile?.lastName}
                                                    onChange={(e) => {
                                                        setProfile(prevProfile => ({
                                                            ...prevProfile,
                                                            lastName: e.target.value
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className='profile-field'>
                                    <label>Email</label>
                                    <input 
                                        disabled={!isEditingProfile}
                                        value={profile?.email} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                email: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Phone</label>
                                    <input 
                                        disabled={!isEditingProfile}
                                        value={profile?.phone} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                phone: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Course</label>
                                    <input disabled value={profile?.course.name} />
                                </div>
                            </div>
                            { !isReadOnly &&
                            <button onClick={() => editProfileHandler('profile')}>{isEditingProfile ? 'Save' : 'Edit'}</button>
                            }
                        </section>
                    </div>
                    <div className='profile-btm'>
                        <section>
                            <div className='profile-btm-header'>
                                <h2>COMPANY DETAILS</h2>
                                { !isReadOnly &&
                                <button onClick={() => editProfileHandler('company')}>{isEditingCompany ? 'Save' : 'Edit'}</button>
                                }
                            </div>
                            <div className='profile-btm-body'>
                                <div className='profile-field'>
                                    <label>Company Name</label>
                                    <input 
                                        disabled={!isEditingCompany}
                                        value={profile?.companyName} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                companyName: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Company Address</label>
                                    <input 
                                        disabled={!isEditingCompany}
                                        value={profile?.companyAddress} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                companyAddress: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Name of Contact Person</label>
                                    <input 
                                        disabled={!isEditingCompany}
                                        value={profile?.contactPerson} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                contactPerson: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Designation</label>
                                    <input 
                                        disabled={!isEditingCompany}
                                        value={profile?.designation} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                designation: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className='profile-field'>
                                    <label>Date Started</label>
                                    <input 
                                        type='date'
                                        disabled={!isEditingCompany}
                                        value={profile?.dateStarted} 
                                        onChange={(e) => {
                                            setProfile(prevProfile => ({
                                                ...prevProfile,
                                                dateStarted: e.target.value
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
  }