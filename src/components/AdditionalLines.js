import React, { useState, useEffect, useRef } from "react";
import ColorPicker from "./ColorPicker";
import hexToRgb from "../helpers/hexToRgb";
import { renderBasketball, removeBasketball, renderMiddleLine } from "../renderBasketball";
import { renderPickleball, renderTwoPickleBallCourts, removePickleballFromScreen } from "../renderPickleball";
import { renderTennis } from "../renderTennis";


export default function AdditionalLines({
		defaultWidth, defaultLength, basketballLines, 
		setBasketballLines, type, excludePositions, isBasketball, isPickleball,
		shouldRenderTennis, isMultisport, ccTennis
	}){
	let [ lines, setLines ] = useState([0,0]);
	let [ showPickleballSelector, setShowPickleballSelector ] = useState(false);
	let [ showBasketballSelector, setShoBasketballSelector ] = useState(false);
	let [ showMore, setShowMore ] = useState(false)
	let [ tennisClicked, setTennisClicked ] = useState(false)
	let handler = useRef(null)
	

	useEffect( () => {
		setTennisClicked(true)
		setTimeout( () => renderTennis(defaultWidth, defaultLength, true, (ccTennis || '#055739')), 150)
	}, [shouldRenderTennis])
	function onClick(e){
		let pos = e.target.dataset.pos;

		if(Number(pos) === -1){
			setShowPickleballSelector(true)
			return;
		}

		let _lines = [...lines];

		if(_lines[pos] === 0){
			_lines[pos] = 1;
		}else{
			_lines[pos] = 0;
		}

		setLines([..._lines])
	}

	function onClickTennis(){

		setTennisClicked(!tennisClicked)

		if(!tennisClicked) renderTennis(defaultWidth, defaultLength, true)
		else {
			window.scene.children = window.scene.children.filter(x => x.name !== 'plane' && x.name !== 'line')
			window.renderer.render(window.scene, window.camera)
		}
		
	}
	function onClickBasketball(e){
		let pos = e.target.dataset.pos

		if(Number(pos) === -1){
			setShoBasketballSelector(true)
			return;
		}

		let _lines = [...basketballLines];
		if(_lines[pos] === 0){
			_lines[pos] = 1;
		}else{
			_lines[pos] = 0;
		}

		if(basketballLines[1] === 1 && isBasketball){
			renderMiddleLine(defaultWidth, defaultLength, defaultLength/2 - 39.2, 13.57)
		}else if(basketballLines[1] === 0 && isBasketball){
			window.scene.children = window.scene.children.filter(x => x.name !== 'middleLine')
		}

		setBasketballLines([..._lines])

	}
	function onClickCustom(e){
		let pos = e.target.dataset.pos;
		let value = e.target.dataset.value;

		let _lines = [...lines];

		if(_lines[pos] !== Number(value)){
			_lines[pos] = Number(value) ;
		}else{
			_lines[pos] = 0;
		}


		setLines([..._lines])	
		setShowPickleballSelector(false)
	}

	function renderImage(){
		let src = "";

		if(lines[1] === 1){
			src = "/static/assets/images/pickleball-court-full.svg"
		}else if(lines[1] === 0){
			src = "/static/assets/images/pickleball-court.svg"
		}else if(lines[1] === 2){
			src = "/static/assets/images/two-pickleball-courts-full.svg"
		}

		return <img onClick={onClick} data-pos={-1} src={src} alt="pickleball" title="Pickleball" className={lines[1] === 2 ? 'top-15' : ''}/>
	}

	function hideOnOutsideClick(e){	

		let el = document.querySelector(".select-basketball")

		if(el){
			let el = document.querySelector(".select-basketball")

			if(el.contains(e.target)) return false

			setShowPickleballSelector(false)
			setShoBasketballSelector(false)
		}else{
			setShowPickleballSelector(false)
			setShoBasketballSelector(false)
		}

		window.removeEventListener("click", handler.current)
	}


	function onChange(color, label, type){
		if(label === 'basketball'){

			let children = window.scene.children.filter(x => x._id === 'basketballGroup')

			if(!children) return 

			if(type === 'lines'){

				for(let i = 0; i < children.length; i++){
					let _children = children[i].children.filter(x => x._id === 'lineBasketball')

					_children.forEach(x =>{
						if(x.name !== 'surfaceBasketball') x.material.color = hexToRgb(color)
					})
				}
			}else{

				for(let i = 0; i < children.length; i++){
					let _children = children[i].children.filter(x => x._id !== 'lineBasketball')


					_children.forEach(x =>{
						console.log(color)
						console.log('adi lines')
						if(x.name === 'surfaceBasketball') {
							if(!color){
								x.material.transparent = true;
								x.material.opacity = 0;
							}else{
								x.material.color = hexToRgb(color)
								x.material.transparent = true;
								x.material.opacity = 1;
							}
							
						}
					})
				}
			}
		}else if(label === 'tennis'){
			if(type === 'lines'){
				let children = window.scene.children.filter(x => x.name === 'line')

				console.log(children)
				children.forEach(x => x.material.color = hexToRgb(color))
			}else{
				let children = window.scene.children.filter(x => x.name === 'plane')

				if(color){
					children.forEach(x => {
						x.material.color = hexToRgb(color)
						x.material.opacity = 1
					})
				}else{
					children.forEach(x => {
						x.material.color = hexToRgb(color)
						x.material.opacity = 0;
						x.material.transparent = true;
					})
				}
			}
		}else{
			let children = window.scene.children.filter(x => x._id === 'pickleballGroup')

			if(!children) return;

			if(type === 'lines'){
				for(let i = 0; i < children.length; i++){
					let _children = children[i].children.filter(x => x._id = 'linePickleball')

					_children.forEach(x => {
						if(x.name !== 'surfacePickleball') x.material.color = hexToRgb(color)
					})
				}
			}else{
				for(let i = 0; i < children.length; i++){
					let _children = children[i].children.filter(x => x._id = 'linePickleball')


					_children.forEach(x =>{
						if(x.name === 'surfacePickleball') {
							if(!color){
								x.material.transparent = true;
								x.material.opacity = 0;
							}else{
								x.material.color = hexToRgb(color)
								x.material.transparent = false;
								x.material.opacity = 1;
							}
						}
					})
				}
			}
		}
	}

	useEffect( () => {
		if(!handler.current) handler.current = hideOnOutsideClick
	}, [])


	useEffect( () => {
		if(showPickleballSelector){
			window.addEventListener("click", handler.current)
		}
	}, [showPickleballSelector])


	useEffect( () => {
		if(showBasketballSelector){
			window.addEventListener("click", handler.current)
		}
	}, [showBasketballSelector])

	useEffect( () => {
		let arr = [];
		let removeFromScreen = [];

		if(basketballLines[0] === 0) removeFromScreen.push('left')
		if(basketballLines[1] === 0) removeFromScreen.push('top')
		if(basketballLines[2] === 0) removeFromScreen.push('right')
		if(basketballLines[3] === 0) removeFromScreen.push('top-middle')
		if(basketballLines[4] === 0) removeFromScreen.push('bottom-middle')

		removeFromScreen.forEach(x => {
			removeBasketball(x)
		})

		if(basketballLines[0] === 1) arr.push('left')
		if(basketballLines[1] === 1) arr.push('top')
		if(basketballLines[2] === 1) arr.push('right')
		if(basketballLines[3] === 1) arr.push('top-middle')
		if(basketballLines[4] === 1) arr.push('bottom-middle')

		arr.forEach(x => {
			renderBasketball(x, defaultWidth, defaultLength)
		})

		if(!window.renderer) return;
		window.renderer.render(window.scene, window.camera)
	}, [basketballLines])

	useEffect( () => {
		if(!window.renderer) return;
		removePickleballFromScreen()
		if(lines[1] === 1) renderPickleball()
		if(lines[1] === 2) renderTwoPickleBallCourts()

		window.renderer.render(window.scene, window.camera)
	}, [lines])

	function showMoreHandler(){
		setShowMore(!showMore)
	}

	return(
		<div className="img-cont left-right wrap">

			{!showMore && <>

				{isBasketball && 
					<div className="lines-colorpicker-container">
						<img onClick={onClickTennis} className="img-tennis" style={{marginBottom: '5px'}} src={tennisClicked ? "/static/assets/images/tennis-court-show-full.png" : "/static/assets/images/tennis-court-show.png"} />
						<ColorPicker additionalOptions={true} label="tennis" noColor={true} onChange={onChange} type={type} cc2="#ffffff" cc="#055739" />
					</div>	
				}

				{!isBasketball && 
					<div className="lines-colorpicker-container">
						<img onClick={onClickBasketball} data-pos={-1} src={basketballLines.includes(1) ? "/static/assets/images/basketball-court-full.svg" : "/static/assets/images/basketball-court.svg"} title="Basketball" alt="basketball" />
						<ColorPicker additionalOptions={true} label="basketball" noColor={true} onChange={onChange} type={type} cc2="#ffffff" cc="#055739" />
					</div>
				}
				
				{!isPickleball && 
					<div className="lines-colorpicker-container">
						{renderImage()}
						<ColorPicker additionalOptions={true} label="pickleball" onChange={onChange} noColor={true} type={type} cc2="#ffffff" cc="#055739" />
					</div>				
				}

				</>
			}


			{showMore && 
			<div className="lines-colorpicker-container">
				<img onClick={onClickTennis} className="img-tennis" style={{marginBottom: '5px'}} src={tennisClicked ? "/static/assets/images/tennis-court-show-full.png" : "/static/assets/images/tennis-court-show.png"} />
				<ColorPicker additionalOptions={true} noColor={true}  label="tennis" onChange={onChange} type={type} cc2="#ffffff" cc="#055739" />
			</div>	
			}

			{!isBasketball &&  <h4 style={{textAlign:'center', color: '#007ABA',cursor:'pointer', marginBottom:0, width:'100%'}} onClick={showMoreHandler}>{!showMore ? 'SHOW MORE' : 'SHOW LESS'}</h4> }	
			
			{showPickleballSelector && 
	
				<div className="select-pickleball select">
					<img onClick={onClickCustom} data-pos={1} data-value={1} src={lines[1] === 1 ? "/static/assets/images/pickleball-court-notext-full.svg" : "/static/assets/images/pickleball-court-notext.svg"} alt="pickleball" title="Pickleball" />
					{!isMultisport && <img onClick={onClickCustom} data-pos={1} data-value={2} src={lines[1] === 2 ? "/static/assets/images/two-pickleball-courts-notext-full.svg" : "/static/assets/images/two-pickleball-courts-notext.svg"} alt="pickleball" title="Two pickleball courts" />}
				</div>
			}

			{
				showBasketballSelector && 
				<div className="select-basketball select">
						<img src="/static/assets/images/basketball-court-bg.png" alt="bg" className="basketball-court-bg" />
						
						{!excludePositions[0] && <img className="bl-left" onClick={onClickBasketball} data-pos={0}  src={basketballLines[0] === 0 ? "/static/assets/images/basketball-lines-left.png" : "/static/assets/images/basketball-lines-left-full.png"} alt="basketball line" title="Basketball line" /> }
						{!excludePositions[1] && <img style={excludePositions[1] ? {left:'50%'} : {}}className="bl-top" onClick={onClickBasketball} data-pos={1} src={basketballLines[1] === 0 ? "/static/assets/images/basketball-lines-top.png" : "/static/assets/images/basketball-lines-top-full.png"} alt="basketball line" title="Basketball line" /> }
						{!excludePositions[2] && <img className="bl-right" onClick={onClickBasketball} data-pos={2}  src={basketballLines[2] === 0 ? "/static/assets/images/basketball-lines-right.png" : "/static/assets/images/basketball-lines-right-full.png"} alt="basketball line" title="Basketball line" /> }
						{!excludePositions[3] && 
						<img className="bl-top-middle" onClick={onClickBasketball} data-pos={3} src={basketballLines[3] === 0 ? "/static/assets/images/basketball-lines-top.png" : "/static/assets/images/basketball-lines-top-full.png"} alt="basketball line" title="Basketball line" /> }

						{!excludePositions[4] && 
						<img className="bl-bottom-middle" onClick={onClickBasketball} data-pos={4}  src={basketballLines[4] === 0 ? "/static/assets/images/basketball-lines-bottom.png" : "/static/assets/images/basketball-lines-bottom-full.png"} alt="basketball line" title="Basketball line" /> }

				</div>				
			}
		</div>
	)
}

