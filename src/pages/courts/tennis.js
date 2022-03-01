import React, { useState, useEffect, useRef } from "react";
import "../../../public/static/assets/css/tennis/tennis.css";
import { Helmet } from "react-helmet"
import ColorPicker from "../../components/ColorPicker";
import AdditionalLines from "../../components/AdditionalLines";
import {Switcher, SwitcherNet } from "../../components/Switcher";
import { WidthSlider, LongtitudeSlider } from "../../components/Slider";
import Dropdown from "../../components/Dropdown";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { extend } from "@react-three/fiber";
import { renderBasketball, removeBasketball, changeBasketballLinesPositions } from "../../renderBasketball";
import { renderTennis, renderBorderAndSurface, renderBorder, removeBorder } from "../../renderTennis";
import { renderPickleball, renderTwoPickleBallCourts } from "../../renderPickleball";
import hexToRgb from "../../helpers/hexToRgb";
import addSpotlight from "../../helpers/addSpotlight";
import { renderFence, renderLight, renderNet, changeFencePositions, changeLightPositions, renderGallery } from "../../render3DElements";
import Animated from "../../components/Animated";

export default function Tennis(){


	let [ lights, setLights ] = useState([0,0,0,0,0,0])
	let [ fences, setFences ] = useState([0,0,0,0]);
	let [ rebounder, setRebounder ] = useState([0,0,0,0]);
	let [ type, setType ] = useState('Laykold acrylic coating');
	let [ surfaceColor, setSurfaceColor ] = useState('#000000');
	let [ borderColor, setBorderColor ] = useState('#000000');
	let [ tennisLineColor, setTennisLineColor ] = useState('#ffffff');
	let [ tennisSurfaceColor, setTennisSurfaceColor ] = useState('#ffffff');
	let [ defaultWidth, setDefaultWidth ] = useState(60)
	let [ defaultLength, setDefaultLength ] = useState(120)
	let [ basketballLines, setBasketballLines ] = useState([0,0,0,0,0])
	let [ loading, setLoading ] = useState(false)
	let [ zoomLevel, setZoomLevel ] = useState(0)
	let renderer = useRef(null)
	let camera = useRef(null);
	let scene = useRef(null)
	let tennisLineMaterial = useRef( new LineMaterial( { color: 0xffffff, linewidth: 0.002}) );
	let loadedCounter = useRef(0);
	let prevZoom = useRef(0);
	let [ galleryFencesUsed, setGalleryFencesUsed ] = useState(false)

	function typeEffect(value){
		setType(value)

		let surfaceColor;
		let tennisSurfaceColor;

		if(value === 'Laykold acrylic coating'){
			surfaceColor = '#0082ca'
			tennisSurfaceColor = '#013ca6'
		}else{
			surfaceColor = '#3b68b1';
			tennisSurfaceColor = '#ff6632'
		}

		window.scene.children.filter(x => x._id === 'basketballGroup').forEach(x => x.children.forEach(y => {
			if(y.name === 'surfaceBasketball'){
				y.material.transparent = true;
				y.material.opacity = 0;
			}else{
				y.material.color = hexToRgb("#ffffff");
			}
		}))

		window.scene.children.filter(x => x._id === 'pickleballGroup').forEach(x => x.children.forEach(y => {
			if(y.name === 'surfacePickleball'){
				y.material.transparent = true;
				y.material.opacity = 0;
			}else{
				y.material.color = hexToRgb("#ffffff");
			}
		}))

		setSurfaceColor(surfaceColor)
		setTennisSurfaceColor(tennisSurfaceColor)
	}
	function onClickLights(e){
		let pos = e.target.dataset.pos;


		let _lights = [...lights]
		let isOn = _lights[pos] === 1 

		if(isOn){
			_lights[pos] = 0
		}else{
			_lights[pos] = 1
		}

		setLights([..._lights]);
	}

	function onClickFences(e){
		let pos = e.target.dataset.pos;


		let _fences = [...fences]
		let isOn = _fences[pos] === 1 

		if(isOn){
			_fences[pos] = 0
		}else{
			_fences[pos] = 1
		}

		setFences([..._fences]);
	}

	function onClickRebounder(e){
		let pos = e.target.dataset.pos;


		let _rebounder = [...rebounder]
		let isOn = _rebounder[pos] === 1 

		if(isOn){
			_rebounder[pos] = 0
		}else{
			_rebounder[pos] = 1
		}

		setRebounder([..._rebounder]);
	}

	function preloadAllImages(array){
		let counter = 0;

		array.forEach(x => {
		    var img = new Image();
		    img.src = x;
		    img.style = "position:absolute";
		    img.onload = function() { 
		    	counter++
		    	if(counter === array.length - 1) setLoading(true)
		    }
		    document.querySelector(".cache").appendChild(img);
		})
	}

	function onChange(color, label){
		if(label === 'surface'){
			setSurfaceColor(color)
		}

		if(label === 'border'){
			if(color === ''){
				removeBorder()
				setTimeout( () => changeFencePositions(defaultWidth, defaultLength), 100)

			}else{
				setBorderColor(color)
				setTimeout( () => changeFencePositions(defaultWidth, defaultLength), 100)
			}
		}

		if(label === 'tennis_line'){
			setTennisLineColor(color)
		}

		if(label === 'tennis_surface'){
			setTennisSurfaceColor(color)
		}
	}


	function changeMainLineColor(color){
		let lines = scene.current.children.filter(x => x._id === 'line');

		if(lines.length === 0) return;

		let _color = hexToRgb(color);

		lines.forEach(x => {
			x.material.color = _color;
		})
	}

	function changeSurfaceColor(color){
		let surface = scene.current.children.filter(x => x.name === 'surface');

		if(surface.length === 0) return;

		let _color = hexToRgb(color)

		surface[0].material.color = _color
	}

	function changeBorderColor(color){
		let border = scene.current.children.filter(x => x.name === 'border');

		if(border.length === 0) {
			renderBorder(defaultWidth, defaultLength, color)
		}else{
			let _color = hexToRgb(color)

			border[0].material.color = _color
		}
	}

	function changeTennisSurfaceColor(color){
		let plane = scene.current.children.filter(x => x.name === 'plane');

		if(plane.length === 0) return;

		let _color = hexToRgb(color)

		plane[0].material.color = _color
	}


	function sliderOnChange(val, type){
		if(type === 'width'){
			setDefaultWidth(val);
		}

		if(type === 'length'){
			setDefaultLength(val);
		}
	}

	function generateImage(){
		if(type === 'Laykold acrylic coating'){
			return "https://courtsurfacespecialists.com/wp-content/uploads/2019/11/cropped-final_logo_colour-1.jpg"
		}else{
			return "//cdn.shopify.com/s/files/1/1713/4277/files/new_logo_e1f9929b-5f20-4af7-92d2-696adae67032_410x.png?v=1539831396"
		}
	}

	function generateHref(){
		if(type === 'Laykold acrylic coating'){
			return "https://courtsurfacespecialists.com"
		}else{
			return "https://diycourt.ca"
		}
	}

	function generateAlt(){
		if(type === 'Laykold acrylic coating'){
			return "Court Surface Specialists Ltd"
		}else{
			return "DIY Court CA"
		}
	}

	useEffect(() => {
		if(!scene.current) return;


		changeMainLineColor(tennisLineColor);
		window.renderer.render(window.scene, window.camera)
	}, [tennisLineColor])

	useEffect( () => {
		if(!scene.current) return;

		changeSurfaceColor(surfaceColor)
		window.renderer.render(window.scene, window.camera)
	}, [surfaceColor])

	useEffect( () => {
		if(!scene.current) return;

		changeBorderColor(borderColor)
		window.renderer.render(window.scene, window.camera)
	}, [borderColor])

	useEffect( () => {
		if(!scene.current) return;


		changeTennisSurfaceColor(tennisSurfaceColor)
		window.renderer.render(window.scene, window.camera)
	}, [tennisSurfaceColor])

	useEffect( () => {
		renderFence(fences, defaultWidth, defaultLength)
	}, [fences])
	useEffect( () => {
		var cache = document.createElement("div");
		cache.style = "position:absolute;z-index:-1000;opacity:0;";
		cache.classList.add("cache")
		document.body.appendChild(cache);


		let imagesToPreload = [
			"/static/assets/images/top-left-light-full.png",
			"/static/assets/images/top-middle-light-full.png",
			"/static/assets/images/top-right-light-full.png",
			"/static/assets/images/bottom-left-light-full.png",
			"/static/assets/images/bottom-middle-light-full.png",
			"/static/assets/images/bottom-right-light-full.png",
			"/static/assets/images/top-left-light.png",
			"/static/assets/images/top-middle-light.png",
			"/static/assets/images/top-right-light.png",
			"/static/assets/images/bottom-left-light.png",
			"/static/assets/images/bottom-middle-light.png",
			"/static/assets/images/bottom-right-light.png",
			"/static/assets/images/left-middle.png",
			"/static/assets/images/right-middle.png",
			"/static/assets/images/top-middle.png",
			"/static/assets/images/bottom-middle.png",
			"/static/assets/images/left-middle-full.png",
			"/static/assets/images/right-middle-full.png",
			"/static/assets/images/top-middle-full.png",
			"/static/assets/images/bottom-middle-full.png",
			"/static/assets/images/basketball-court-full.svg",
			"/static/assets/images/basketball-court-full.png",
			"/static/assets/images/basketball-court.svg",
			"/static/assets/images/pickleball-court-full.svg",
			"/static/assets/images/pickleball-court.svg",
			"/static/assets/images/two-pickleball-courts.svg",
			"/static/assets/images/two-pickleball-courts-full.svg",
			"/static/assets/images/top-board-noborder-check-full.png",
			"/static/assets/images/top-board-noborder-check.png",
			"/static/assets/images/net-full.svg",
			"/static/assets/images/net.svg",
			"/static/assets/images/hoop-full.svg",
			"/static/assets/images/hoop.svg",
			"/static/assets/images/top-left-light.png",
			"/static/assets/images/top-left-light-full.png",
			"/static/assets/images/top-middle-light.png",
			"/static/assets/images/top-middle-light-full.png",
			"/static/assets/images/top-right-light.png",
			"/static/assets/images/top-right-light-full.png",
			"/static/assets/images/bottom-left-light.png",
			"/static/assets/images/bottom-left-light-full.png",
			"/static/assets/images/bottom-middle-light.png",
			"/static/assets/images/bottom-middle-light-full.png",
			"/static/assets/images/bottom-right-light.png",
			"/static/assets/images/bottom-right-light-full.png",
			"/static/assets/images/top-middle.png",
			"/static/assets/images/top-middle-full.png",
			"/static/assets/images/left-middle.png",
			"/static/assets/images/left-middle-full.png",
			"/static/assets/images/right-middle.png",
			"/static/assets/images/right-middle-full.png",
			"/static/assets/images/bottom-middle.png",
			"/static/assets/images/bottom-middle-full.png",
			"/static/assets/images/tennis-full.png",
			"/static/assets/images/pickleball-full.png",
			"/static/assets/images/tennis.png",
			"/static/assets/images/pickleball.png",
			"/static/assets/images/tennis-court-full.png",
			"/static/assets/images/basketball-lines-left.png",
			"/static/assets/images/basketball-lines-left-full.png",
			"/static/assets/images/basketball-lines-right.png",
			"/static/assets/images/basketball-lines-right-full.png",
			"/static/assets/images/basketball-lines-top.png",
			"/static/assets/images/basketball-lines-top-full.png",
			"/static/assets/images/basketball-lines-bottom.png",
			"/static/assets/images/basketball-lines-bottom-full.png",
			"/static/assets/images/pickleball-court-notext.svg",
			"/static/assets/images/pickleball-court-notext-full.svg",
			"/static/assets/images/two-pickleball-courts-notext.svg",
			"/static/assets/images/two-pickleball-courts-notext-full.svg",
		]

		preloadAllImages(imagesToPreload);
	}, [])

	useEffect( () => {
		if(!loading) return;

		renderer.current = new THREE.WebGLRenderer({alpha: true, antialias: true});
		window.renderer = renderer.current;
		renderer.current.setSize( window.innerWidth, window.innerHeight );
		//renderer.current.setClearColor( 0xffffff, 0, 0);
		renderer.current.setPixelRatio( window.devicePixelRatio );
		//renderer.current.toneMapping = THREE.LinearToneMapping
		//renderer.current.toneMappingExposure = 2.3;
		//renderer.current.shadowMap.enabled = true;
		if(document.querySelector(".threeJS-container")) document.querySelector(".threeJS-container").appendChild( renderer.current.domElement );

		camera.current = new THREE.PerspectiveCamera( 12, window.innerWidth / window.innerHeight, 2, 1600 );
		camera.current.position.set(43.60292714932831, 93.06104139037603, 111.10822453090113 );

		//const pt = new THREE.Vector3(38.50390443253893,0.00003815632718041994,-15.614921552374081)
		//camera.current.lookAt(pt);


		window.camera = camera.current
		scene.current = new THREE.Scene();
		window.scene = scene.current;
		window.scene2 = new THREE.Scene();
		const controls = new OrbitControls( camera.current, renderer.current.domElement )

		camera.current.zoom = 0.28;

		camera.current.updateProjectionMatrix();
		window.controls = controls;


		let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1.5);
		hemiLight.position.set(0,50,0)
		scene.current.add(hemiLight);


		renderTennis(renderer.current, scene.current, camera.current, tennisLineMaterial.current)


    	controls.target.set(39, 0.1, -14);
    	controls.update();

		controls.minPolarAngle = 0.9320850529728638
		controls.maxPolarAngle = 0.9320850529728638

		controls.minDistance = 72;
		controls.maxDistance = 155.93270984626542;

		controls.addEventListener( 'change', (e,a) => {

			renderer.current.autoClear = true;

			let { minDistance, maxDistance } = controls;
			let distance = controls.getDistance();

			let range = maxDistance - minDistance;

			let percentage = (distance-minDistance)/range;

			if(percentage !== prevZoom.current){
				setZoomLevel((1-percentage) * 100)
			}

			prevZoom.current = percentage;
			renderer.current.render(scene.current, camera.current)
		} );

		renderer.current.render(scene.current, camera.current)

		renderNet([1,0])
	}, [loading])

	useEffect( () => {
		if(!window.scene) return;

		let length = defaultLength
		let width = defaultWidth 

		renderLight(lights, defaultWidth, defaultLength)
	}, [lights])

	useEffect( () => {
		if(!window.scene) return;

		changeBasketballLinesPositions(basketballLines, defaultWidth, defaultLength)
		renderFence(fences, defaultWidth, defaultLength)
		changeLightPositions(defaultWidth, defaultLength)
		renderBorderAndSurface(defaultWidth, defaultLength);

		if(galleryFencesUsed) { renderGallery(!galleryFencesUsed) }
		window.renderer.render(window.scene, window.camera);

	}, [defaultWidth, defaultLength])

	if(!loading) return <Animated />

	return(
		<>
			<Helmet>
				<title>Tennis Court 3D</title>
				<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" type="text/css" />
			</Helmet>
			<div className="left-menu">
					<div className="center mbot-1">
				        <a className="logo-img-css" href={generateHref()}>
				            <img src={generateImage()} alt={generateAlt()} />
				        </a>
					</div>
					<div>
						<p>Surface</p>

						<Dropdown parentEffect={typeEffect} />
					</div>

					<div className="mtop-1">
						<p className="mbot-1">Lights</p>
						<div className="light-positions">
							<div className="img-cont left-right">
								<img className={lights[0] === 1 ? "light-on" : ""} src={lights[0] === 0 ? "/static/assets/images/top-left-light.png" : "/static/assets/images/top-left-light-full.png"} onClick={onClickLights} data-pos={0}/>
								<img className={lights[1] === 1 ? "light-on" : ""} src={lights[1] === 0 ? "/static/assets/images/top-middle-light.png" : "/static/assets/images/top-middle-light-full.png"} onClick={onClickLights} data-pos={1} />
								<img className={lights[2] === 1 ? "light-on" : ""} src={lights[2] === 0 ? "/static/assets/images/top-right-light.png" : "/static/assets/images/top-right-light-full.png"} onClick={onClickLights} data-pos={2} />
							</div>

							<div className="img-cont left-right">
								<img className={lights[3] === 1 ? "light-on" : ""} src={lights[3] === 0 ? "/static/assets/images/bottom-left-light.png" : "/static/assets/images/bottom-left-light-full.png"} onClick={onClickLights} data-pos={3}/>
								<img className={lights[4] === 1 ? "light-on" : ""} src={lights[4] === 0 ? "/static/assets/images/bottom-middle-light.png" : "/static/assets/images/bottom-middle-light-full.png"} onClick={onClickLights} data-pos={4}/>
								<img className={lights[5] === 1 ? "light-on" : ""} src={lights[5] === 0 ? "/static/assets/images/bottom-right-light.png" : "/static/assets/images/bottom-right-light-full.png"} onClick={onClickLights} data-pos={5}/>
							</div>

						</div>
					</div>

					<div className="mtop-1">
						<p className="mbot-1">Fence</p>
						<div className="circular-position">

							<div className="img-cont left-right">
								<img src={fences[0] === 0 ? "/static/assets/images/top-middle.png" : "/static/assets/images/top-middle-full.png"} onClick={onClickFences} data-pos={0} />
							</div>

							<div className="img-cont left-right">
								<img src={fences[1] === 0 ? "/static/assets/images/left-middle.png" : "/static/assets/images/left-middle-full.png"} onClick={onClickFences} data-pos={1} />
								<img src={fences[2] === 0 ? "/static/assets/images/right-middle.png" : "/static/assets/images/right-middle-full.png"} onClick={onClickFences} data-pos={2} />
							</div>

							<div className="img-cont left-right">
								<img src={fences[3] === 0 ? "/static/assets/images/bottom-middle.png" : "/static/assets/images/bottom-middle-full.png"} onClick={onClickFences} data-pos={3} />
							</div>

						</div>

						{(fences[3] !== 0 || fences[0] !== 0) &&
							<label>
								<button className="ga-fences" onClick={() => {
									renderGallery(galleryFencesUsed)
									setGalleryFencesUsed(!galleryFencesUsed)
								}}>Use {!galleryFencesUsed ? 'Gallery' : 'Standard'} Fence ({!galleryFencesUsed ? '4ft' : '10ft'})</button>
							</label>
						}
					</div>
				</div>

				<div className="zoomContainer">
					<p>Zoom: {zoomLevel.toFixed(2)}%</p>
					<div className="zoomLevel" style={{cursor:'pointer'}}>
						<i className="fas fa-plus-circle" onClick={() => {
							window.controls.dIn(0.95)
							window.controls.update()
						}}></i>
						<i style={{cursor:'pointer'}} className="fas fa-minus-circle" onClick={() => {
							window.controls.dIn(1.05)
							window.controls.update()
						}}></i>
					</div>
				</div>

				<div className='threeJS-container'>
				</div>

				<div className="right-menu">

					<div className="mtop-1">
						<div className="image-picker--container left-right">

							<div className="column-direction">
								<label>Surface</label>
								<ColorPicker type={type} 
								onChange={onChange} 
								label="surface" 
								cc={type !== 'Laykold acrylic coating' ? "#3b68b1" : "#0082ca"}
								w={defaultWidth}
								l={defaultLength}
								/>
							</div>

							<div className="column-direction">
								<label>Border</label>

								<ColorPicker w={defaultWidth} l={defaultLength} type={type} onChange={onChange} noColor={true} name="border" label="border" cc="#ffffff" />
							</div>
						</div>

						<div className='image-picker--container left-right'>
							<div className="column-direction">
								<label>Tennis line</label>

								<ColorPicker type={type} addWhite={true} onChange={onChange} label="tennis_line" cc="#ffffff" />
							</div>

							<div className="column-direction">
								<label>Tennis surface</label>

								<ColorPicker type={type} onChange={onChange} label="tennis_surface" cc={type !== 'Laykold acrylic coating' ? "#ff6632":"#013ca6"}/>
							</div>
						</div>
					</div>

					<div className="m-top1">

						<div className="align-center wrap additional-lines">
							<p>Additional lines</p>
							<AdditionalLines 
								defaultWidth={defaultWidth} 
								defaultLength={defaultLength} 
								basketballLines={basketballLines} 
								setBasketballLines={setBasketballLines}
								type={type}
								excludePositions={[]}
							/>
						</div>

					</div>

					<div className="mtop-1" style={{width:'85%'}}>
						<div className="options align-center left-right relative">
							<Switcher name="Hoops" imgName="hoop" width={defaultWidth} length={defaultLength} excludePositions={[]}/>
						</div>

						<div className="options align-center left-right relative">
							{/*<SwitcherNet name="Nets" imgName="net" />*/}
						</div>
					</div>

					<div className="mtop-1">
						<WidthSlider defaultValue={60} onChange={sliderOnChange} marks={
							[
								{
								value: 50,
								label: '50 ft',
								},
								{
								value: 70,
								label: '70 ft',
								}
							]
						}/>
						<LongtitudeSlider defaultValue={120} onChange={sliderOnChange}
							marks={
								[
									
								]
							}
						/>
					</div>

				</div>
		</>
	)
}