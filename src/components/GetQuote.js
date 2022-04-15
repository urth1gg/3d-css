import React, { useState } from "react";
import axios from "axios";

const styles = {
    redStar: {
        color: 'red'
    }
}
export default function GetQuote(){

    let [isOpen, setOpen ] = useState(false)


    async function sendForm(e){
        e.preventDefault()
        setOpen(false)

        let canv = document.getElementsByTagName("canvas")[0]
        let imgdata = canv.toDataURL("image/png").replace('data:image/png;base64,', "")

        let resp = await axios({
            method: 'POST',
            url:'https://courtsurfacespecialists.com/wp-admin/admin-ajax.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'imgdata=' + imgdata + '&form_wp_nonce=65acf6325a&courtName=Tennis&courtSizeSelected=50’x110’&quote_name=Djordje%20test&quote_email=jevremovicdjordje97@gmail.com&quote_phone=0324242&action=send_quote_court_builder_image'
        })

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
                        <h3>Get quote</h3>
                        <h4>Email your specifications to us for a free quote.</h4>
                        <div><label>Name <span style={styles.redStar}>*</span></label><input type="text" id="name"></input></div>
                        <div><label>Email <span style={styles.redStar}>*</span></label><input type="email" id="email"></input></div>
                        <div><label>Phone <span style={styles.redStar}>*</span></label><input type="text" id="phone"></input></div>
                        <div><label>Postal Code <span style={styles.redStar}>*</span></label><input type="text" id="postalCode"></input></div>
                        <button className="ui-button send-quote-btn" onClick={sendForm}>Send</button>
                    </form>
                </>
            }
        </>    
    )
}