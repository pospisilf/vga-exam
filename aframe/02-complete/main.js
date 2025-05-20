import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'
import './components/character'
import './components/obstacle'
import './components/collider-check'
import './components/log-gltf-animations'

document.querySelector('#app').innerHTML = `
    <div id="game-over">You lost!</div>
    <a-scene>
        <!-- External files -->
        <a-assets>
            <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
            <a-asset-item id="eva" src="/models/eva-animated-complete.glb"></a-asset-item>
            <img src="/models/grass.jpg" id="grass">
        </a-assets>
  
        <!-- Environment -->
        <!--  sky    --> <a-sky color="#eeeeee"></a-sky>
        <!--  ground --> <a-box static-body="friction: 0;" position="0 0 -4" width="7" depth="7" height="0.2" material="src: #grass; repeat: 1 1;"></a-box> 
        <!--  tree   --> <a-entity static-body gltf-model="#tree" position="2 0 -6" scale="0.2 0.2 0.2"></a-entity> 
  
        <!-- Camera -->
        <a-entity camera position="0 3 3" rotation="-20 0 0"></a-entity>
        <!-- Obstacles -->
        <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.2;" position="2 1 -3" radius="0.5" color="orange"></a-sphere>
        
        <!-- Character -->
        <a-entity character dynamic-body="mass: 1; shape: box; angularDamping: 1;" position="-2 0.4 -3">
            <a-entity gltf-model="#eva" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1"></a-entity>
            <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
        </a-entity>
        
    </a-scene>
`