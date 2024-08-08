import React, { useEffect, useState, useRef } from "react"
import "../../public/static/assets/css/main.css";

const Animated = () => {


	let [width1, setWidth1 ] = useState("0%");
	let [width2, setWidth2 ] = useState("0%");
	let [width3, setWidth3 ] = useState("0%");
	let [width4, setWidth4 ] = useState("0%");
	let [width5, setWidth5 ] = useState("0%");

	let [height1, setHeight1 ] = useState("0%");
	let [height2, setHeight2 ] = useState("0%");
	let [height3, setHeight3 ] = useState("0%");
	let [height4, setHeight4 ] = useState("0%");
	let [height5, setHeight5 ] = useState("0%");

	let [goBack, setGoBack] = useState(false)

	function changeColors(width, widthSpec, height, heightSpec){

		setWidth1(width);
		setWidth4(width)
		setTimeout( () => setWidth2(width), 1000)
		setTimeout( () => setWidth3(width), 1000)
		setTimeout( () => setHeight1(height), 1000)
		setTimeout( () => setHeight2(height), 1000)
		setTimeout( () => setHeight3(height), 2000)
		setTimeout( () => setHeight4(heightSpec), 2000)
		setTimeout( () => setHeight5(heightSpec), 2000)
		setTimeout( () => setHeight5(heightSpec), 2000)
		setTimeout( () => setWidth5(widthSpec), 2000)

		setTimeout( () => {
			setGoBack(!goBack)
			console.log(goBack.current)
		}, 3000)
	}
	useEffect( () => {
		console.log(goBack)
		
		if(!goBack){
			changeColors("100%", "53%", "100%", "75%")
		}else{
			changeColors("0%", "0%", "0%", "0%")
		}
	},[goBack])
	
	return(
		<div className="loading-container">
			<div className="animation-parent">
				<div className="horizontal-line anim-pos-1"></div>
				<div className="horizontal-line anim-pos-1 index-1" style={{width: width1}} ></div>
				<div className="horizontal-line anim-pos-2"></div>
				<div className="horizontal-line anim-pos-2 index-2" style={{width: width2}}></div>
				<div className="horizontal-line anim-pos-3"></div>
				<div className="horizontal-line anim-pos-3 index-3" style={{width: width3}}></div>
				<div className="horizontal-line anim-pos-4"></div>
				<div className="horizontal-line anim-pos-4 index-4" style={{width: width4}}></div>
				<div className="horizontal-line-2"></div>
				<div className="horizontal-line-2 index-1" style={{width: width5}}></div>
				<div className="vertical-line anim-pos-vertical-1"></div>
				<div className="vertical-line anim-pos-vertical-1 index-1" style={{height: height1}} ></div>
				<div className="vertical-line anim-pos-vertical-2"></div>
				<div className="vertical-line anim-pos-vertical-2 index-1" style={{height: height2}} ></div>
				<div className="vertical-line anim-pos-vertical-3"></div>
				<div className="vertical-line anim-pos-vertical-3 index-1" style={{height: height3}} ></div>
				<div className="vertical-line-2 anim-pos-vertical-4"></div>
				<div className="vertical-line-2 anim-pos-vertical-4 index-1" style={{height: height4}} ></div>
				<div className="vertical-line-2 anim-pos-vertical-5"></div>
				<div className="vertical-line-2 anim-pos-vertical-5 index-1" style={{height: height5}} ></div>
			</div>
			<p>Loading 3D Court Designer...</p>
		</div>
	)
}

export default Animated;