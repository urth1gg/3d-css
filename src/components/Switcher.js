import React, { useState, useEffect, useRef } from "react";
import { renderHoop, renderNet, changeHoopPositions } from "../render3DElements";
import { renderMiddleLine } from "../renderBasketball";

function Switcher({name, imgName, width, length, hoopsDefault, excludePositions, isBasketball}){

	let [ checked, setChecked ] = useState(false)
	let [ hoops, setHoops ] = useState([0,0,0,0,0])
	let [ showSelect, setShowSelect ] = useState(false)

	let handler = useRef(null)

	function close(e){
		let el = document.querySelector(".select-hoops");

		if(el.contains(e.target) || e.target.tagName === 'INPUT') return false;

		setShowSelect(false)
		window.removeEventListener('click', handler.current)
	}

	function onChange(e){
		if(!showSelect){
			setShowSelect(true)
		}else{
			setShowSelect(false)
		}
	}

	function onClickHoops(e){
		let pos = e.target.dataset.pos;

		let _hoops = [ ...hoops ];

		if(_hoops[pos] === 0){
			_hoops[pos] = 1;
		}else{
			_hoops[pos] = 0;
		}

		if(hoops[0] === 1 && isBasketball){
			let offsetZ = 13.57
			let offsetX = length/2 - 39.2

			renderMiddleLine(width,length, offsetX, offsetZ)
		}else if(hoops[0] === 0 && isBasketball){
			window.scene.children = window.scene.children.filter(x => x.name !== 'middleLine')
		}
		setHoops([..._hoops]);
	}

	function switcherImgHandler(){
		if(!checked) return;

		setShowSelect(true)
	}

	useEffect( () => {

		if(!handler.current) handler.current = close;

		if(showSelect){
			window.addEventListener("click", handler.current)
		}
	}, [showSelect])

	useEffect(() => {
		if(hoops.some(x => x === 1)){
			setChecked(true)
		}

		if(hoops.every(x => x === 0)){
			setChecked(false)
		}
		renderHoop(hoops, width, length)
	}, [hoops])

	useEffect( () => {
		if(!hoopsDefault) return;
		setHoops([...hoopsDefault])
	}, [])

	useEffect( () => {
		changeHoopPositions(width,length)
	}, [width, length])
	return(
		<>
		<span>{name}</span>
			<label className="switch">
			  <input type="checkbox" checked={checked} onChange={onChange} />
			  <span className="slider round"></span>
			</label>
		<img src={checked ? `/static/assets/images/${imgName}-full.svg` : `/static/assets/images/${imgName}.svg`} onClick={switcherImgHandler} style={{cursor:'pointer'}}/>
		{showSelect && <div className="select-hoops select"> 
			<img src="/static/assets/images/tennis-court-full.png" className="bg-img-hoops" />
			<div className="circular-position">

				{!excludePositions[0] && <img 
					className="img-select top" 
					src={hoops[0] === 0 ? "/static/assets/images/top-board-noborder-check.png" : "/static/assets/images/top-board-noborder-full-check.png"} 
					onClick={onClickHoops} 
					data-pos={0} 
					style={excludePositions[3] ? {left: '50%'}: {}}
				/>}
				{!excludePositions[3] && <img className="img-select top-middle" src={hoops[3] === 0 ? "/static/assets/images/top-board-noborder-check.png" : "/static/assets/images/top-board-noborder-full-check.png"} onClick={onClickHoops} data-pos={3} /> }

				{!excludePositions[1] && <img className="img-select left" src={hoops[1] === 0 ? "/static/assets/images/top-board-noborder-check.png" : "/static/assets/images/top-board-noborder-full-check.png"} onClick={onClickHoops} data-pos={1} /> }
				{!excludePositions[2] && <img className="img-select right" src={hoops[2] === 0 ? "/static/assets/images/top-board-noborder-check.png" : "/static/assets/images/top-board-noborder-full-check.png"} onClick={onClickHoops} data-pos={2} />}

				{!excludePositions[4] && <img className="img-select bottom-middle" src={hoops[4] === 0 ? "/static/assets/images/top-board-noborder-check.png" : "/static/assets/images/top-board-noborder-full-check.png"} onClick={onClickHoops} data-pos={4} />}
			</div>
		</div>}
		</>
	)
}

function SwitcherNet({name,imgName, defaultState}){
	let [ nets, setNets ] = useState([0,0])
	let [ checked, setChecked ] = useState(false)
	let [ showSelect, setShowSelect ] = useState(false)

	let handler = useRef(null)


	useEffect( () => {
		setNets([...defaultState])
	}, [defaultState])
	function close(e){
		let el = document.querySelector(".select-nets")

		if(el.contains(e.target) || e.target.tagName === 'INPUT') return false;

		setShowSelect(false)
		window.removeEventListener('click', handler.current)
	}
	function onChange(e){
		if(!showSelect){
			setShowSelect(true)
		}else{
			setShowSelect(false)
		}
	}

	function switcherImgHandler(){
		if(checked){
			setShowSelect(true)
		}
	}

	function onClickNets(e){
		let pos = e.target.dataset.pos;

		let _nets = [ 0,0 ];

		_nets[pos] = nets[pos]
		
		if(_nets[pos] === 0){
			_nets[pos] = 1;
		}else{
			_nets[pos] = 0;
		}

		setNets([..._nets]);
	}

	useEffect( () => {

		if(!handler.current) handler.current = close;

		if(showSelect){
			window.addEventListener("click", handler.current)
		}
	}, [showSelect])



	useEffect(() => {

		if(nets.some(x => x === 1)){
			setChecked(true)
		}

		if(nets.every(x => x === 0)){
			setChecked(false)
		}
		renderNet(nets)
	}, [nets])
	return(
		<>
		<span>{name}</span>
			<label className="switch">
			  <input type="checkbox" checked={checked} onChange={onChange} />
			  <span className="slider round"></span>
			</label>
		<img src={checked ? `/static/assets/images/${imgName}-full.svg` : `/static/assets/images/${imgName}.svg`} style={{cursor:'pointer'}} onClick={switcherImgHandler}/>
		{showSelect && <div className="select-nets select"> 
				<div className="img-cont left-right">
					<img title="Tennis" alt="pickleball" className="img-select" src={nets[0] === 0 ? "/static/assets/images/tennis.png" : "/static/assets/images/tennis-full.png"} onClick={onClickNets} data-pos={0} />
					<img title="Pickleball" alt="pickleball" className="img-select" src={nets[1] === 0 ? "/static/assets/images/pickleball.png" : "/static/assets/images/pickleball-full.png"} onClick={onClickNets} data-pos={1} />
				</div>
		</div>}
		</>
	)
}

export { SwitcherNet, Switcher }