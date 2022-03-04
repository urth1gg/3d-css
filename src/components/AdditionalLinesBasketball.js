import React, { useState, useEffect, useRef } from "react";
import ColorPicker from "./ColorPicker";
import hexToRgb from "../helpers/hexToRgb";
import { renderBasketballDefault, removeBasketball, renderMiddleLine, renderBasketball } from "../renderBasketball";
import { renderPickleball, renderTwoPickleBallCourts, removePickleballFromScreen } from "../renderPickleball";

export default function AdditionalLinesBB({type, excludePositions, basketballLines, setBasketballLines, defaultLength, defaultWidth}){

    let [ showBasketballSelector, setShowBasketballSelector ] = useState(false)
    let handler = useRef(null)

    function onClickBasketball(e){
        let lines = [ ...basketballLines ]
        let pos = e.target.dataset.pos

        lines[pos] = lines[pos] === 0 ? 1 : 0

        let func = lines[pos] === 0 ? removeBasketball : renderBasketball

        // if(pos === 0) func('left', defaultWidth, defaultLength)
        // if(pos === 1) func('top', defaultWidth, defaultLength)
        // if(pos === 2) func('right', defaultWidth, defaultLength)
        setBasketballLines([...lines])
    }

    function hideOnOutsideClick(e){	

		let el = document.querySelector(".select-basketball")

		if(el){
			let el = document.querySelector(".select-basketball")

			if(el.contains(e.target)) return false

			setShowBasketballSelector(false)
		}else{
			setShowBasketballSelector(false)
		}
        
        console.log('happened')

		window.removeEventListener("click", handler.current)
	}

    useEffect( () => {

        if(showBasketballSelector) {
            handler.current = hideOnOutsideClick
            window.addEventListener("click", handler.current)
        }

    }, [showBasketballSelector])

    function onClickContainer(){
        setShowBasketballSelector(!showBasketballSelector)
    }

    //Control the rendering of the basketball lines
    useEffect( () => {
        if(!window.scene) return;

        if(window.scene.children.some(x => x.name !== 'surface')) renderBasketballDefault(defaultWidth, defaultLength)
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
		if(basketballLines[1] === 0){
			renderMiddleLine(defaultWidth, defaultLength, defaultLength/2 - 39.2, 13.57)
		}else if(basketballLines[1] === 1){
			window.scene.children = window.scene.children.filter(x => x.name !== 'middleLine')
		}

		if(!window.renderer) return;
		window.renderer.render(window.scene, window.camera)

    }, [basketballLines])

    return(
		<div className="img-cont left-right">
			<div className="lines-colorpicker-container">
				<img onClick={onClickContainer} data-pos={-1} src={basketballLines.includes(1) ? "/static/assets/images/basketball-court-full.svg" : "/static/assets/images/basketball-court.svg"} title="Basketball" alt="basketball" />
			</div>

			{
				showBasketballSelector && 
				<div className="select-basketball select">
						<img src="/static/assets/images/basketball-court-bg.png" alt="bg" className="basketball-court-bg" />
						<img className="bl-left" onClick={onClickBasketball} data-pos={0}  src={basketballLines[0] === 0 ? "/static/assets/images/basketball-lines-left.png" : "/static/assets/images/basketball-lines-left-full.png"} alt="basketball line" title="Basketball line" />
						<img style={excludePositions[3] ? {left:'50%'} : {}} className="bl-top" onClick={onClickBasketball} data-pos={1} src={basketballLines[1] === 0 ? "/static/assets/images/basketball-lines-top.png" : "/static/assets/images/basketball-lines-top-full.png"} alt="basketball line" title="Basketball line" />
						<img className="bl-right" onClick={onClickBasketball} data-pos={2}  src={basketballLines[2] === 0 ? "/static/assets/images/basketball-lines-right.png" : "/static/assets/images/basketball-lines-right-full.png"} alt="basketball line" title="Basketball line" />
						{!excludePositions[3] && 
						<img className="bl-top-middle" onClick={onClickBasketball} data-pos={3} src={basketballLines[3] === 0 ? "/static/assets/images/basketball-lines-top.png" : "/static/assets/images/basketball-lines-top-full.png"} alt="basketball line" title="Basketball line" /> }

						{!excludePositions[4] && 
						<img className="bl-bottom-middle" onClick={onClickBasketball} data-pos={4}  src={basketballLines[4] === 0 ? "/static/assets/images/basketball-lines-bottom.png" : "/static/assets/images/basketball-lines-bottom-full.png"} alt="basketball line" title="Basketball line" /> }

				</div>				
			}

            {
                
            }
		</div>
    )
}