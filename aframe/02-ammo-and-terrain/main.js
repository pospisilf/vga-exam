import './style.css'
import './components/character'
import './components/obstacle'
import './components/collider-check'
import './components/log-gltf-animations'

document.querySelector('#app').innerHTML = `
    <div id="game-over">You lost!</div>
    <a-scene physics=" driver: ammo; debug: true; debugDrawMode: 1;">
        <!-- External files -->
        <a-assets>
            <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
            <a-asset-item id="eva" src="/models/eva-animated-complete.glb"></a-asset-item>
            <a-asset-item id="terrain" src="/models/t.glb"></a-asset-item>
            <img src="/models/grass.jpg" id="grass">
        </a-assets>
  
        <!-- Environment -->
        <!--  sky    --> <a-sky color="#eeeeee"></a-sky>
        <!-- ground  --> <a-entity gltf-model="#terrain" id=terrain2 ammo-body="type: static;" ammo-shape="type: mesh" position="0 -4 -4"></a-entity>
        <!--  tree   --> <a-entity ammo-body="type: static;" ammo-shape="type: box" gltf-model="#tree" position="2.9 -1.9 -7" scale="0.2 0.2 0.2"></a-entity> 
  
        <!-- Camera -->
        <a-entity id="camera-rig" position="0 2 3" rotation="-30 0 0">
            <a-entity look-controls camera></a-entity>
        </a-entity>
        
        <!-- Obstacles -->
        <a-sphere ammo-body="type: dynamic" ammo-shape="type: box" obstacle="strength: 100"  position="2 5 -3" radius="0.5" color="orange"></a-sphere>
        <a-sphere ammo-body="type: dynamic" ammo-shape="type: box" obstacle="strength: 100"  position="4 5 -2" radius="0.5" color="orange"></a-sphere>
        
        <!-- Character -->
        <a-entity character ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true;"  charcter position="-2 5 -3">
            <a-entity gltf-model="#eva" log-gltf-animations ammo-shape="type: hull;" animation-mixer="clip: idle;" position="0 -0.7 0" rotation="0 90 0" scale="1 1 1"></a-entity>
            <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
        </a-entity>
        
    </a-scene>
`