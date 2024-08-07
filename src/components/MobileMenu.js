import React, { useState, useEffect } from "react";

export default function MobileMenu(){
    

    function onClickLeft(){
        document.querySelector(".left-menu").style.display = 'initial'
    }

    function onClickRight(){
        document.querySelector(".right-menu").style.display = 'initial'
    }

    return(
        <>
            <div className="left-menu-show" onClick={onClickLeft}>
                <i className="fas fa-angle-double-right"></i>
            </div>


            <div className="right-menu-show" onClick={onClickRight}>
                <i className="fas fa-angle-double-left"></i>
            </div>
        </>
    )
}