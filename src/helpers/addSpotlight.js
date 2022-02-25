import { SpotLight, SpotLightHelper } from "three";

export default function addSpotlight(positions, target, name){
    let { x, z } = positions
    //let lightX = -(length+2-78)/2+length/2 
    //let lightZ = -27-(width-2-27)/2 - 3

    let inc = null;
    let targetFix = 0;

    if(name.toLowerCase().includes('bottom')){
        inc = -4
        targetFix = 12
    }else{
        inc = 4
        targetFix = -4
    }
    let spotLight = new SpotLight(0xffa95c, 0.6,0, 0.9, 0.2);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 1024*10
    spotLight.shadow.mapSize.height = 1024*10
    spotLight.target.position.set(target.x,target.y,target.z + targetFix)
    spotLight.position.set(x, 25, z + inc)
    
    //let sHelper = new SpotLightHelper(spotLight)
    //window.scene.add(sHelper)
    //sHelper.update()
    spotLight.name = name
    window.scene.add( spotLight )
    window.scene.add( spotLight.target 	)
}