import React, { useState, useEffect, useRef } from "react";
import "../../../public/static/assets/css/tennis/tennis.css";
import { Helmet } from "react-helmet"
import ColorPicker from "../../components/ColorPicker";
import AdditionalLines from "../../components/AdditionalLines";
import { Switcher, SwitcherNet } from "../../components/Switcher";
import { WidthSlider, LongtitudeSlider } from "../../components/Slider";
import Dropdown from "../../components/Dropdown";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { extend } from "@react-three/fiber";
import { renderBasketball, removeBasketball, changeBasketballLinesPositions, renderBorderAndSurface, renderBorder, renderBasketballLines } from "../../renderBasketball";
import { renderTennis, removeBorder } from "../../renderTennis";
import { renderPickleball, renderTwoPickleBallCourts } from "../../renderPickleball";
import hexToRgb from "../../helpers/hexToRgb";
import addSpotlight from "../../helpers/addSpotlight";
import { renderFence, renderLight, renderNet, changeFencePositions, changeLightPositions, renderGallery } from "../../render3DElements";
import Animated from "../../components/Animated";
import GetQuote from "../../components/GetQuote";
import MobileMenu from "../../components/MobileMenu";

export default function Basketball() {


	let [lights, setLights] = useState([0, 0, 0, 0, 0, 0])
	let [fences, setFences] = useState([0, 0, 0, 0]);
	let [rebounder, setRebounder] = useState([0, 0, 0, 0]);
	let [type, setType] = useState('Laykold (Acrylic Coating) 🎨');
	let [surfaceColor, setSurfaceColor] = useState('#055739');
	let [kitchenColor, setKitchenColor] = useState('#055739');
	let [basketballLineColor, setBasketballLineColor] = useState('#ffffff');
	let [basketballSurfaceColor, setBasketballSurfaceColor] = useState('#013ca6');
	let [defaultWidth, setDefaultWidth] = useState(30)
	let [defaultLength, setDefaultLength] = useState(60)
	let [basketballLines, setBasketballLines] = useState([0, 0, 0, 0, 0])
	let [loading, setLoading] = useState(false)
	let [zoomLevel, setZoomLevel] = useState(0)
	let renderer = useRef(null)
	let camera = useRef(null);
	let scene = useRef(null)
	let tennisLineMaterial = useRef(new LineMaterial({ color: 0xffffff, linewidth: 0.002 }));
	let loadedCounter = useRef(0);
	let prevZoom = useRef(0);
	let [galleryFencesUsed, setGalleryFencesUsed] = useState(false)

	function typeEffect(value) {
		setType(value)

		let surfaceColor;
		let basketballSurfaceColor;

		if (value === 'Laykold (Acrylic Coating) 🎨') {
			surfaceColor = '#055739'
			basketballSurfaceColor = '#013ca6'
		} else {
			surfaceColor = '#3b68b1'
			basketballSurfaceColor = '#ff6632'
		}

		window.scene.children.filter(x => x._id === 'basketballGroup').forEach(x => x.children.forEach(y => {
			if (y.name === 'surfaceBasketball') {
				//y.material.transparent = true;
				//y.material.opacity = 0;
			} else {
				//y.material.color = hexToRgb("#ffffff");
			}
		}))

		window.scene.children.filter(x => x._id === 'pickleballGroup').forEach(x => x.children.forEach(y => {
			if (y.name === 'surfacePickleball') {
				y.material.transparent = true;
				y.material.opacity = 0;
			} else {
				y.material.color = hexToRgb("#ffffff");
				y.material.opacity = 1;
			}
		}))

		setSurfaceColor(surfaceColor)
		setBasketballSurfaceColor(basketballSurfaceColor)
	}
	function onClickLights(e) {
		let pos = e.target.dataset.pos;


		let _lights = [...lights]
		let isOn = _lights[pos] === 1

		if (isOn) {
			_lights[pos] = 0
		} else {
			_lights[pos] = 1
		}

		setLights([..._lights]);
	}

	function onClickFences(e) {
		let pos = e.target.dataset.pos;


		let _fences = [...fences]
		let isOn = _fences[pos] === 1

		if (isOn) {
			_fences[pos] = 0
		} else {
			_fences[pos] = 1
		}

		setFences([..._fences]);
	}

	function onClickRebounder(e) {
		let pos = e.target.dataset.pos;


		let _rebounder = [...rebounder]
		let isOn = _rebounder[pos] === 1

		if (isOn) {
			_rebounder[pos] = 0
		} else {
			_rebounder[pos] = 1
		}

		setRebounder([..._rebounder]);
	}

	function preloadAllImages(array) {
		let counter = 0;

		array.forEach(x => {
			var img = new Image();
			img.src = x;
			img.style = "position:absolute";
			img.onload = function () {
				counter++
				if (counter === array.length - 1) setLoading(true)
			}
			document.querySelector(".cache").appendChild(img);
		})
	}

	function onChange(color, label) {
		if (label === 'surface') {
			setSurfaceColor(color)
		}

		if (label === 'border') {
			if (color === '') {
				removeBorder()
				setTimeout(() => changeFencePositions(defaultWidth, defaultLength), 100)

			} else {
				setTimeout(() => changeFencePositions(defaultWidth, defaultLength), 100)
			}
		}

		if (label === 'pickleball_line') {
			setBasketballLineColor(color)
		}

		if (label === 'pickleball') {
			if (color === '') color = surfaceColor;
			setBasketballSurfaceColor(color)
		}

		if (label === 'kitchen') {
			setKitchenColor(color)
		}
	}


	function changeMainLineColor(color) {
		let children = scene.current.children.filter(x => x._id === 'basketballGroup');
		let middleLine = scene.current.children.filter(x => x.name === 'middleLine')
		let basketballOutsideLines = scene.current.children.filter(x => x.name === 'basketballOutsideLines');

		let filter = null;

		if (children) {
			for (let i = 0; i < children.length; i++) {

				console.log(children)
				let _children = children[i].children.filter(x => x.name === 'lineBasketball' || x._id === 'lineBasketball')

				console.log(_children)

				_children.forEach(x => {
					console.log(x)
					x.material.color = hexToRgb(color)
					x.material.transparent = false;
					x.material.opacity = 1;
				})
			}
		}

		if (middleLine) {
			middleLine.forEach(x => {
				x.children.forEach(x => {
					x.material.color = hexToRgb(color)
				})
			})
		}

		if (basketballOutsideLines) {
			basketballOutsideLines.forEach(x => {
				x.children.forEach(x => {
					x.material.color = hexToRgb(color)
				})
			})
		}

		let _color = hexToRgb(color);
	}

	function changeSurfaceColor(color) {
		let surface = scene.current.children.filter(x => x.name === 'surface');

		if (surface.length === 0) return;

		let _color = hexToRgb(color)

		surface[0].material.color = _color
	}

	function changeBasketballSurfaceColor(color) {
		console.log('running')
		let children = window.scene.children.filter(x => x._id === 'pickleballGroup')

		console.log(children)
		if (!children) return;

		let _color = hexToRgb(color)

		for (let i = 0; i < children.length; i++) {
			let _children = children[i].children.filter(x => x._id = 'linePickleball')


			_children.forEach(x => {
				if (x.name === 'surfacePickleball') {
					console.log(x)
					if (!color) {
						x.material.transparent = true;
						x.material.opacity = 0;
					} else {
						x.material.color = hexToRgb(color)
						x.material.transparent = false;
						x.material.opacity = 1;
					}
				}
			})
		}

	}


	function sliderOnChange(val, type) {
		if (type === 'width') {
			setDefaultWidth(val);
		}

		if (type === 'length') {
			setDefaultLength(val);
		}
	}

	function generateImage() {
		if (type === 'Laykold (Acrylic Coating) 🎨') {
			return "//images.squarespace-cdn.com/content/v1/6643bd23b8f7dc12ccdd9c1b/1d1e2613-9914-425f-aa65-025066064937/CSS+Logo+Full.png?format=1500w"
		} else {
			return "//i.ibb.co/1Xjtgx0/canada-logo.png"
		}
	}

	function generateHref() {
		if (type === 'Laykold (Acrylic Coating) 🎨') {
			return "https://courtsurfacespecialists.com"
		} else {
			return "https://diycourt.ca"
		}
	}

	function generateAlt() {
		if (type === 'Laykold (Acrylic Coating) 🎨') {
			return "Court Surface Specialists Ltd"
		} else {
			return "DIY Court CA"
		}
	}

	useEffect(() => {
		if (!window.scene) return;


		changeMainLineColor(basketballLineColor);
		window.renderer.render(window.scene, window.camera)
	}, [basketballLineColor])

	useEffect(() => {
		if (!window.scene) return;

		changeSurfaceColor(surfaceColor)
		window.renderer.render(window.scene, window.camera)
	}, [surfaceColor])

	useEffect(() => {
		console.log('changed')
		if (!window.scene) return;

		let pbGroup = window.scene.children.filter(x => x.name === 'pickleballGroup');

		if (pbGroup.length === 0) return;

		let pbGroupChildren = pbGroup[0].children;

		let surface = pbGroupChildren.filter(x => x.name === 'kitchen');

		if (surface.length === 0) return;

		let _color = hexToRgb(kitchenColor)

		if (kitchenColor) {
			surface[0].material.color = _color
			surface[0].material.opacity = 1;
		} else {
			surface[0].material.opacity = 0;
		}

		window.renderer.render(window.scene, window.camera)
	}, [kitchenColor])

	useEffect(() => {
		if (!window.scene) return;


		changeBasketballSurfaceColor(basketballSurfaceColor)
		window.renderer.render(window.scene, window.camera)
	}, [basketballSurfaceColor])

	useEffect(() => {
		renderFence(fences, defaultWidth, defaultLength)
		renderGallery(!galleryFencesUsed)
	}, [fences])
	useEffect(() => {
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

	useEffect(() => {
		if (!loading) return;

		renderer.current = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
		window.renderer = renderer.current;
		renderer.current.setSize(window.innerWidth, window.innerHeight);
		//renderer.current.setClearColor( 0xffffff, 0, 0);
		renderer.current.setPixelRatio(window.devicePixelRatio);
		//renderer.current.toneMapping = THREE.LinearToneMapping
		//renderer.current.toneMappingExposure = 2.3;
		//renderer.current.shadowMap.enabled = true;
		if (document.querySelector(".threeJS-container")) document.querySelector(".threeJS-container").appendChild(renderer.current.domElement);

		camera.current = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 2, 1600);
		camera.current.position.set(43.60292714932831, 93.06104139037603, 111.10822453090113);

		//const pt = new THREE.Vector3(38.50390443253893,0.00003815632718041994,-15.614921552374081)
		//camera.current.lookAt(pt);


		window.camera = camera.current
		scene.current = new THREE.Scene();
		window.scene = scene.current;
		window.scene2 = new THREE.Scene();
		const controls = new OrbitControls(camera.current, renderer.current.domElement)

		camera.current.zoom = 0.28;

		camera.current.updateProjectionMatrix();
		window.controls = controls;


		let hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
		hemiLight.position.set(0, 25, 0)
		scene.current.add(hemiLight);


		//renderTennis(renderer.current, scene.current, camera.current, tennisLineMaterial.current)
		controls.target.set(39, 0.05, -14);
		controls.update();

		controls.minPolarAngle = 0.9320850529728638
		controls.maxPolarAngle = 0.9320850529728638

		controls.minDistance = 72;
		controls.maxDistance = 155.93270984626542;

		controls.addEventListener('change', (e, a) => {

			renderer.current.autoClear = true;

			let { minDistance, maxDistance } = controls;
			let distance = controls.getDistance();

			let range = maxDistance - minDistance;

			let percentage = (distance - minDistance) / range;

			if (percentage !== prevZoom.current) {
				setZoomLevel((1 - percentage) * 100)
			}

			prevZoom.current = percentage;
			renderer.current.render(scene.current, camera.current)
		});


		renderer.current.render(scene.current, camera.current)
		setTimeout(() => {
			renderBorderAndSurface(defaultWidth, defaultLength, true)
			renderNet([0, 1])
			renderPickleball()
		}, 150)
	}, [loading])

	useEffect(() => {
		if (!window.scene) return;

		let length = defaultLength
		let width = defaultWidth

		renderLight(lights, defaultWidth, defaultLength)
	}, [lights])

	useEffect(() => {
		if (!window.scene) return;

		//changeBasketballLinesPositions(basketballLines, defaultWidth, defaultLength)
		renderFence(fences, defaultWidth, defaultLength)
		changeLightPositions(defaultWidth, defaultLength)
		renderBorderAndSurface(defaultWidth, defaultLength)
		//renderBasketballLines(defaultWidth, defaultLength, false, hexToRgb(basketballLineColor))

		if (galleryFencesUsed) { renderGallery(!galleryFencesUsed) }
		window.renderer.render(window.scene, window.camera)

	}, [defaultWidth, defaultLength])

	if (!loading) return <Animated />

	return (
		<>
			<Helmet>
				<title>CSS Ltd & DIY Court Canada - Court Designer</title>
				<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet" type="text/css" />
				<link rel="icon" type="image/x-icon" href="https://images.squarespace-cdn.com/content/v1/6643bd23b8f7dc12ccdd9c1b/f8d21ede-b73c-4812-ae25-3beeef6a546a/favicon.ico?format=100w"></link>
			</Helmet>
			<div className="left-menu">
				<i className="fas fa-angle-double-left" onClick={() => {
					document.querySelector(".left-menu").style.display = 'none'
				}}></i>
				<div className="center mbot-1">
					<a className="logo-img-css" href={generateHref()}>
						<img src={generateImage()} alt={generateAlt()} style={{ filter: 'unset' }} />
					</a>
				</div>
				<div>
					<p>Surface options</p>

					<Dropdown parentEffect={typeEffect} />
				</div>

				<div className="mtop-1">
					<p className="mbot-1">Lights</p>
					<div className="light-positions">
						<div className="img-cont left-right">
							<img className={lights[0] === 1 ? "light-on" : ""} src={lights[0] === 0 ? "/static/assets/images/top-left-light.png" : "/static/assets/images/top-left-light-full.png"} onClick={onClickLights} data-pos={0} />
							<img className={lights[1] === 1 ? "light-on" : ""} src={lights[1] === 0 ? "/static/assets/images/top-middle-light.png" : "/static/assets/images/top-middle-light-full.png"} onClick={onClickLights} data-pos={1} />
							<img className={lights[2] === 1 ? "light-on" : ""} src={lights[2] === 0 ? "/static/assets/images/top-right-light.png" : "/static/assets/images/top-right-light-full.png"} onClick={onClickLights} data-pos={2} />
						</div>

						<div className="img-cont left-right">
							<img className={lights[3] === 1 ? "light-on" : ""} src={lights[3] === 0 ? "/static/assets/images/bottom-left-light.png" : "/static/assets/images/bottom-left-light-full.png"} onClick={onClickLights} data-pos={3} />
							<img className={lights[4] === 1 ? "light-on" : ""} src={lights[4] === 0 ? "/static/assets/images/bottom-middle-light.png" : "/static/assets/images/bottom-middle-light-full.png"} onClick={onClickLights} data-pos={4} />
							<img className={lights[5] === 1 ? "light-on" : ""} src={lights[5] === 0 ? "/static/assets/images/bottom-right-light.png" : "/static/assets/images/bottom-right-light-full.png"} onClick={onClickLights} data-pos={5} />
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
				<div className="zoomLevel" style={{ cursor: 'pointer' }}>
					<i className="fas fa-plus-circle" onClick={() => {
						window.controls.dIn(0.95)
						window.controls.update()
					}}></i>
					<i style={{ cursor: 'pointer' }} className="fas fa-minus-circle" onClick={() => {
						window.controls.dIn(1.05)
						window.controls.update()
					}}></i>
				</div>
			</div>

			<div className='threeJS-container'>
			</div>

			<div className="right-menu">
				<i className="fas fa-angle-double-right" onClick={() => {
					document.querySelector(".right-menu").style.display = 'none'
				}}></i>

				<div className="mtop-1">
					<div className="image-picker--container left-right">

						<div className="column-direction">
							<label>Surface</label>
							<ColorPicker type={type}
								onChange={onChange}
								label="surface"
								cc={type !== 'Laykold (Acrylic Coating) 🎨' ? "#3b68b1" : "#055739"}
								w={defaultWidth}
								l={defaultLength}
							/>
						</div>

						<div className="column-direction">
							<label>Kitchen</label>

							<ColorPicker w={defaultWidth} l={defaultLength} type={type} onChange={onChange} noColor={true} name="kitchen" label="kitchen" cc="#ffffff" />
						</div>
					</div>

					<div className='image-picker--container left-right'>
						<div className="column-direction">
							<label>Pickleball Surface</label>

							<ColorPicker type={type} onChange={onChange} label="pickleball" noColor={true} cc={type !== 'Laykold (Acrylic Coating) 🎨' ? "#ff6632" : "#00748d"} />
						</div>

						<div className="column-direction">
							<label>Pickleball Lines</label>

							<ColorPicker type={type} addWhite={true} onChange={onChange} label="pickleball_line" cc="#ffffff" />
						</div>
					</div>
				</div>

				{/* <div className="m-top1">

						<div className="align-center wrap additional-lines">
							<p>Additional lines</p>
							<AdditionalLines	 
								defaultWidth={defaultWidth} 
								defaultLength={defaultLength} 
								basketballLines={basketballLines} 
								setBasketballLines={setBasketballLines}
								type={type}
								isPickleball={true}
								excludePositions={{3: true, 4: true}}
							/>
						</div>

					</div> */}

				<div className="mtop-1" style={{ width: '85%' }}>
					<div className="options align-center left-right relative">
						<Switcher
							name="Hoops"
							imgName="hoop"
							width={defaultWidth}
							length={defaultLength}
							hoopsDefault={[0, 0, 0, 0, 0]}
							excludePositions={{ 3: true, 4: true }}
						/>
					</div>

					<div className="options align-center left-right relative">
						{/*<SwitcherNet name="Nets" imgName="net" />*/}
					</div>
				</div>


				<span className="disclaimer">*Renderings are for illustrative purposes</span>
			</div>
			<GetQuote courtName="Pickleball" />
			<MobileMenu />
			<div className="mtop-1 sliders">
				<WidthSlider defaultValue={30} min={30} max={40} onChange={sliderOnChange} marks={
					[{
						value: 30,
						label: '30 ft'
					},
					{
						value: 40,
						label: '40 ft'
					}]
				} />
				<LongtitudeSlider defaultValue={60} min={60} max={70} onChange={sliderOnChange} marks={[
					{
						value: 60,
						label: '60 ft'
					},
					{
						value: 70,
						label: '70 ft'
					}
				]} />
			</div>

		</>
	)
}