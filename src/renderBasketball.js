import * as THREE from "three";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { extend } from "@react-three/fiber";
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils';


function generateLinesColor(){
	return document.querySelector("input#basketball_lines") ? document.querySelector("input#basketball_lines").value : document.querySelector("input#basketball_line")
}
export function renderBasketballDefault(defaultWidth, defaultLength){
	let w = defaultWidth;
	let l = defaultLength;

	if(!window.scene) return;

	renderBasketball('right', w, l)
	renderBasketball('left', w, l)
	renderBorderAndSurface(w,l, true)
}

function renderHalfLineBasketball(w, l){
	const group = new THREE.Group();

	const points = []

	points.push( 0, 0.01, 0 )
	points.push( 0,0.01, 5 )
	
	const geometry = new LineGeometry();
	geometry.setPositions( points );

	let linesColor = generateLinesColor()

	let material = generateLinesMaterial();

	let line = new Line2( geometry, material );

	line._id = "lineBasketball";

	group.add(line)

	window.scene.add(group)
}

function removeExistingBorderAndSurface(){
	let prevBorder;
	let prevSurface;
	
	if(window.scene.children.filter(x => x._id === 'surface').length !== 0){
		prevSurface = window.scene.children.filter(x => x._id === 'surface')[0]
		window.scene.children = window.scene.children.filter(x => x._id !== 'surface')
	}

	if(window.scene.children.filter(x => x._id === 'border').length !== 0){
		prevBorder = window.scene.children.filter(x => x._id === 'border')[0]
		window.scene.children = window.scene.children.filter(x => x._id !== 'border')
	}

	return [prevSurface, prevBorder]
}
export function renderBorderAndSurface(w,l, init){


	let [ prevSurface, prevBorder ] = removeExistingBorderAndSurface();

	const backgroundGeometry = new THREE.PlaneGeometry(w, l);
	const borderGeometry = new THREE.PlaneGeometry(w + 2, l + 2 )
	if(init){
		
		let surfaceColor = document.querySelector("input#surface") ? document.querySelector("input#surface").value : 0Xf49e23;

		const backgroundMaterial = new THREE.MeshStandardMaterial( {color: surfaceColor, side: THREE.DoubleSide, reflectivity: 1} );
		const surface = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
		surface.rotation.set( Math.PI / 2, 0, Math.PI / 2 );
		surface.position.set(39.2,-0.02,-13.57)
		surface._id = 'surface';
		surface.name = "surface";

		window.scene.add(surface)
	}else{
		const backgroundMaterial = prevSurface.material;
		
		const surface = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
		surface.rotation.set( Math.PI / 2, 0, Math.PI / 2 );
		surface.position.set(39.2,-0.02,-13.57)
		surface._id = 'surface';
		surface.name = 'surface';
		
		window.scene.add(surface)
		if(prevBorder){
			const borderMaterial = prevBorder.material

			const border = new THREE.Mesh ( borderGeometry, borderMaterial);
			border.rotation.set( Math.PI / 2, 0, Math.PI / 2);
			border.position.set(39.2, -0.03, -13.57);
			border.name = 'border'
			border._id = "border"
			window.scene.add(border)
		}

	}
}

export function renderBasketball(position, w, l){
	if(!window.scene) return;

	switch (position){
		case 'right':
			renderLinesRight(window.scene, w,l)
			break;
		case 'left':
			renderLinesLeft(window.scene, w,l)
			break;
		case 'top':
			renderLinesTop(window.scene, w,l)
			break;
		case 'top-middle':
			renderLinesTopMiddle(window.scene, w,l)
			break;
		case 'bottom-middle':
			renderLinesBottomMiddle(window.scene, w,l)
			break;
	}

}

export function removeBasketball(position){
	if(!window.scene) return;

	if(position === 'removeEverything'){
		removeLinesRight(window.scene)
		removeLinesLeft(window.scene)
		removeLinesTop(window.scene)
		removeLinesBottomMiddle(window.scene)
		removeLinesTopMiddle(window.scene)
		return 
	}
	switch (position){
		case 'right':
			removeLinesRight(window.scene)
			break;
		case 'left':
			removeLinesLeft(window.scene)
			break;
		case 'top':
			removeLinesTop(window.scene)
			break;
		case 'top-middle':
			removeLinesTopMiddle(window.scene)
			break;
		case 'bottom-middle':
			removeLinesBottomMiddle(window.scene)
			break;
	}
}

export function changeBasketballLinesPositions(positions, w,l){

	let arr = [];

	let map = {
		0: 'basketballLinesLeft',
		1: 'basketballLinesTop',
		2: 'basketballLinesRight',
		3: 'basketballLinesTopMiddle',
		4: 'basketballLinesBottomMiddle'
	}

	positions.forEach((x,i) =>{
		if(x === 1){
			arr.push(map[i])
		}
	})

	arr.forEach(x => {
		let el = window.scene.children.filter(y => y.name === x)[0]

		switch(x){
			case 'basketballLinesLeft':
				el.position.x = -((l-78)/2)+0.2
				break;
			case 'basketballLinesTop':
				el.position.z = -(27+((w-27)/2))+0.2
				break;
			case 'basketballLinesRight':
				el.position.x = l - ((l-78)/2)
				break;
			case 'basketballLinesTopMiddle':
				el.position.z = -(27+((w-27)/2))+0.2
				break;
			case 'basketballLinesBottomMiddle':
				el.position.z = (w/2)-(27.75/2);
				break;
			default:
				return false
				break;
		}
	})
}

function generateLinesMaterial(lw){
	let material;

	let linesColor = generateLinesColor();

	if(linesColor !== "false"){
		material = new LineMaterial({ color: linesColor, linewidth: lw || 0.0015})
	}else{
      material = new LineMaterial( { color: 0xffffff, linewidth: lw || 0.0015});
	}

	return material
}
function removeLinesRight(scene){
	scene.children = scene.children.filter(x => x.name !== 'basketballLinesRight')
}

function removeLinesTop(scene){
	scene.children = scene.children.filter(x => x.name !== 'basketballLinesTop')
}

function removeLinesTopMiddle(scene){
	scene.children = scene.children.filter(x => x.name !== 'basketballLinesTopMiddle')
}

function removeLinesBottomMiddle(scene){
	scene.children = scene.children.filter(x => x.name !== 'basketballLinesBottomMiddle')
}

function removeLinesLeft(scene){
	scene.children = scene.children.filter(x => x.name !== 'basketballLinesLeft')
}

function generateBasketballLinePoints(points){
	points.push( 19, 0, -13 )
	points.push( 19, 0, -3 )
}
function renderLinesLeft(scene, width, length){
	if(scene.children.filter(x => x.name === 'basketballLinesLeft').length !== 0) return;

	const group = new THREE.Group();

	const points = []

	generateBasketballLinePoints(points)

	const geometry = new LineGeometry();
	geometry.setPositions( points );

	let material = generateLinesMaterial()

	let line = new Line2( geometry, material );

	line._id = "lineBasketball";

	group.add(line)

	//drawCircle(3,'#ffffff', 0.0015, group)
	renderHoopBackground(group)
	drawFreeThrowCircle(5, '#ffffff', 0.0015, group)
	drawSideLinesBottom(group);
	drawSideLinesTop(group);
	drawThreePointer(group, width, length);
	drawHashTop(group);
	drawHashBottom(group);
	drawBaseLine(group);

	group._id = "basketballGroup";
	group.name = "basketballLinesLeft"
	group.position.set(-((length-78)/2)+0.2,0.04,-5.50)

	scene.add(group)
}

function renderLinesTop(scene, width,length){
	if(scene.children.filter(x => x.name === 'basketballLinesTop').length !== 0) return;
	const group = new THREE.Group();

	const points = []

	generateBasketballLinePoints(points)
	
	const geometry = new LineGeometry();
	geometry.setPositions( points );

	let linesColor = generateLinesColor();

	let material = generateLinesMaterial();

	let line = new Line2( geometry, material );

	line._id = "lineBasketball";

	group.add(line)

	//drawCircle(3,'#ffffff', 0.0015, group)
	renderHoopBackground(group)
	drawFreeThrowCircle(5, '#ffffff', 0.0015, group)
	drawSideLinesBottom(group);
	drawSideLinesTop(group);
	drawThreePointer(group, width, length);
	drawHashTop(group);
	drawHashBottom(group);
	drawBaseLine(group);

	group._id = "basketballGroup";
	group.name = "basketballLinesTop"

	group.position.set(30.8,0.04,-(27+((width-27)/2)+0.2));
	group.rotation.set( 0, -Math.PI / 2,0)

	scene.add(group)
}

function renderLinesRight(scene, width, length){
	if(scene.children.filter(x => x.name === 'basketballLinesRight').length !== 0) return;

	const group = new THREE.Group();

	const points = []

	generateBasketballLinePoints(points)
	
	const geometry = new LineGeometry();
	geometry.setPositions( points );

	let material = generateLinesMaterial()
	let line = new Line2( geometry, material );

	line._id = "lineBasketball";

	group.add(line)

	//drawCircle(3,'#ffffff', 0.0015, group)
	renderHoopBackground(group)
	drawFreeThrowCircle(5, '#ffffff', 0.0015, group)
	drawSideLinesBottom(group);
	drawSideLinesTop(group);
	drawThreePointer(group, width, length);
	drawHashTop(group);
	drawHashBottom(group);
	drawBaseLine(group);

	group._id = "basketballGroup";
	group.name = "basketballLinesRight"

	group.position.set( length - ((length-78)/2),0.04,-21.8)
	group.rotation.set(0,Math.PI / 2 * 2, 0)

	scene.add(group)
}

function renderLinesTopMiddle(scene, width,length){

	if(scene.children.filter(x => x.name === 'basketballLinesTopMiddle').length !== 0) return;

	const group = new THREE.Group();

	const points = []

	generateBasketballLinePoints(points)
	
	const geometry = new LineGeometry();
	geometry.setPositions( points );


	let material = generateLinesMaterial();

	let line = new Line2( geometry, material );

	line._id = "lineBasketball";

	group.add(line)

	//drawCircle(3,'#ffffff', 0.0015, group)
	renderHoopBackground(group)
	drawFreeThrowCircle(5, '#ffffff', 0.0015, group)
	drawSideLinesBottom(group);
	drawSideLinesTop(group);
	drawThreePointer(group, width, length);
	drawHashTop(group);
	drawHashBottom(group);
	drawBaseLine(group);

	group._id = "basketballGroup";
	group.name = "basketballLinesTopMiddle"

	group.position.set(61.4,0.04,-(27+((width-27)/2)+0.2))
	group.rotation.set( 0, -Math.PI / 2,0)

	scene.add(group);
}

function renderLinesBottomMiddle(scene, width, length){
	if(scene.children.filter(x => x.name === 'basketballLinesBottomMiddle').length !== 0) return;
	const group = new THREE.Group();

	const points = []

	generateBasketballLinePoints(points)
	
	const geometry = new LineGeometry();
	geometry.setPositions( points );

	let material = generateLinesMaterial();

	let line = new Line2( geometry, material );

	line._id = "lineBasketball";

	group.add(line)

	//drawCircle(3,'#ffffff', 0.0015, group)
	renderHoopBackground(group)
	drawFreeThrowCircle(5, '#ffffff', 0.0015, group)
	drawSideLinesBottom(group);
	drawSideLinesTop(group);
	drawThreePointer(group, width, length);
	drawHashTop(group);
	drawHashBottom(group);
	drawBaseLine(group);

	group._id = "basketballGroup";
	group.name = "basketballLinesBottomMiddle"

	group.position.set(77.6,0.04, (width/2)-(27.75/2) + 0.2)
	group.rotation.set(0, -Math.PI / 2 * 3, 0)

	scene.add(group)


}

function renderHoopBackground(group){
		const geometryPlane = new THREE.PlaneGeometry(9.9,18.7)
		const geometryCircle = new THREE.CircleGeometry(5,50)


		let colorSurface = document.querySelector("input#basketball_surface") ? document.querySelector("input#basketball_surface").value : document.querySelector("input#basketball_surface").value;

		console.log(colorSurface)

		console.log('basketball')
		let _material;
		let materialCircle;


		if(colorSurface !== "false"){
			_material = new THREE.MeshStandardMaterial( {color: colorSurface, side: THREE.DoubleSide} )
			materialCircle = new THREE.MeshStandardMaterial( {color: colorSurface, side: THREE.DoubleSide} )
		}else{
			_material = new THREE.MeshStandardMaterial( {color: 0x283765, opacity:0, transparent: true, side: THREE.DoubleSide} );
			materialCircle = new THREE.MeshStandardMaterial( {color: 0x283765, opacity:0, transparent: true, side: THREE.DoubleSide} );
		}

		const meshPlane = new THREE.Mesh(geometryPlane, _material)
		meshPlane.rotation.set(Math.PI / 2, 0, Math.PI / 2)
		meshPlane.position.set(9.25,-0.03,-8)


		let circle = new THREE.Mesh(geometryCircle, materialCircle);

		circle.rotation.set(Math.PI / 2, 0,0)
		circle.position.set(19.12,-0.03,-8)

		group.add(meshPlane)
		group.add(circle)

		meshPlane.name = "surfaceBasketball"
		circle.name = "surfaceBasketball"


}
function drawCircle(radius, color, lineWidth, group){
    
	color = generateLinesColor();

    let points = [];
      
    // 360 full circle will be drawn clockwise
    for(let i = 0; i <= 180; i++){
        points.push(Math.sin(i*(Math.PI/180))*radius,0, Math.cos(i*(Math.PI/180))*radius);
    }
      
    let geometry = new LineGeometry();
    geometry.setPositions( points );
  
    let material = new LineMaterial({
        color: color,
        linewidth: lineWidth
    });
      
    let line = new Line2( geometry, material );
    line._id = "lineBasketball"
    
    line.position.set(4,0.04,-8)
    group.add( line );
}

function drawFreeThrowCircle(radius, color, lineWidth, group){
    let points = [];
    let points2 = [];

	color = generateLinesColor()

    // 360 full circle will be drawn clockwise
    for(let i = 0; i <= 180; i++){
        points.push(Math.sin(i*(Math.PI/180))*radius,0, Math.cos(i*(Math.PI/180))*radius);
    }

    for(let i = 0; i >= -180; i--){
        points2.push(Math.sin(i*(Math.PI/180))*radius,0, Math.cos(i*(Math.PI/180))*radius);
    }

    let geometry = new LineGeometry();
    let geometry2 = new LineGeometry();

    geometry.setPositions( points );
    geometry2.setPositions(points2)
  
    let material = new LineMaterial({
        color: color,
        linewidth: lineWidth,
    });

    let material_dot = new LineMaterial({
    	color: color,
    	linewidth: lineWidth,
    	dashed: true,
    	gapSize: 1.24,
    	dashSize:0.71
    })
      
    let line = new Line2( geometry, material );
    let line2 = new Line2(geometry2, material_dot);
    line2.computeLineDistances();
    
    line.position.set(19.05,0.04,-8)
    line2.position.set(19.05,0.04,-8)

    line._id = "lineBasketball"
    line2._id = "lineBasketball"

    group.add( line );
    //group.add( line2 );
}

function drawSideLinesBottom(group){
	let points = [];


	points.push(0,0, -3)
	points.push(19,0,-3);

	let geometry = new LineGeometry()
	geometry.setPositions(points);

	let material = generateLinesMaterial()

	let line = new Line2(geometry, material);
	line._id = "lineBasketball"

	line.position.y = 0.04
	group.add(line)
}

function drawSideLinesTop(group){
	let points = [];


	points.push(0,0, -13)
	points.push(19,0,-13);

	let geometry = new LineGeometry()
	geometry.setPositions(points);

	let material = generateLinesMaterial()

	let line = new Line2(geometry, material);
    line._id = "lineBasketball"

    line.position.y = 0.04
	group.add(line)
}

function drawThreePointerLineTop(group, w, l){
	let points = [];

	w = 50;
	points.push(0,0, -8 + (w/2) - 5)
	points.push(14,0, -8 + (w/2) - 5);

	let geometry = new LineGeometry();

	geometry.setPositions(points);

	let material = generateLinesMaterial();
	let line = new Line2(geometry, material);
    line._id = "lineBasketball"

	group.add(line)
}

function drawThreePointerLineBottom(group, w, l){
	let points = [];


	w = 50
	points.push(0,0, -8 - (w/2) + 5)
	points.push(14,0, -8 - (w/2) + 5);

	let geometry = new LineGeometry();

	geometry.setPositions(points);

	let material = generateLinesMaterial();

	let line = new Line2(geometry, material);
    line._id = "lineBasketball"
	group.add(line)	

}

function drawThreePointer(group, width, length){

	window.scene.children = window.scene.children.filter(x => x.name !== 'threePointerLine')
	drawThreePointerLineTop(group, width, length);
	drawThreePointerLineBottom(group, width, length);

    let points = [];

    // 360 full circle will be drawn clockwise
    for(let i = 0; i <= 180; i++){
        points.push(Math.sin(i*(Math.PI/180))*14,0, Math.cos(i*(Math.PI/180))*20);
    }	

	let geometry = new LineGeometry();

	geometry.setPositions(points);

	let material = generateLinesMaterial()

	let line = new Line2(geometry, material);

    line._id = "lineBasketball"
	line.position.set(14,0, -8)
	group.name = "threePointerLine"
	group.add(line)	

/*	let pointz = [];

	pointz.push(0,0,-8);
	pointz.push(27.75,0,-8)

	let _g = new LineGeometry();

	_g.setPositions(pointz);

	let _l = new Line2(_g, material );
	_l.position.set(0,0,0)
	group.add( _l)*/
	
}

function drawHashTop(group){

	let points = [];
	let geometry = new LineGeometry();

	let material = generateLinesMaterial()
	let line = new Line2(geometry, material);


	let linesColor = generateLinesColor();

	const backgroundGeometry = new THREE.PlaneGeometry(1.2, 1.2);
	const backgroundMaterial = new THREE.MeshBasicMaterial( {color: linesColor, side: THREE.DoubleSide, reflectivity: 1} );
	const surface = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
	surface.rotation.set( Math.PI / 2, 0, Math.PI / 2 );
	surface.position.set(7.2,0,-2.5)

	surface.name = 'lineBasketball';

	group.add(surface)

	points = [];

	points.push(11,0,-3);
	points.push(11,0,-2);

	geometry = new LineGeometry();

	geometry.setPositions(points);

	line = new Line2(geometry, material) 
	line._id = "lineBasketball"

	group.add( line )

	points = [];

	points.push(14,0,-3);
	points.push(14,0,-2);

	geometry = new LineGeometry();

	geometry.setPositions(points);

	line = new Line2(geometry, material) 
	line._id = "lineBasketball"

	group.add( line )
}

function drawHashBottom(group){

	let points = [];

	points.push(7,0,-13);
	points.push(7,0, -14);

	let geometry = new LineGeometry();

	geometry.setPositions(points);

	let material = generateLinesMaterial()

	let line = new Line2(geometry, material);
	line._id = "lineBasketball"
	//group.add(line)	

	let _points = [];

	_points.push(8,0,-13);
	_points.push(8,0,-14);

	geometry = new LineGeometry();

	geometry.setPositions(_points);

	line = new Line2(geometry, material);
	line._id = "lineBasketball"

	//group.add( line )


	let linesColor = generateLinesColor()

	const backgroundGeometry = new THREE.PlaneGeometry(1.2, 1.2);
	const backgroundMaterial = new THREE.MeshStandardMaterial( {color: linesColor, side: THREE.DoubleSide, reflectivity: 1} );
	const surface = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
	surface.rotation.set( Math.PI / 2, 0, Math.PI / 2 );
	surface.position.set(7.2,0,-13.5)

	surface.name = 'lineBasketball';

	group.add(surface)

	points = [];

	points.push(11,0,-13);
	points.push(11,0,-14);

	geometry = new LineGeometry();

	geometry.setPositions(points);

	line = new Line2(geometry, material);
	line._id = "lineBasketball"
	line.name = "lineBasketball"

	group.add( line )

	points = [];

	points.push(14,0,-13);
	points.push(14,0,-14);

	geometry = new LineGeometry();

	geometry.setPositions(points);

	line = new Line2(geometry, material);
	line._id = "lineBasketball"
	line.name = "lineBasketball"

	group.add( line )
}

function drawBaseLine(group){
	let points = [];
	let w = 50
	points.push(0,0,-8 + (w/2) - 5);
	points.push(0,0,-8 - (w/2) + 5);

	let geometry = new LineGeometry();

	let material = generateLinesMaterial()

	geometry.setPositions(points);

	let line = new Line2(geometry, material);
	line._id = "lineBasketball"

	group.add( line )
}

function renderOutsideLines(w,l, group, init, shouldRenderMiddlePart, color){
	let points = [];

	let offsetZ = 13.57
	let offsetX = l/2 - 39.2
	
	points.push(-offsetX,0.01,(+w/2) - offsetZ);
	points.push(-offsetX,0.01,(-w/2) - offsetZ);

	let geometry = new LineGeometry();

	let material = generateLinesMaterial()

	if(color){
		material.color = color;
	}
	geometry.setPositions(points);

	let line = new Line2(geometry, material);
	line.name = "lineBasketball"

	group.add( line )

	points = [];

	points.push(-offsetX, 0.01, (+w/2) - offsetZ)
	points.push(l - offsetX, 0.01, (+w/2) - offsetZ)
	geometry = new LineGeometry()
	geometry.setPositions(points)

	group.add(new Line2(geometry, material))

	points = [];

	points.push(l-offsetX,0.01,(+w/2) - offsetZ);
	points.push(l-offsetX,0.01,(-w/2) - offsetZ);
	geometry = new LineGeometry()
	geometry.setPositions(points)

	group.add(new Line2(geometry, material))

	points = [];

	points.push(-offsetX, 0.01, (-w/2) - offsetZ + 0.25)
	points.push(l - offsetX, 0.01, (-w/2) - offsetZ + 0.25)
	geometry = new LineGeometry()
	geometry.setPositions(points)

	group.add(new Line2(geometry, material))

	if(init || shouldRenderMiddlePart){
		renderMiddleLine(w,l,offsetX,offsetZ, color)
	}
}

export function renderMiddleLine(w,l, offsetX, offsetZ, color){
	let group = new THREE.Group();
	let material = generateLinesMaterial();
	if(color) material.color = color
	let points;
	let geometry;

	group.name = "middleLine"
	points = [];

	points.push(l/2-offsetX, 0.01, (-w/2) - offsetZ + 0.25)
	points.push(l/2 - offsetX, 0.01, (+w/2) - offsetZ + 0.25)
	geometry = new LineGeometry()
	geometry.setPositions(points)

	let middle = new Line2(geometry, material);
	middle.name = "middleLine"
	group.add(middle)

	points = []

	for(let i = 0; i <= 180; i++){
        points.push(Math.sin(i*(Math.PI/90))*5,0.01, Math.cos(i*(Math.PI/90))*5);
    }
      
    geometry = new LineGeometry();
    geometry.setPositions( points );
  
	let circle = new Line2(geometry,material)
	circle.position.x = l/2-offsetX
	circle.position.z = 0 - offsetZ
	circle.name = "middleLine"
	group.add(circle)

	window.scene.add(group)
}

export function renderBasketballLines(w,l, init, color){
	let group = new THREE.Group();

	let shouldRenderMiddlePart = window.scene.children.some(x => x.name === 'middleLine');

	window.scene.children = window.scene.children.filter(x => x.name !== 'basketballOutsideLines' && x.name !== 'middleLine')

	group.name = "basketballOutsideLines"
	renderOutsideLines(w,l, group, init, shouldRenderMiddlePart, color)

	window.scene.add(group)
	window.renderer.render(window.scene, window.camera)
}

export function renderBorder(w,l, color){

	const borderGeometry = new THREE.PlaneGeometry(w+2,l+2);
	const borderMaterial = new THREE.MeshStandardMaterial( {color: color, side: THREE.DoubleSide, reflectivity: 1} );
	const border = new THREE.Mesh ( borderGeometry, borderMaterial);
	border.rotation.set( Math.PI / 2, 0, Math.PI / 2);
	border.position.set(39.2, -0.03, -13.57);
	border._id = 'border';
	border.name = 'border';

	window.scene.add(border)
}

