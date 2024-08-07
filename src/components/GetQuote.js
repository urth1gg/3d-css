import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Plane, BallTriangle } from "react-loader-spinner";

const styles = {
    redStar: {
        color: 'red'
    },
    closeButton: {
        position: 'absolute',
        right: '5px',
        top: '5px',
        width: '25px',
        height: '25px',
        letterSpacing: 'unset',
        borderRadius: '5px',
        color: "#00669B",
        background: 'white',
        cursor: 'pointer',
        border: 'unset',
        fontSize: '20px',
        zIndex: '101'
    },
    errorMsg: {
        color: 'red',
        marginTop: '-15px'
    },
    overlay: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255,255,255,.9)',
        flexDirection: 'column'
    },
    header: {
        color: '#00669B',
        fontSize: '25px',
        letterSpacing: '.25em',
        animation: 'flash linear 1.75s infinite',
    },
    emailSent: {
        color: '#617959',
        fontSize: '25px',
        marginTop: '10px',
        background: '#daf1d5',
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '15',
        padding:'1rem'
    }
}

export default function GetQuote({ courtName }) {

    let [isOpen, setOpen] = useState(false);
    let [emailSent, setEmailSent] = useState(false);

    let [errorMessages, setErrorMessages] = useState([])
    let [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        // Load HubSpot script
        if (!window.hbspt) {
            const script = document.createElement('script');
            script.src = '//js.hsforms.net/forms/embed/v2.js';
            script.async = true;
            document.body.appendChild(script);
        }

        // Set up event listener for form submission
        const handleMessage = (event) => {
            if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormSubmitted') {
                // someAnalyticsLib('formSubmitted'); // Uncomment and replace with your analytics call
                console.log(`Form Submitted! Event data:`, event.data);
                setEmailSent(true); // Show the "Email sent!" message

                // Close the form after 3 seconds
                setTimeout(() => {
                    setOpen(false);
                    setEmailSent(false);
                }, 3000);
            }
        };

        window.addEventListener('message', handleMessage);

        // Cleanup function
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    useEffect(() => {
        if (!isOpen || !window.hbspt) return;

        window.hbspt.forms.create({
            region: "na1",
            portalId: "8909419",
            formId: "996ec1b1-6aad-491f-9d42-257f96973fd6",
            target: "#hubspotForm"
        });

        return () => {
            const formContainer = document.getElementById('hubspotForm');
            if (formContainer) {
                formContainer.innerHTML = '';
            }
        };
    }, [isOpen]);

    return (
        <>
            {emailSent && <div style={styles.emailSent}>Email sent!</div>}
            {isOpen && <div className="overlay"></div>}

            <div className="ui-actions">
                <button className="ui-button" title="Get an offer from us quickly!" onClick={() => setOpen(!isOpen)}>
                    Get Quote <i className="fas fa-edit"></i>
                </button>
            </div>

            {isOpen &&
                <div className="form-quote">
                    <button style={styles.closeButton} onClick={() => setOpen(false)}><i className="fas fa-times"></i></button>

                    <form className="form-quote" id="hubspotForm">
                    </form>
                </div>
            }
        </>
    )
}