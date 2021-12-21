import * as THREE from "three"
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

export function renderPickleball(){
		let { scene } = window

		const points = []
		const pointsMiddleLineLeft = [] 
		const pointsMiddleLineRight = []
		const pointsHorizontalLineLeft = []
		const pointsHorizontalLineRight = []

		points.push( 0, 0, 0 )
		points.push( 44, 0, 0 )
		points.push(44,0,-20)
		points.push(0,0,-20)
		points.push( 0, 0, 0 )
		points.push( 0, 0, -20 )
		points.push( 44, 0, -20 )
		points.push( 44, 0, 0 )

		pointsMiddleLineLeft.push(0,0,-10)
		pointsMiddleLineLeft.push(15,0,-10 )

		pointsMiddleLineRight.push(29,0,-10)
		pointsMiddleLineRight.push(44,0,-10)

		pointsHorizontalLineLeft.push(15,0,0)
		pointsHorizontalLineLeft.push(15,0,-20)

		pointsHorizontalLineRight.push(29,0,0)
		pointsHorizontalLineRight.push(29,0,-20)

		const geometry = new LineGeometry()
		geometry.setPositions( points )


		const geometry2 = new LineGeometry()
		geometry2.setPositions(pointsMiddleLineLeft)

		const geometry3 = new LineGeometry()
		geometry3.setPositions(pointsMiddleLineRight)

		const geometry4 = new LineGeometry()
		geometry4.setPositions(pointsHorizontalLineLeft)

		const geometry5 = new LineGeometry()
		geometry5.setPositions(pointsHorizontalLineRight)

		let material = generateLinesMaterial()

		let group = new THREE.Group();

		let line = new Line2( geometry, material )
		let line2 = new Line2( geometry2, material )
		let line3 = new Line2( geometry3, material)
		let line4 = new Line2( geometry4, material)
		let line5 = new Line2(geometry5, material)

		line.position.y = 0.048
		line2.position.y = 0.048
		line3.position.y = 0.048
		line4.position.y = 0.048
		line5.position.y = 0.048

		line._id = "linePickleball"
		line2._id = "linePickleball"
		line3._id = "linePickleball"
		line4._id = "linePickleball"
		line5._id = "linePickleball"

		group.add(line)
		group.add(line2)
		group.add(line3)
		group.add(line4)
		group.add(line5)

		pickleballSurface(group, 22, -10)
		group.position.z = -3.5
		group.position.x = 17

		group._id = "pickleballGroup"
		scene.add(group)
}

export function renderTwoPickleBallCourts(){

		let scene = window.scene;

		const points = []
		const pointsMiddleLineLeft = [] 
		const pointsMiddleLineRight = []
		const pointsHorizontalLineLeft = []
		const pointsHorizontalLineRight = []

		points.push( 0, 0, 0 )
		points.push( 44, 0, 0 )
		points.push(44,0,-20)
		points.push(0,0,-20)
		points.push( 0, 0, 0 )
		points.push( 0, 0, -20 )
		points.push( 44, 0, -20 )
		points.push( 44, 0, 0 )

		pointsMiddleLineLeft.push(0,0,-10)
		pointsMiddleLineLeft.push(15,0,-10 )

		pointsMiddleLineRight.push(29,0,-10)
		pointsMiddleLineRight.push(44,0,-10)

		pointsHorizontalLineLeft.push(15,0,0)
		pointsHorizontalLineLeft.push(15,0,-20)

		pointsHorizontalLineRight.push(29,0,0)
		pointsHorizontalLineRight.push(29,0,-20)

		const geometry = new LineGeometry()
		geometry.setPositions( points )


		const geometry2 = new LineGeometry()
		geometry2.setPositions(pointsMiddleLineLeft)

		const geometry3 = new LineGeometry()
		geometry3.setPositions(pointsMiddleLineRight)

		const geometry4 = new LineGeometry()
		geometry4.setPositions(pointsHorizontalLineLeft)

		const geometry5 = new LineGeometry()
		geometry5.setPositions(pointsHorizontalLineRight)

		let material = generateLinesMaterial()

		let group = new THREE.Group();
		let secondGroup = new THREE.Group();

		let line = new Line2( geometry, material )
		let line2 = new Line2( geometry2, material )
		let line3 = new Line2( geometry3, material)
		let line4 = new Line2( geometry4, material)
		let line5 = new Line2(geometry5, material)

		line._id = "linePickleball"
		line2._id = "linePickleball"
		line3._id = "linePickleball"
		line4._id = "linePickleball"
		line5._id = "linePickleball"

		line.position.y = 0.048
		line2.position.y = 0.048
		line3.position.y = 0.048
		line4.position.y = 0.048
		line5.position.y = 0.048

		group.add(line)
		group.add(line2)
		group.add(line3)
		group.add(line4)
		group.add(line5)

		line = new Line2( geometry, material )
		line2 = new Line2( geometry2, material )
		line3 = new Line2( geometry3, material)
		line4 = new Line2( geometry4, material)
		line5 = new Line2(geometry5, material)

		line.position.y = 0.048
		line2.position.y = 0.048
		line3.position.y = 0.048
		line4.position.y = 0.048
		line5.position.y = 0.048

		secondGroup.add(line)
		secondGroup.add(line2)
		secondGroup.add(line3)
		secondGroup.add(line4)
		secondGroup.add(line5)

		group.position.z = -3.5
		group.position.x = -10
		group.position.y = 0.01

		secondGroup.position.z = -3.5;
		secondGroup.position.x = (78 - 44) + 10;
		secondGroup.position.y = 0.01

		group._id= "pickleballGroup"
		secondGroup._id = "pickleballGroup";

		pickleballSurface(group, 22, -10)
		pickleballSurface(secondGroup, 22, -10)

		scene.add(group)
		scene.add(secondGroup)

}

function generatePickleballSurfaceMaterial(){
	let inp = document.querySelector("input#pickleball").value 

	let material 

	if(inp !== "false"){
	  material = new THREE.MeshBasicMaterial({ color: inp, side: THREE.DoubleSide})
	}else{
      material = new THREE.MeshBasicMaterial( { color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide})
	}

	return material
}
function pickleballSurface(group, x, z){
	let g = new THREE.PlaneGeometry(20,44);

	let material = generatePickleballSurfaceMaterial();

	let mesh = new THREE.Mesh(g, material);

	mesh.rotation.set(Math.PI/2, 0, Math.PI / 2)

	mesh.position.x = x
	mesh.position.z = z;
	mesh.position.y = -0.004

	mesh.name = 'surfacePickleball'
	group.add(mesh)
}

function generateLinesMaterial(){
	let material

	let linesColor = document.querySelector("input#pickleball_lines").value

	if(linesColor !== "false"){
		material = new LineMaterial({ color: linesColor, linewidth: 0.002})
	}else{
      material = new LineMaterial( { color: 0xffffff, linewidth: 0.002})
	}

	return material
}

export function removePickleballFromScreen(){
	if(!window.scene) return;

	window.scene.children = window.scene.children.filter(x => x._id !== "pickleballGroup")
}