import * as THREE from "three";
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';


export function renderTennis(renderer, scene, camera, material, w = 60, l = 120){
		const points = []
		const points_out_line = []
		const pointsMiddleLineRight = [] 
		const pointsOutLineSecondSide = []

		points.push( 0, 0, 0 )
		points.push( 78, 0, 0 )
		points.push(78,0,-27)
		points.push(0,0,-27)
		points.push( 0, 0, 0 )
		points.push( 0, 0, -27 )
		points.push( 78, 0, -27 )
		points.push( 78, 0, 0 )

		points_out_line.push( 0, 0, -4.5 )
		points_out_line.push(78, 0, -4.5 )

		pointsOutLineSecondSide.push( 0, 0, -22.5 )
		pointsOutLineSecondSide.push( 78, 0, -22.5 )

		pointsMiddleLineRight.push( 58.5, 0, -4.5 )
		pointsMiddleLineRight.push( 58.5,0, -22.5 )
		pointsMiddleLineRight.push( 58.5,0, -13.5 )
		pointsMiddleLineRight.push( 19.5	,0, -13.5) 
		pointsMiddleLineRight.push( 19.5, 0, -4.5) 
		pointsMiddleLineRight.push( 19.5, 0, -22.5) 


		const geometry = new LineGeometry();
		geometry.setPositions( points );

		const geometry2 = new LineGeometry();
		geometry2.setPositions( points_out_line );

		const geometry3 = new LineGeometry();
		geometry3.setPositions( pointsOutLineSecondSide );

		const geometry4 = new LineGeometry();
		geometry4.setPositions(pointsMiddleLineRight);



		let line = new Line2( geometry, material );
		let line2 = new Line2( geometry2, material );
		let line3 = new Line2( geometry3, material );
		let line4 = new Line2( geometry4, material );

		line.position.set(0,0.04,0)
		line2.position.set(0,0.04,0)
		line3.position.set(0,0.04,0)
		line4.position.set(0,0.04,0)

		line._id = "line";
		line2._id = "line";
		line3._id = "line";
		line4._id = "line";

		const _geometry = new THREE.PlaneGeometry( 27, 78);
		const _material = new THREE.MeshLambertMaterial( {color: 0x013CA6, side: THREE.DoubleSide, reflectivity: 1 } );
		//const _material = new THREE.MeshBasicMaterial( {color: 0x013CA6, side: THREE.DoubleSide} );
		const plane = new THREE.Mesh( _geometry, _material );
		plane.rotation.set( Math.PI / 2, 0, Math.PI / 2 );
		plane.position.set(39,-0.01,-13.55)
		window.plane = plane;
		scene.add( plane );
		plane._id = 'plane'


		renderBorderAndSurface(w,l, true)
		scene.add(line);
		scene.add(line2);
		scene.add(line3);
		scene.add(line4);


		renderer.render( scene, camera );
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
	const borderGeometry = new THREE.PlaneGeometry(w+2,l+2);
	if(init){

		const backgroundMaterial = new THREE.MeshLambertMaterial( {color: 0x0082CA, side: THREE.DoubleSide, reflectivity: 1} );
		const surface = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
		surface.rotation.set( Math.PI / 2, 0, Math.PI / 2 );
		surface.position.set(39.2,-0.02,-13.57)
		surface._id = 'surface';

		const borderMaterial = new THREE.MeshLambertMaterial( {color: 0xffffff, side: THREE.DoubleSide, reflectivity: 1} );
		const border = new THREE.Mesh ( borderGeometry, borderMaterial);
		border.rotation.set( Math.PI / 2, 0, Math.PI / 2);
		border.position.set(39.2, -0.03, -13.57);
		border._id = 'border';

		window.scene.add(surface)
		window.scene.add(border)
	}else{
		const backgroundMaterial = prevSurface.material;
		const borderMaterial = prevBorder.material

		const surface = new THREE.Mesh( backgroundGeometry, backgroundMaterial );
		surface.rotation.set( Math.PI / 2, 0, Math.PI / 2 );
		surface.position.set(39.2,-0.02,-13.57)
		surface._id = 'surface';

		const border = new THREE.Mesh ( borderGeometry, borderMaterial);
		border.rotation.set( Math.PI / 2, 0, Math.PI / 2);
		border.position.set(39.2, -0.03, -13.57);
		border._id = 'border';

		window.scene.add(surface)
		window.scene.add(border)

	}
}