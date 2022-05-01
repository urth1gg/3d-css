import React, { useState, useRef } from "react";
import axios from "axios";
import { Plane, BallTriangle } from "react-loader-spinner";

const styles = {
    redStar: {
        color: 'red'
    },
    closeButton: { 
        position: 'absolute',
        right:'5px',
        top: '5px',
        width:'25px',
        height:'25px',
        letterSpacing: 'unset',
        borderRadius: '5px',
        color: "#00669B",
        background: 'white',
        cursor: 'pointer',
        border: 'unset',
        fontSize:'20px'
    },
    errorMsg:{
        color:'red',
        marginTop:'-15px'
    },
    overlay: {
        position:'absolute',
        top:'0',
        left:'0',
        height:'100%',
        width:'100%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        background:'rgba(255,255,255,.9)',
        flexDirection: 'column'
    },
    header:{
        color:'#00669B',
        fontSize:'25px',
        letterSpacing: '.25em',
        animation: 'flash linear 1.75s infinite',
    }
}

export default function GetQuote({courtName}){

    let [isOpen, setOpen ] = useState(false)


    let name = useRef(null);
    let email = useRef(null);
    let postalCode = useRef(null);
    let phone = useRef(null);

    let [ errorMessages, setErrorMessages ] = useState([])
    let [ isLoading, setIsLoading ] = useState(false)

    function returnEmptyValues(name, email, postalCode, phone){
        let emptyValues = [];

        if(name.trim() === '') emptyValues.push('name');
        if(email.trim() === '') emptyValues.push('email')
        if(postalCode.trim() === '') emptyValues.push('postalCode')
        if(phone.trim() === '') emptyValues.push('phone')

        return emptyValues
    }

    async function sendForm(e){
        e.preventDefault()
        
        let emptyValues = returnEmptyValues(name.current.value, email.current.value, postalCode.current.value, phone.current.value);
        setErrorMessages([...emptyValues])
        if(emptyValues.length !== 0){
            return false;
        }


        let canv = document.getElementsByTagName("canvas")[0]
        let imgdata = canv.toDataURL("image/png").replace('data:image/png;base64,', "")

        setIsLoading(true)

        let resp = await axios({
            method: 'POST',
            url:'https://courtsurfacespecialists.com/wp-admin/admin-ajax.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'imgdata=' + imgdata + '&form_wp_nonce=65acf6325a&courtName=' + courtName + '&courtSizeSelected=50’x110’&quote_name=Djordje%20test&quote_email=jevremovicdjordje97@gmail.com&quote_phone=0324242&action=send_quote_court_builder_image'
        })

        setOpen(false)
        setIsLoading(false)

        return false
    }
    return(
        <>
            {isOpen && <div className="overlay"></div> } 

            <div className="ui-actions">
                <button className="ui-button" title="Get an offer from us quickly!" onClick={() => setOpen(!isOpen)}>
                    Get Quote <i class="fas fa-edit"></i>
                </button>
            </div>

            {isOpen && 
                <>
                    <form className="form-quote">
                        {isLoading && <div style={styles.overlay}><h4 style={styles.header}>Sending email</h4><Plane color="#00669B" secondaryColor="#00669B"/></div>}
                        <button style={styles.closeButton} onClick={() => setOpen(false)}><i className="fas fa-times"></i></button>
                        <h3>Get quote</h3>
                        <h4>Email your specifications to us for a free quote.</h4>
                        <div><label>Name <span style={styles.redStar}>*</span></label><input ref={name} type="text" id="name"></input></div>
                        {errorMessages.includes('name') && <div><span style={styles.errorMsg}>Cannot be empty</span></div>}
                        <div><label>Email <span style={styles.redStar}>*</span></label><input ref={email} type="email" id="email"></input></div>
                        {errorMessages.includes('email') && <div><span style={styles.errorMsg}>Cannot be empty</span></div>}
                        <div><label>Phone <span style={styles.redStar}>*</span></label><input ref={phone} type="text" id="phone"></input></div>
                        {errorMessages.includes('phone') && <div><span style={styles.errorMsg}>Cannot be empty</span></div>}
                        <div><label>Postal Code <span style={styles.redStar}>*</span></label><input ref={postalCode} type="text" id="postalCode"></input></div>
                        {errorMessages.includes('postalCode') && <div><span style={styles.errorMsg}>Cannot be empty</span></div>}
                        <button className="ui-button send-quote-btn" onClick={sendForm}>Send</button>
                    </form>
                </>
            }
        </>    
    )
}