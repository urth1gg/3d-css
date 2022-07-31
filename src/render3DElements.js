import * as THREE from "three"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import addSpotlight from "./helpers/addSpotlight"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js'
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js'

let hoopsPositions = {};
let ambientLight = false;
let fencesPositions = {};
let lightPositions = {};

const texture = new THREE.TextureLoader().load('/static/assets/3d/tennis_net/Textures/Net_new x4096.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.LinearFilter;

const texture2 = new THREE.TextureLoader().load('/static/assets/3d/fence5/textures/texture.png');
texture2.wrapS = THREE.RepeatWrapping;
texture2.wrapT = THREE.RepeatWrapping;
texture2.anisotropy = 32;
texture2.generateMipmaps = true;
texture2.magFilter = THREE.LinearFilter;
texture2.minFilter = THREE.LinearMipMapLinearFilter;

export function loadFence(cb){
	if(window.fence) return cb(window.fence)
	const loader = new FBXLoader()

	loader.load( '/static/assets/3d/fence5/source/ChainlinkFence.fbx', function ( fbx ) {
		fbx.traverse(child => {
			if(child.name === 'pPlane1' || child.name === 'pPlane2'){
				child.material = new THREE.MeshPhongMaterial( { map: texture2, transparent: true, opacity: 0.8 } );
			}

			if(child.isMesh){
				child.castShadow = true;
				child.receiveShadow = true;
				if(child.material.map) child.material.map.anisotropy = 16
			}
		})
		window.fence = fbx;
		cb(fbx)

	}, undefined, function ( error ) {

		console.error( error )

	} )
}

function loadHoop(cb){
	if(window.hoop) return cb(window.hoop)

	const loader = new FBXLoader()

	loader.load( '/static/assets/3d/hoop3/untitled.fbx', function ( fbx ) {
		fbx.traverse(child => {
			if(child.isMesh){
				child.castShadow = true;
				child.receiveShadow = true;
				if(child.material.map) child.material.map.anisotropy = 16
			}
		})
		window.hoop = fbx;
		cb(fbx)

	}, undefined, function ( error ) {

		console.error( error )

	} )	
}

function loadLights(cb){
	if(window.light) return cb(window.light);

	const loader = new FBXLoader()

	loader.load( '/static/assets/3d/light/untitled.fbx', function ( fbx ) {
		window.light = fbx;
		cb(fbx)

	}, undefined, function ( error ) {

		console.error( error )

	} )
}

function loadNet(cb){
	if(window.net) return cb(window.net);

	const loader = new FBXLoader();

	loader.load('/static/assets/3d/tennis_net/net.fbx', function (fbx){
		const material = new THREE.MeshPhongMaterial( { map: texture, side: THREE.DoubleSide, transparent: true, color: 0x000000 } );

		fbx.traverse(child =>{
			if(child.name === 'Plane003'){
				child.material = material
			}
		})
		window.net = fbx;
		cb(fbx)
	}, undefined, function ( error) {
		console.error(error);
	})
}

function removeLightLeftBottom(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'lightLeftBottom' && x.name !== 'spBottomLeft');
}

function removeLightLeftTop(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'lightLeftTop' && x.name !== 'spTopLeft');
}

function removeLightTopMiddle(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'lightTopMiddle' && x.name !== 'spTopMiddle');
}

function removeLightBottomMiddle(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'lightBottomMiddle' && x.name !== 'spBottomMiddle');
}

function removeLightTopRight(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'lightTopRight' && x.name !== 'spTopRight');
}

function removeLightBottomRight(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'lightBottomRight' && x.name !== 'spBottomRight');
}

window.generateBox = function(){
	let box = new THREE.Box3().setFromObject( window._net );
	return box;
}
export function renderNet(array){

	if(!window.scene) return;
/*
	if(array.every(x => x === 0)){
		window.scene.children = window.scene.children.filter(x => x.name !== 'ambientLight')
		ambientLight = false;
	}else if(array.some(x => x === 1) && !ambientLight){
		const am = new THREE.AmbientLight( 0xffffff, 1 )
		am.name = "ambientLight"
		window.scene.add(am); // soft white light
		ambientLight = true;
	}*/

	window.scene.children = window.scene.children.filter( x => x.name !== 'tennis_net' && x.name !== 'pickleball_net');

	loadNet( net => {
		let _net = net.clone()
		if(array[0] === 1){
			_net.rotation.y = Math.PI / 2;
			_net.position.x = 78 / 2
			let box = new THREE.Box3().setFromObject( _net );
			let scale = 42 / (Math.abs(box.max.z) + Math.abs(box.min.z))
			_net.scale.set(0.3,0.3,0.3)

			_net.position.z = -27 / 2
			_net.position.y = 0.1
			_net.name = 'tennis_net';
			window.scene.add(_net)
		}

		if(array[1] === 1){
			_net.rotation.y = Math.PI / 2;
			_net.position.x = 78 / 2
			let box = new THREE.Box3().setFromObject( _net );
			let scale = 22 / (Math.abs(box.max.z) + Math.abs(box.min.z))
			_net.scale.set(scale,0.26,0.3)

			_net.position.z = -27 / 2
			_net.position.y = 0.1

			_net.name = 'pickleball_net';
			window.scene.add(_net)
		}

		window.renderer.render(window.scene, window.camera)
	});
}
export function renderLight(array,width,length){
		loadLights(function(light){

			if(array[3] === 0 && lightPositions['bottomLeft']){
				removeLightLeftBottom(light, width, length)
				lightPositions['bottomLeft'] = false;
			}
			if(array[0] === 0 && lightPositions['topLeft']){
				removeLightLeftTop(light, width, length)
				lightPositions['topLeft'] = false;
			}
			if(array[1] === 0 && lightPositions['topMiddle']){
				removeLightTopMiddle(light, width, length)
				lightPositions['topMiddle'] = false;
			}
			if(array[4] === 0 && lightPositions['bottomMiddle']){
				removeLightBottomMiddle(light, width, length)
				lightPositions['bottomMiddle'] = false;
			}
			if(array[2] === 0 && lightPositions['topRight']){
				removeLightTopRight(light, width, length)
				lightPositions['topRight'] = false;
			} 
			if(array[5] === 0 && lightPositions['bottomRight']){
				removeLightBottomRight(light, width, length)
				lightPositions['bottomRight'] = false;
			}

			if(array[3] && !lightPositions['bottomLeft']){
				renderLightLeftBottom(light, width, length)
				lightPositions['bottomLeft'] = true;
			}
			if(array[0] && !lightPositions['topLeft']){
				renderLightLeftTop(light, width, length)
				lightPositions['topLeft'] = true;
			}
			if(array[1] && !lightPositions['topMiddle']){
				renderLightTopMiddle(light, width, length)
				lightPositions['topMiddle'] = true;
			}
			if(array[4] && !lightPositions['bottomMiddle']){
				renderLightBottomMiddle(light, width, length)
				lightPositions['bottomMiddle'] = true;
			}
			if(array[2] && !lightPositions['topRight']){
				renderLightTopRight(light, width, length)
				lightPositions['topRight'] = true;
			} 
			if(array[5] && !lightPositions['bottomRight']){
				renderLightBottomRight(light, width, length)
				lightPositions['bottomRight'] = true;
			}


			window.renderer.render(window.scene, window.camera)
		})
}

function renderLightLeftBottom(light, width, length){
	light = light.clone()
	light.scale.set(0.002,0.002,0.002)
	light.rotation.y = Math.PI / 2 * 3
	//let box = new THREE.Box3().setFromObject( light )
	light.position.x = -(length-2-78)/2+2
	light.position.z = (width-2-27)/2+3
	light.name = 'lightLeftBottom'
	window.scene.add(light)
	addSpotlight(light.position, {x: light.position.x, y: 1, z: -18}, 'spBottomLeft')

}

function renderLightLeftTop(light, width, length){
	light = light.clone()
	light.scale.set(0.002,0.002,0.002)
	light.rotation.y = Math.PI / 2 
	//let box = new THREE.Box3().setFromObject( light )
	light.position.x = -(length-2-78)/2+2
	light.position.z = -27-(width-2-27)/2-3
	light.name = 'lightLeftTop'
	window.scene.add(light)
	addSpotlight(light.position, {x: light.position.x, y: 1, z: -18}, 'spTopLeft')
}

function renderLightTopMiddle(light, width, length){
	light = light.clone()
	light.scale.set(0.002,0.002,0.002)
	light.rotation.y = Math.PI / 2 
	let box = new THREE.Box3().setFromObject( light )
	console.log(box)
	light.position.x = -(length+2-78)/2+length/2 + 1 
	light.position.z = -27-(width-2-27)/2 - 3
	light.name = 'lightTopMiddle'
	window.scene.add(light)
	addSpotlight(light.position, {x: 39, y:1, z:-18}, 'spTopMiddle')
}

function renderLightBottomMiddle(light, width, length){
	light = light.clone()
	light.scale.set(0.002,0.002,0.002)
	light.rotation.y = Math.PI / 2 * 3
	let box = new THREE.Box3().setFromObject( light )
	light.position.x = -(length+2-78)/2+length/2 + (box.max.x - box.min.x) / 2 - 0.25
	light.position.z = (width-2-27)/2 + 3
	light.name = 'lightBottomMiddle'
	window.scene.add(light)
	addSpotlight(light.position, {x: light.position.x, y: 1, z: -18}, 'spBottomMiddle')

}

function renderLightTopRight(light, width, length){
	light = light.clone()
	light.scale.set(0.002,0.002,0.002)
	light.rotation.y = Math.PI / 2 
	let box = new THREE.Box3().setFromObject( light )
	light.position.x = -(length+2-78)/2+length - 3
	light.position.z = -27-(width-2-27)/2 - 3
	light.name = 'lightTopRight'
	window.scene.add(light)
	addSpotlight(light.position, {x: light.position.x, y: 1, z: -18}, 'spTopRight')
}

function renderLightBottomRight(light, width, length){
	light = light.clone()
	light.scale.set(0.002,0.002,0.002)
	light.rotation.y = Math.PI / 2 * 3
	light.position.x = -(length+2-78)/2+length - 3
	light.position.z = (width-2-27)/2 + 3
	light.name = 'lightBottomRight'
	window.scene.add(light)
	addSpotlight(light.position, {x: light.position.x, y: 1, z: -18}, 'spBottomRight')

}

export function renderHoop(array, width, length){

	if(!window.scene) return;

/*	if(array.every(x => x === 0)){
		window.scene.children = window.scene.children.filter(x => x.name !== 'ambientLight')
		ambientLight = false;
	}else if(array.some(x => x === 1) && !ambientLight){
		const am = new THREE.AmbientLight( 0xffffff, 1 )
		am.name = "ambientLight"
		window.scene.add(am); // soft white light
		ambientLight = true;
	}*/

	loadHoop(function(model){
		if(array[1] === 1 && !hoopsPositions['left']) {
			renderHoopLeft(model, width, length);
			hoopsPositions['left'] = true;
		}
		if(array[2] === 1 && !hoopsPositions['right']){
			renderHoopRight(model, width, length);
			hoopsPositions['right'] = true;
		}
		if(array[0] === 1 && !hoopsPositions['top']){
			renderHoopTop(model, width, length);
			hoopsPositions['top'] = true;
		}
		if(array[3] === 1 && !hoopsPositions['topMiddle']) {
			renderHoopTopMiddle(model, width, length);
			hoopsPositions['topMiddle'] = true;
		}
		if(array[4] === 1 && !hoopsPositions['bottomMiddle']){
			renderHoopBottomMiddle(model, width, length)
			hoopsPositions['bottomMiddle'] = true;
		}

		if(array[1] === 0 && hoopsPositions['left'] ){
			removeHoop('hoopLeft')
			hoopsPositions['left'] = false;
		}
		if(array[2] === 0 && hoopsPositions['right'] ){
			removeHoop('hoopRight')
			hoopsPositions['right'] = false;
		}
		if(array[0] === 0 && hoopsPositions['top']){
			removeHoop('hoopTop')
			hoopsPositions['top'] = false;
		}

		if(array[3] === 0 && hoopsPositions['topMiddle']){
			removeHoop('hoopTopMiddle')
			hoopsPositions['topMiddle'] = false;
		}
		if(array[4] === 0 && hoopsPositions['bottomMiddle']) {
			removeHoop('hoopBottomMiddle')
			hoopsPositions['bottomMiddle'] = false;
		}

		window.renderer.render(window.scene, window.camera)
	})
}

function removeHoop(pos){
	window.scene.children = window.scene.children.filter(x => x.name !== pos)
}
function renderHoopLeft(model, width, length){
	model = model.clone()
	model.scale.set(0.06,0.06,0.06)
	model.rotation.set(-Math.PI / 2, Math.PI / 2, Math.PI / 2 )
	model.position.set(0, 0, -(27/2))

	let group = new THREE.Group()

	const light = new THREE.PointLight( 0xffffff, 1.5, 15 )
	light.position.set( -1, 4, -(27/2) )

	const light2 = new THREE.PointLight( 0xffffff, 10, 7 )
	light2.position.set( 5, 4.8, -(27/2) )

	const light3 = new THREE.PointLight( 0xffffff, 4, 13)
	light3.position.set( 5, 19, -(27/2) )

	const light4 = new THREE.PointLight( 0xffffff, 1, 15)
	light4.position.set(-8, 15, -(27/2) )



/*	group.add(light)
	group.add(light2)
	group.add(light3)
	group.add(light4)*/
	group.add(model)

	group.name = "hoopLeft"
	group.position.x = -((length-78)/2-4)
	window.scene.add(group)
}

function renderHoopRight(model, width,length){
	model = model.clone()
	window.bb = model;
	model.scale.set(0.06,0.06,0.06)
	model.rotation.set(Math.PI / 2 * 3, Math.PI / 2 * 3, Math.PI / 2 * 3)
	model.position.set(0, 0, 0)

	let group = new THREE.Group()

	const light = new THREE.PointLight( 0xffffff, 1.5, 15 )
	light.position.set( -1, 4, -(27/2) )

	const light2 = new THREE.PointLight( 0xffffff, 10, 7 )
	light2.position.set( 5, 4.8, -(27/2) )

	const light3 = new THREE.PointLight( 0xffffff, 4, 13)
	light3.position.set( 5, 19, -(27/2) )

	const light4 = new THREE.PointLight( 0xffffff, 1, 15)
	light4.position.set(-8, 15, -(27/2) )



/*	group.add(light)
	group.add(light2)
	group.add(light3)
	group.add(light4)*/
	group.add(model)

	group.name = 'hoopRight'

	group.position.x = length+2-(length+2-78)/2 - 4
	group.position.z = -(27/2);
	window.scene.add(group)
}

function renderHoopTop(model, width,length){
	model = model.clone()
	window.bb = model;
	model.scale.set(0.06,0.06,0.06)
	model.position.set(0, 0, 0)
	//model.position.set(0,0,0);

	let group = new THREE.Group()

	const light = new THREE.PointLight( 0xffffff, 1.5, 15 )
	light.position.set( -1, 4, -(27/2) )

	const light2 = new THREE.PointLight( 0xffffff, 10, 7 )
	light2.position.set( 5, 4.8, -(27/2) )

	const light3 = new THREE.PointLight( 0xffffff, 4, 13)
	light3.position.set( 5, 19, -(27/2) )

	const light4 = new THREE.PointLight( 0xffffff, 1, 15)
	light4.position.set(-8, 15, -(27/2) )



/*	group.add(light)
	group.add(light2)
	group.add(light3)
	group.add(light4)*/
	group.add(model)


	group.name = 'hoopTop'
	group.position.x = 78/2
	group.position.z = -27-((width+2-27)/2) + 4;
	window.scene.add(group)
}

function renderHoopTopMiddle(model, width,length){
	model = model.clone()
	window.bb = model;
	model.scale.set(0.06,0.06,0.06)
	model.position.set(0, 0, 0)
	//model.position.set(0,0,0);

	let group = new THREE.Group()

	const light = new THREE.PointLight( 0xffffff, 1.5, 15 )
	light.position.set( -1, 4, -27-((width+2-27)/2) + 9 + 4)

	const light2 = new THREE.PointLight( 0xffffff, 10, 7 )
	light2.position.set( 5, 4.8, -27-((width+2-27)/2) + 9 + 4)

	const light3 = new THREE.PointLight( 0xffffff, 4, 13)
	light3.position.set( 5, 19, -27-((width+2-27)/2) + 9 + 4)

	const light4 = new THREE.PointLight( 0xffffff, 1, 15)
	light4.position.set(-8, 15, -27-((width+2-27)/2) + 9 + 4)



/*	group.add(light)
	group.add(light2)
	group.add(light3)
	group.add(light4)*/
	group.add(model)

	group.name = 'hoopTopMiddle'
	group.position.x = 61.4 + 16 / 2
	group.position.z = -27-((width+2-27)/2) + 4;
	window.scene.add(group)
}

function renderHoopBottomMiddle(model, width,length){
	model = model.clone()
	window.bb = model;
	model.scale.set(0.06,0.06,0.06)
	model.position.set(0, 0, 0)
	model.rotation.y = Math.PI / 2 * 2
	//model.position.set(0,0,0);

	let group = new THREE.Group()

	const light = new THREE.PointLight( 0xffffff, 1.5, 15 )
	light.position.set( -1, 4, -(27/2) )

	const light2 = new THREE.PointLight( 0xffffff, 10, 7 )
	light2.position.set( 5, 4.8, -(27/2) )

	const light3 = new THREE.PointLight( 0xffffff, 4, 13)
	light3.position.set( 5, 19, -(27/2) )

	const light4 = new THREE.PointLight( 0xffffff, 1, 15)
	light4.position.set(-8, 15, -(27/2) )



/*	group.add(light)
	group.add(light2)
	group.add(light3)
	group.add(light4)*/
	group.add(model)

	group.name = 'hoopBottomMiddle'
	group.position.x = 61.4 + 16 / 2
	group.position.z = (width/2)-(27.75/2) + 0.4 - 3
	window.scene.add(group)
}

export function renderFence(array,width,length, num){
	if(!window.renderer) return;

	let borderExists = window.scene.children.some(x => x.name === 'border')

	if(!borderExists && !num){
		width -= num || 2
		length -= num || 2
	}
	loadFence((fbx) => {

		removeFenceLeft()
		removeFenceTop()
		removeFenceBottom()
		removeFenceRight()
		
		if(array[1] === 1 ) { renderFenceLeft(fbx,width,length) }
		if(array[0] === 1 ) { renderFenceTop(fbx, width, length) }
		if(array[3] === 1 ) { renderFenceBottom(fbx, width, length) }
		if(array[2] === 1 ) { renderFenceRight(fbx, width, length) }

		window.renderer.render(window.scene, window.camera)
	})
}

function removeFenceLeft(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'fenceLeft');
}

function removeFenceRight(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'fenceRight');
}

function removeFenceTop(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'fenceTop');
}

function removeFenceBottom(){
	window.scene.children = window.scene.children.filter(x => x.name !== 'fenceBottom');
}
function renderFenceLeft(fbx, width, length){
	let group = new THREE.Group()

	let one = fbx.clone()
	one.children = one.children.filter(x => x.name !== 'pCube3')
	//one.children = one.children.filter(x => x.name === 'Fence001' || x.name === 'Cylinder004' || x.name === 'Pin001' && x.name === 'Pin002' || x.name === "Pin010" || x.name === "Pin011")

	//group.add(one)

	var box = new THREE.Box3().setFromObject( one )

	let currentWidth =  box.max.x - box.min.x
	

	let maxFences = Math.floor((width + 2) / 10);
	let remainder = (width + 2) % 10

	let desiredWidth = 10 + (remainder / maxFences)

	let ratio = desiredWidth / currentWidth

	for(let i = 0; i < maxFences; i++){
		let el = one.clone()
		el.scale.set(ratio, 0.9, 0.25)
		box = new THREE.Box3().setFromObject( el )
		currentWidth =  box.max.x - box.min.x

		el.position.set(currentWidth * i,0, 0)
		group.add(el)
	}

	group.position.set(-(length-78+2)/2,-0.05,-currentWidth/2+(width+2-27)/2)
	group.rotation.set(0, Math.PI / 2, 0)

	group.name = "fenceLeft"
	window.scene.add(group)
}

function renderFenceTop(fbx, width, length){
	let group = new THREE.Group()


	let one = fbx.clone()

	one.children = one.children.filter(x => x.name !== 'pCube3')
	//one.children = one.children.filter(x => x.name === 'Fence001' || x.name === 'Cylinder004' || x.name === 'Pin001' && x.name === 'Pin002' || x.name === "Pin010" || x.name === "Pin011")

	//group.add(one)

	var box = new THREE.Box3().setFromObject( one )
	let currentLength =  box.max.x - box.min.x

	let maxFences = Math.floor((length + 2) / 10);
	let remainder = (length + 2) % 10

	let desiredLength = 10 + (remainder / maxFences)

	let ratio = desiredLength / currentLength

	for(let i = 0; i < maxFences; i++){
		let el = one.clone()
		el.scale.set(ratio, 0.9, 0.25)
		box = new THREE.Box3().setFromObject( el )
		currentLength =  box.max.x - box.min.x

		el.position.set(currentLength * i,0, 0)
		group.add(el)
	}

	group.position.set(-(length-78+2)/2+currentLength/2,-0.25,-27-((width+2-27)/2))
	group.rotation.set(0, 0, 0)

	group.name = "fenceTop"
	window.scene.add(group)	
}

function renderFenceBottom(fbx, width, length){
	let group = new THREE.Group()

	let one = fbx.clone()
	one.children = one.children.filter(x => x.name !== 'pCube1')
	//one.children = one.children.filter(x => x.name === 'Fence001' || x.name === 'Cylinder004' || x.name === 'Pin001' && x.name === 'Pin002' || x.name === "Pin010" || x.name === "Pin011")

	//group.add(one)

	var box = new THREE.Box3().setFromObject( one )
	let currentLength =  box.max.x - box.min.x

	let maxFences = Math.floor((length + 2) / 10);
	let remainder = (length + 2) % 10

	let desiredLength = 10 + (remainder / maxFences)

	let ratio = desiredLength / currentLength

	for(let i = 0; i < maxFences; i++){
		let el = one.clone()
		el.scale.set(ratio, 0.9, 0.25)
		box = new THREE.Box3().setFromObject( el )
		currentLength =  box.max.x - box.min.x
		el.position.set(currentLength * i,0, 0)
		group.add(el)
	}

	group.position.set(-(length-78+2)/2+currentLength/2,-0.25,((width+2-27)/2))
	group.rotation.set(0, 0, 0)

	group.name = "fenceBottom"

	window.groupBottom = group;
	window.scene.add(group)		
}

function renderFenceRight(fbx, width, length){
	let group = new THREE.Group()


	let one = fbx.clone()
	one.children = one.children.filter(x => x.name !== 'pCube1')
	//one.children = one.children.filter(x => x.name === 'Fence001' || x.name === 'Cylinder004' || x.name === 'Pin001' && x.name === 'Pin002' || x.name === "Pin010" || x.name === "Pin011")

	//group.add(one)

	var box = new THREE.Box3().setFromObject( one )
	let currentWidth =  box.max.x - box.min.x
	

	let maxFences = Math.floor((width + 2) / 10);
	let remainder = (width + 2) % 10

	let desiredWidth = 10 + (remainder / maxFences)

	let ratio = desiredWidth / currentWidth

	for(let i = 0; i < maxFences; i++){
		let el = one.clone()
		el.scale.set(ratio, 0.9, 0.25)
		box = new THREE.Box3().setFromObject( el )
		currentWidth =  box.max.x - box.min.x

		el.position.set(currentWidth * i,0, 0)
		group.add(el)
	}

	group.position.set(length+2-(length+2-78)/2 + 0.1,-0.25,-currentWidth/2+(width+2-27)/2)
	group.rotation.set(0, Math.PI / 2, 0)
	group.name = "fenceRight"
	window.scene.add(group)
}

export function changeFencePositions(width, length, num){

	if(!window.fence) return;

	let fenceLeft = window.scene.children.filter(x => x.name === 'fenceLeft')
	let fenceRight = window.scene.children.filter(x => x.name === 'fenceRight')
	let fenceTop = window.scene.children.filter(x => x.name === 'fenceTop')
	let fenceBottom = window.scene.children.filter(x => x.name === 'fenceBottom')

	let borderExists = window.scene.children.some(x => x.name === 'border')

	if(!borderExists && !num){
		width -= num || 2
		length -= num || 2
	}
	
	if(fenceLeft.length !== 0){
		fenceLeft[0].position.x = -(length-78+2)/2
		var box = new THREE.Box3().setFromObject( fenceLeft[0].children[0] )
		let currentWidth =  box.max.z - box.min.z

		let maxFences = Math.floor((width + 2) / 10);
		let remainder = (width + 2) % 10

		let desiredWidth = 10 + (remainder / maxFences)

		let ratio = desiredWidth / currentWidth


		if(maxFences > fenceLeft[0].children.length){
			fenceLeft[0].add(fenceLeft[0].children[1].clone())
		}else if(maxFences < fenceLeft[0].children.length){
			fenceLeft[0].children.pop();
		}

		fenceLeft[0].children.forEach((x,i) => {
			x.scale.x = x.scale.x * ratio
			x.position.x = i * desiredWidth
			box = new THREE.Box3().setFromObject( x )
			currentWidth =  box.max.z - box.min.z
		})

		fenceLeft[0].position.z = -currentWidth/2+(width+2-27)/2
	}

	if(fenceRight.length !== 0){
		fenceRight[0].position.x = length+2-(length+2-78)/2 + 0.1;

		var box = new THREE.Box3().setFromObject( fenceRight[0].children[0] )
		let currentWidth =  box.max.z - box.min.z

		let maxFences = Math.floor((width + 2) / 10);
		let remainder = (width + 2) % 10

		let desiredWidth = 10 + (remainder / maxFences)

		let ratio = desiredWidth / currentWidth

		if(maxFences > fenceRight[0].children.length){
			fenceRight[0].add(fenceRight[0].children[1].clone())
		}else if(maxFences < fenceRight[0].children.length){
			fenceRight[0].children.pop();
		}

		fenceRight[0].children.forEach((x,i) => {
			x.scale.x = x.scale.x * ratio
			x.position.x = i * desiredWidth
			box = new THREE.Box3().setFromObject( x )
			currentWidth =  box.max.z - box.min.z
		})

		fenceRight[0].position.z = -currentWidth/2+(width+2-27)/2

	}

	if(fenceTop.length !== 0){
		fenceTop[0].position.z = -27-((width+2-27)/2)

		var box = new THREE.Box3().setFromObject( fenceTop[0].children[0] )
		let currentLength =  box.max.x - box.min.x

		let maxFences = Math.floor((length + 2) / 10);
		let remainder = (length + 2) % 10

		let desiredLength = 10 + (remainder / maxFences)

		let ratio = desiredLength / currentLength


		if(maxFences > fenceTop[0].children.length){
			fenceTop[0].add(fenceTop[0].children[1].clone())
		}else if(maxFences < fenceTop[0].children.length){
			fenceTop[0].children.pop();
		}

		fenceTop[0].children.forEach((x,i) => {
			x.scale.x = x.scale.x * ratio
			x.position.x = i * desiredLength
			box = new THREE.Box3().setFromObject( x )
			currentLength =  box.max.x - box.min.x
		})

		fenceTop[0].position.x = -(length-78+2)/2+currentLength/2
	}

	if(fenceBottom.length !== 0){
		fenceBottom[0].position.z = ((width+2-27)/2) 

		var box = new THREE.Box3().setFromObject( fenceBottom[0].children[0] )
		let currentLength =  box.max.x - box.min.x

		let maxFences = Math.floor((length + 2) / 20);
		let remainder = (length + 2) % 20

		let desiredLength = 20 + (remainder / maxFences)

		let ratio = desiredLength / currentLength


		if(maxFences > fenceBottom[0].children.length){
			fenceBottom[0].add(fenceBottom[0].children[1].clone())
		}else if(maxFences < fenceBottom[0].children.length){
			fenceBottom[0].children.pop();
		}


		fenceBottom[0].children.forEach((x,i) => {
			x.scale.x = x.scale.x * ratio
			x.position.x = i * desiredLength
			box = new THREE.Box3().setFromObject( x )
			currentLength =  box.max.x - box.min.x
		})

		fenceBottom[0].position.x = -(length-78+2)/2+currentLength/2
	}

	window.renderer.render(window.scene, window.camera)
}

export function changeLightPositions(width, length){
	let lightLeftBottom = window.scene.children.filter(x => x.name === 'lightLeftBottom');
	let lightLeftTop = window.scene.children.filter(x => x.name === 'lightLeftTop');
	let lightTopMiddle = window.scene.children.filter(x => x.name === 'lightTopMiddle');
	let lightBottomMiddle = window.scene.children.filter(x => x.name === 'lightBottomMiddle');
	let lightTopRight = window.scene.children.filter(x => x.name === 'lightTopRight');
	let lightBottomRight = window.scene.children.filter(x => x.name === 'lightBottomRight');

	if(lightLeftBottom.length !== 0){
		lightLeftBottom[0].position.x = -(length-2-78)/2+2
		lightLeftBottom[0].position.z = (width-2-27)/2+3
	}

	if(lightLeftTop.length !== 0){
		lightLeftTop[0].position.x = -(length-2-78)/2+2
		lightLeftTop[0].position.z = -27-(width-2-27)/2-3	
	}

	if(lightTopMiddle.length !== 0){
		lightTopMiddle[0].position.x = -(length+2-78)/2+length/2 
		lightTopMiddle[0].position.z = -27-(width-2-27)/2 - 3
	}

	if(lightBottomMiddle.length !== 0){
		let box = new THREE.Box3().setFromObject( lightBottomMiddle[0] )
		lightBottomMiddle[0].position.x = -(length+2-78)/2+length/2 + (box.max.x - box.min.x) / 2 - 0.25
		lightBottomMiddle[0].position.z = (width-2-27)/2 + 3
	}

	if(lightTopRight.length !== 0){
		lightTopRight[0].position.x = -(length+2-78)/2+length - 3
		lightTopRight[0].position.z = -27-(width-2-27)/2 - 3
	}

	if(lightBottomRight.length !== 0){
		lightBottomRight[0].position.x = -(length+2-78)/2+length - 3
		lightBottomRight[0].position.z = (width-2-27)/2 + 3
	}

	window.renderer.render(window.scene, window.camera)
}

export function changeHoopPositions(width,length){

	if(!window.scene) return;

	let hoopLeft = window.scene.children.filter(x => x.name === 'hoopLeft');
	let hoopTop = window.scene.children.filter(x => x.name === 'hoopTop');
	let hoopTopMiddle = window.scene.children.filter(x => x.name === 'hoopTopMiddle');
	let hoopBottomMiddle = window.scene.children.filter(x => x.name === 'hoopBottomMiddle');
	let hoopRight = window.scene.children.filter(x => x.name === 'hoopRight');


	if(hoopLeft.length !== 0){
		hoopLeft[0].position.x = -((length-78)/2-4)
	}

	if(hoopRight.length !== 0){
		hoopRight[0].position.x = length+2-(length+2-78)/2 - 4
		hoopRight[0].position.z = -(27/2);
	}

	if(hoopTop.length !== 0){
		hoopTop[0].position.x = 78/2
		hoopTop[0].position.z = -27-((width+2-27)/2) + 4;
	}

	if(hoopTopMiddle.length !== 0){
		hoopTopMiddle[0].position.z = -27-((width+2-27)/2) + 4;
	}

	if(hoopBottomMiddle.length !== 0){
		hoopBottomMiddle[0].position.x = 61.4 + 16 / 2
		hoopBottomMiddle[0].position.z = (width/2)-(27.75/2) + 0.4 - 3
	}

	window.renderer.render(window.scene, window.camera)
}

export function renderGallery(type){
	if(!window.scene) return; 
	
	let fenceTop = window.scene.children.filter(x => x.name === 'fenceTop')
	let fenceBottom =  window.scene.children.filter(x => x.name === 'fenceBottom')


	if(fenceBottom.length !== 0){
		let children = [ ...fenceBottom[0].children ]
		children.pop();
		let first = children.shift();

		let postRight = first.children.filter(x => x.name === 'pCube3')[0]
		let box = new THREE.Box3().setFromObject( postRight );

		console.log(box)
		let desiredHeight = box.max.y - box.min.y

		children.forEach(async (x,i) => {
			let factor = !type ? 0.5 : 0.9;
			await x.scale.set(x.scale.x, factor, x.scale.z)	
			
			let item = x.children.filter(x => x.name === 'pCube3')[0]
			let box = generateBox(x)
			
			console.log(box)
			if(i === children.length - 1){
				let lastOne = x.children.filter(x => x.name === 'pCube3')[0]
				let lastOneBox = generateBox(lastOne)

				let currentHeight = lastOneBox.max.y - lastOneBox.min.y;

				if(!type){
					lastOne.translateY(desiredHeight - currentHeight)
					lastOne.scale.y *= desiredHeight / currentHeight	
				}else{
					lastOne.scale.y *= desiredHeight / currentHeight
					lastOne.translateY(postRight.position.y - lastOne.position.y)
				}

				window.renderer.render(window.scene, window.camera)

				//lastOne.position.y += (desiredHeight - currentHeight )
				//lastOne.updateMatrix()

			}
		})

	}
	if(fenceTop.length !== 0){
		let children = [ ...fenceTop[0].children ]
		children.pop();
		let first = children.shift();

		let postRight = first.children.filter(x => x.name === 'pCube1')[0]
		let box = new THREE.Box3().setFromObject( postRight );
		let desiredHeight = box.max.y - box.min.y

		children.forEach( async (x,i) => {
			let factor = !type ? 0.5 : 0.9;
			await x.scale.set(x.scale.x, factor, x.scale.z)

			let item = x.children.filter(x => x.name === 'pCube1')[0]
			let box = generateBox(item)
			
			if(i === 0){
				let lastOne = x.children.filter(x => x.name === 'pCube1')[0]
				let lastOneBox = generateBox(lastOne)

				let currentHeight = lastOneBox.max.y - lastOneBox.min.y;

				console.log(desiredHeight)
				console.log(currentHeight)
				if(!type){
					lastOne.translateY(desiredHeight - currentHeight)
					lastOne.scale.y *= desiredHeight / currentHeight	
				}else{
					lastOne.scale.y *= desiredHeight / currentHeight
					lastOne.translateY(postRight.position.y - lastOne.position.y)
				}

				window.renderer.render(window.scene, window.camera)
			}			
		})
	}

	window.renderer.render(window.scene, window.camera)
}

function generateBox(el){
	return new THREE.Box3().setFromObject(el)
}

window.generateBox = generateBox