import React from 'react';
import './styles.css'
import Programs from '../Programs'

const HomePage = () => {

	return (
	
		<div id='homepage'>
			<div className='wrapper'>
				<h1>Dashboard</h1>
				<Programs/>
			</div>
		</div>
	
	);
}


export default HomePage;

