import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from './icons/logo1.png';

const SplashScreen = () => {
  return (
    <div style={styles.container}>
          <img style={styles.logo} src={logo1} alt="Logo" />

      <h1 style={styles.welcomeText}>Welcome!</h1>
      <Link to="/adminloginform" style={styles.button}>
        Login as Admin
      </Link>
      <Link to="/login" style={styles.button}>
        Login as User
      </Link>
    </div>
  );
};

const styles = {
    
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  logo: {
    width: 500,
    height: 400,
    
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'red',
    color: 'white',
    padding: '10px 20px',
    borderRadius: 10,
    marginBottom: 10,
    textDecoration: 'none',
  },

  
};

export default SplashScreen;
