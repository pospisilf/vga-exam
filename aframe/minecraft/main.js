import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'
import './components/character'
import './components/obstacle'
import './components/log-gltf-animations'
import './components/collider-check'
import './shaders/glowing'

document.querySelector('#app').innerHTML = `
    <div id="game-over">You lost!</div>
    <a-scene>
        <!-- External files -->
        <a-assets>
            <a-asset-item id="tree" src="/models/tree.glb"></a-asset-item>
            <a-asset-item id="axe" src="/models/Diamond Axe.glb"></a-asset-item>
            <a-asset-item id="pickaxe" src="/models/Diamond Pickaxe.glb"></a-asset-item>
            <img src="/models/grass.jpg" id="grass">
        </a-assets>s
       <!-- Lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.2;"></a-entity>
        <a-entity light="type: directional; color: #FFF; intensity: 0.2; castShadow: true; shadow-camera-automatic: [shadow]; shadowMapWidth: 1024; shadowMapHeight: 1024;" position="-1 1 0"></a-entity>
     
        <!-- Environment -->
        <!--  sky    --> <a-sky color="#eeeeee"></a-sky>
        <!--  ground --> <a-box static-body="friction: 0;" position="0 0 -4" width="7" depth="7" height="0.2" material="color: #90EE90; repeat: 1 1;"></a-box> 
        
        <!-- river --> <a-box static-body="friction: 0;" position="2 0 -4" width="1" depth="7" height="0.21" material="color: #0000FF; repeat: 1 1;"></a-box>
  
  
        <!-- Camera -->
      
        <!-- Obstacles -->
        
        <!--
        <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.2;" position="2 1 -3" radius="0.5" color="orange"></a-sphere>
        <a-sphere obstacle="strength: 9999" position="2 1 -1" radius="0.5" material="shader: glowing; transparent: true; color1: red; color2: blue; uMap: #ball;"></a-sphere>
            -->        
         <!-- Tree trunks (obstacle with strength) -->
<a-box 
  obstacle="strength: 3; type: trunk"
  static-body
  position="2 0.4 -3" 
  width="0.4" 
  height="0.4" 
  depth="0.4" 
  material="color: #8B4513;">
</a-box>

<a-box 
  obstacle="strength: 3; type: trunk"
  static-body
  position="2 0.8 -3" 
  width="0.4" 
  height="0.4" 
  depth="0.4" 
  material="color: #8B4513;">
</a-box>

<a-box 
  obstacle="strength: 3; type: trunk"
  static-body
  position="2 1.2 -3" 
  width="0.4" 
  height="0.4" 
  depth="0.4" 
  material="color: #8B4513;">
</a-box>

<a-box 
  obstacle="strength: 3; type: trunk"
  static-body
  position="2 1.6 -3" 
  width="0.4" 
  height="0.4" 
  depth="0.4" 
  material="color: #8B4513;">
</a-box>

<!-- Tree crown (obstacle with same strength) -->
<a-box 
  obstacle="strength: 3; type: crown"
  static-body
  position="2 2.0 -3" 
  width="1.6" 
  height="1.6" 
  depth="1.6" 
  material="color: #006400;">
</a-box>

        
        <!-- Character -->
        <a-entity character dynamic-body="mass: 1; shape: box; angularDamping: 1;" position="-2 0.4 -3">
            <a-entity gltf-model="#axe" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 180 0" scale="0.2 0.2 0.2">
            <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7; castShadow: true;" position="0 1 0" rotation="0 180 0"></a-entity>
            <a-entity camera position="0 1.6 2" rotation="0 0 0"></a-entity>
            <!-- Raycaster pro detekci kolizí s překážkami -->
            <a-entity raycaster="objects: [obstacle]; direction: 0 0 -1; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
        </a-entity>
         
    
        
        </a-entity>
        
    </a-scene>
`