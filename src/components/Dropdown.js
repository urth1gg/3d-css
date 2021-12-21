import React, { useState } from "react";

export default function Dropdown({parentEffect}){

	let [ showOptions, setShowOptions ] = useState(false)
	let [ current, setCurrent ] = useState('Laykold acrylic coating')

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
				<p className="options--select options--select-first" onClick={() => onClick('Laykold acrylic coating')}>Laykold acrylic coating</p>
				<p className="options--select" onClick={() => onClick('VersaCourt sport tile system')}>VersaCourt sport tile system</p>
				</>
			}
		</div>
	)
}