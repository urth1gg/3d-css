import React, { useState } from "react";

export default function Dropdown({parentEffect}){

	let [ showOptions, setShowOptions ] = useState(false)
	let [ current, setCurrent ] = useState('Laykold (Acrylic Coating) 🎨')

	function handleOptions(){
		setShowOptions(!showOptions)
	}

	function onClick(value){
		setCurrent(value)
		parentEffect(value)
	}

	return(
		<div className={showOptions ? 'type type--visible' : 'type'} onClick={handleOptions}>
			<p className="options--show">{current}</p>

			{showOptions && <>
				<p className="options--select options--select-first" onClick={() => onClick('Laykold (Acrylic Coating) 🎨')}>Laykold (Acrylic Coating) 🎨</p>
				<p className="options--select" onClick={() => onClick('VersaCourt (Sport Tile) 🧩')}>VersaCourt (Sport Tile) 🧩</p>
				</>
			}
		</div>
	)
}