import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'
import './components/character'
import './components/obstacle'
import './components/collider-check'
import './shaders/glowing'

document.querySelector('#app').innerHTML = `
    <div id="game-over">You lost!</div>
    <a-scene>
        <!-- External files -->
        <a-assets>
            <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
            <a-asset-item id="eva" src="/models/eva-animated-complete.glb"></a-asset-item>
            <img src="/models/grass.jpg" id="grass">
            <img src="/models/asteroid.jpg" id="ball">
            <img src="/models/night-sky.jpg" id="sky">
        </a-assets>
        
        <!-- Lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.01;"></a-entity>
        <a-entity light="type: directional; color: #FFF; intensity: 0.2; castShadow: true; shadow-camera-automatic: [shadow]; shadowMapWidth: 1024; shadowMapHeight: 1024;" position="-1 1 0"></a-entity>
  
        <!-- Environment -->
        <!--  sky    --> <a-sky src="#sky"></a-sky>
        <!--  ground --> <a-box static-body="friction: 0;" position="0 0 -2" width="30" height="0.2" depth="10" material="src: #grass; repeat: 1 1;" shadow="receive: true"></a-box> 
        <!--  tree   --> <a-entity static-body gltf-model="#tree" position="2 0 -6" scale="0.2 0.2 0.2" shadow="cast: true;"></a-entity> 
  
        <!-- Camera -->
        <a-entity camera position="0 3 3" rotation="-20 0 0"></a-entity>

        <!-- Obstacles -->
        <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.3;" position="2 1 -3" radius="0.5" color="orange" shadow="cast: true"></a-sphere>
        <a-sphere obstacle="strength: 9999" position="2 1 -1" radius="0.5" material="shader: glowing; transparent: true; color1: red; color2: blue; uMap: #ball;"></a-sphere>
        
        <!-- Character -->
        <a-entity character dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 0.4 -3">
            <a-entity gltf-model="#eva" animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1" shadow="cast: true">
                <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7; castShadow: true;" position="0 1 0" rotation="0 180 0"></a-entity>
            </a-entity>
            <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
        </a-entity>
    </a-scene>
`