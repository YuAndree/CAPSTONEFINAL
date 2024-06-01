import React, { useState } from 'react';
import './styles.css';

const Modal = ({ show, children, onHide }) => {
    const [isVisible, setIsVisible] = useState(show);

    // Function to handle closing the modal
    const handleCloseModal = () => {
        setIsVisible(false);
        onHide && onHide(false); // Notify the parent that the modal is now hidden
    };

    return (
        <div className={`custom-modal ${isVisible ? 'show' : 'hide'}`}>
            <div className='overlay' onClick={handleCloseModal}></div>
            <div className='body'>
                {children}
            </div>
        </div>
    );
};

export default Modal;
