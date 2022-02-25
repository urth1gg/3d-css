import React, { useState, useEffect, useRef } from "react";
import { removeBorder } from "../renderTennis";
import { changeFencePositions } from "../render3DElements";

//((?<=(\:+\s))(\#.+(?="))) 

export default function ColorPicker({type, additionalOptions, onChange, label, addWhite, cc, cc2, noColor,w,l,name}){
	const [showColors, setShowColors ] = useState(false)
	const [ colors, setColors ] = useState([])
	const [colorNames, setColorNames] = useState([])
	const handler = useRef(null)
	const [ currentColor, _setCurrentColor ] = useState(false)
	const [ currentColorLines , _setCurrentColorLines ] = useState(false)
	const [ typeOption, changeTypeOption ] = useState('surface')

	function close(){
		setShowColors(false)
		window.removeEventListener('click', handler.current)
	}

	useEffect(() => {
		_setCurrentColor(false)
		let _colors = [];
		let _colorNames = [];

		if(type === 'Laykold acrylic coating'){
			_colors = [ 
				'#21362d',
				'#364e35',
				'#055739',
				'#436e43',
				'#303b67',
				'#0082ca',
				'#2b426d',
				'#472b67',
				'#903b38',
				'#92969e',
				'#5e1b31',
				'#907b5b',
				'#b22b25',
				'#d0112b',
				'#eb7203',
				'#fcdd00',
				'#013ca6',
				'#00748d',
				'#69ace5',
				'#2e2925',
				'#c7a900',
				'#9a989a',
				'#566c11',
				'#6c3f21',
			]


			_colorNames = [
				"Forest Green",
				"Dark Green",
				"Medium Green",
				"Grass Green",
				"Dark Blue",
				"Light Blue",
				"Pro Blue",
				"Royal Purple",
				"Brick Red",
				"Grey",
				"Burgurdy",
				"Beige",
				"Coral",
				"Scarlet",
				"Pumpkin",
				"Canary",
				"Midnight",
				"Teal",
				"Arctic",
				"Black",
				"Key Lime",
				"Silver",
				"Kiwi",
				"Mocha"
			]
		}else{
			_colors = [
				"#222222",
				"#606060",
				"#7d848d",
				"#6b323e",
				"#995c4b",
				"#283765",
				"#3b68b1",
				"#90b4dd",
				"#aeccd8",
				"#5d4e84",
				"#185d51",
				"#4a5f53",
				"#5d6c51",
				"#92a565",
				"#c2976d",
				"#cc3135",
				"#ff6632",
				"#f49e23"
			]

			_colorNames = [
				"Black",
				"Graphite",
				"Titanium",
				"Burgundy",
				"Rust Red",
				"Navy Blue",
				"Royal Blue",
				"Light Blue",
				"Ice Blue",
				"Purple",
				"Emerald Green",
				"Slate Green",
				"Olive Green",
				"Pistachio",
				"Sand",
				"Bright Red",
				"Orange",
				"Yellow"
			]
		}


		if(additionalOptions || addWhite){
			_colorNames.unshift("White")
			_colors.unshift("#ffffff")
		}

		setColors([..._colors]);
		setColorNames([..._colorNames])

		if(cc){
			let index = _colors.indexOf(cc)

			_setCurrentColor(_colors[index])
		}

		if(cc2){
			let index = _colors.indexOf(cc2)

			_setCurrentColorLines(_colors[index])
		}
	}, [type])

	function setCurrentColor(color, colorName){
		if(typeOption === 'surface'){
			_setCurrentColor(color)
			onChange(color, label, typeOption)
		}else{
			_setCurrentColorLines(color)
			onChange(color, label, typeOption)
		}

		window.renderer.render(window.scene, window.camera);
	}

	function changeTypeOptionHandler(e, typeOption){
		e.stopPropagation();
		changeTypeOption(typeOption)
	}
	useEffect( () => {

		if(!handler.current) handler.current = close;

		if(showColors){
			window.addEventListener("click", handler.current)
		}
	}, [showColors])

	return(
		<>
			<div className="image-picker" onClick={ () => setShowColors(!showColors) }>

			</div>

			<div className="colors-container-wrapper">
			{ showColors && <div className="colors-container select">
				{additionalOptions && <div className="options-colors">
					<div className={typeOption === 'surface' ? 'selected' : ''} onClick={(e) => changeTypeOptionHandler(e,'surface')}>Surface</div>
					<div className={typeOption === 'lines' ? 'selected' : ''} onClick={(e) => changeTypeOptionHandler(e,'lines')}>Lines</div>
				</div>}
				{noColor && 
					<div className="color-wrapper" onClick={() => {
						setCurrentColor('','')
					}}>
						<div className="color-container" style={{border: '1px solid black', display:'flex', justifyContent:'center', alignItems: 'center'}}>
							<i class="fas fa-ban" style={{fontSize: '55px', color: 'red'}}></i>
						</div>
						<h4 className='stroke' style={{color:'red'}}>No color</h4>
					</div>
				}
				{colors.map( (x,i,arr) => {
					return (
					<div className="color-wrapper" onClick={() => {
						setCurrentColor(x, colorNames[i])
					}} key={x}>
						<div className="color-container" style={{backgroundColor: x, border:'1px solid black'}}></div>
						<h4 className={x === '#ffffff' ? 'stroke-black' : 'stroke'} style={{color:x}}>{colorNames[i]}</h4>
					</div>
					)
				})}
			</div>}
			</div>

			<div className="picked-colors-container">
				<div id={label} data-color={currentColor ? currentColor.toString() : ''} className={currentColor ? 'visible' : 'hidden'} style={{backgroundColor: currentColor, height:'25px', width:'25px', marginTop:'15px'}}>

				</div>

				{additionalOptions && <div className={currentColorLines ? 'visible' : 'hidden'} style={{backgroundColor: currentColorLines, height:'25px', width:'25px', marginTop:'15px'}}>

				</div>}
			</div>

			<input type="hidden" id={label} value={currentColor ? currentColor.toString() : ''} />
			{ additionalOptions && <input type="hidden" id={label+"_lines"} value={currentColorLines.toString()} /> }
		</>
	)
}