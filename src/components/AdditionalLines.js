import React, { useState, useEffect, useRef } from "react";
import ColorPicker from "./ColorPicker";
import hexToRgb from "../helpers/hexToRgb";
import { renderBasketball, removeBasketball } from "../renderBasketball";
import { renderPickleball, renderTwoPickleBallCourts, removePickleballFromScreen } from "../renderPickleball";

export default function AdditionalLines({defaultWidth, defaultLength, basketballLines, setBasketballLines, type}){
	let [ lines, setLines ] = useState([0,0]);
	let [ showPickleballSelector, setShowPickleballSelector ] = useState(false);
	let [ showBasketballSelector, setShoBasketballSelector ] = useState(false);

	let handler = useRef(null)
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
					let _children = children[i].children.filter(x => x._id = 'lineBasketball')

					_children.forEach(x =>{
						if(x.name !== 'surfaceBasketball') x.material.color = hexToRgb(color)
					})
				}
			}else{

				for(let i = 0; i < children.length; i++){
					let _children = children[i].children.filter(x => x._id = 'lineBasketball')


					_children.forEach(x =>{
						if(x.name === 'surfaceBasketball') {
							x.material.color = hexToRgb(color)
							x.material.transparent = false;
							x.material.opacity = 1;
						}
					})
				}
			}
		}else{
			let children = window.scene.children.filter(x => x._id === 'pickleballGroup')

			console.log(children)
			if(!children) return;

			if(type === 'lines'){
				for(let i = 0; i < children.length; i++){
					let _children = children[i].children.filter(x => x._id = 'linePickleball')

					_children.forEach(x =>{
						if(x.name !== 'surfacePickleball') x.material.color = hexToRgb(color)
					})
				}
			}else{
				for(let i = 0; i < children.length; i++){
					let _children = children[i].children.filter(x => x._id = 'linePickleball')


					_children.forEach(x =>{
						if(x.name === 'surfacePickleball') {
							x.material.color = hexToRgb(color)
							x.material.transparent = false;
							x.material.opacity = 1;
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

	return(
		<div className="img-cont left-right">
			<div className="lines-colorpicker-container">
				<img onClick={onClickBasketball} data-pos={-1} src={basketballLines.includes(1) ? "/static/assets/images/basketball-court-full.svg" : "/static/assets/images/basketball-court.svg"} title="Basketball" alt="basketball" />
				<ColorPicker additionalOptions={true} label="basketball" onChange={onChange} type={type} cc2="#ffffff" cc="#055739" />
			</div>

			<div className="lines-colorpicker-container">
				{renderImage()}
				<ColorPicker additionalOptions={true} label="pickleball" onChange={onChange} type={type} cc2="#ffffff" cc="#055739" />
			</div>

			{showPickleballSelector && 
				<div className="select-pickleball select">
					<img onClick={onClickCustom} data-pos={1} data-value={1} src={lines[1] === 1 ? "/static/assets/images/pickleball-court-notext-full.svg" : "/static/assets/images/pickleball-court-notext.svg"} alt="pickleball" title="Pickleball" />
					<img onClick={onClickCustom} data-pos={1} data-value={2} src={lines[1] === 2 ? "/static/assets/images/two-pickleball-courts-notext-full.svg" : "/static/assets/images/two-pickleball-courts-notext.svg"} alt="pickleball" title="Two pickleball courts" />
				</div>
			}

			{
				showBasketballSelector && 
				<div className="select-basketball select">
						<img src="/static/assets/images/tennis-court-full.png" alt="bg" className="basketball-court-bg" />
						<img className="bl-left" onClick={onClickBasketball} data-pos={0}  src={basketballLines[0] === 0 ? "/static/assets/images/basketball-lines-left.png" : "/static/assets/images/basketball-lines-left-full.png"} alt="basketball line" title="Basketball line" />
						<img className="bl-top" onClick={onClickBasketball} data-pos={1} src={basketballLines[1] === 0 ? "/static/assets/images/basketball-lines-top.png" : "/static/assets/images/basketball-lines-top-full.png"} alt="basketball line" title="Basketball line" />
						<img className="bl-right" onClick={onClickBasketball} data-pos={2}  src={basketballLines[2] === 0 ? "/static/assets/images/basketball-lines-right.png" : "/static/assets/images/basketball-lines-right-full.png"} alt="basketball line" title="Basketball line" />
						<img className="bl-top-middle" onClick={onClickBasketball} data-pos={3} src={basketballLines[3] === 0 ? "/static/assets/images/basketball-lines-top.png" : "/static/assets/images/basketball-lines-top-full.png"} alt="basketball line" title="Basketball line" />
						<img className="bl-bottom-middle" onClick={onClickBasketball} data-pos={4}  src={basketballLines[4] === 0 ? "/static/assets/images/basketball-lines-bottom.png" : "/static/assets/images/basketball-lines-bottom-full.png"} alt="basketball line" title="Basketball line" />
				</div>				
			}
		</div>
	)
}

