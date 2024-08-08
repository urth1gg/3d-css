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

	let timeOut = useRef(null)
	let timeOut1 = useRef(null)
	let timeOut2 = useRef(null)
	let timeOut3 = useRef(null)
	let timeOut4 = useRef(null)
	let timeOut5 = useRef(null)
	let timeOut6 = useRef(null)
	let timeOut7 = useRef(null)
	let timeOut8 = useRef(null)

	function changeColors(width, widthSpec, height, heightSpec){

		setWidth1(width);
		setWidth4(width)
		timeOut.current = setTimeout( () => {
			setWidth2(width);
			setWidth3(width);
			setHeight1(height);
			setHeight2(height);
		}, 1000)


		timeOut1.current = setTimeout( () => {
			setHeight3(height)
			setHeight4(heightSpec)
			setHeight5(heightSpec)
			setHeight5(heightSpec)
			setWidth5(widthSpec)
		}, 2000)
	}

	useEffect( () => {
		if(!goBack){
			changeColors("100%", "53%", "100%", "75%")
		}else{
			changeColors("0%", "0%", "0%", "0%")
		}

		setTimeout( () => {
			if(!document.querySelector(".loading-container")) return;
			setGoBack( () => !goBack)
		}, 3000)
	},[goBack])

	useEffect( () => {
		return () => {
			console.log('unmounted')
			clearTimeout(timeOut.current)
			clearTimeout(timeOut1.current)
		}
	}, [])
	return(
		<div className="loading-container">
			<div>
				<img src="//images.squarespace-cdn.com/content/v1/6643bd23b8f7dc12ccdd9c1b/1d1e2613-9914-425f-aa65-025066064937/CSS+Logo+Full.png?format=1500w" width="100" style={{filter:'unset'}} />
				<img style={{marginLeft:'15px', filter: 'unset'}} src="//i.ibb.co/1Xjtgx0/canada-logo.png" width="150px" />
			</div>
		
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