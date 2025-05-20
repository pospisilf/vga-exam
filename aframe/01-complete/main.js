import './style.css'
import 'aframe'
import 'aframe-physics-system'
import './components/character'
import './components/obstacle'

document.querySelector('#app').innerHTML = `
    <div id="game-over">You lost!</div>
    <a-scene>
        <!-- Camera -->
        <a-entity camera look-controls position="0 2 4"></a-entity>

        <!-- Character -->
        <a-box dynamic-body character position="-2 0.5 -3" color="#4CC3D9"></a-box>
        
        <!-- Obstacles -->
        <a-cylinder obstacle dynamic-body position="0 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
        <a-sphere obstacle="strength: 9999" dynamic-body position="1.5 0.75 -3" radius="0.5" color="#EF2D5E"></a-sphere>
        
        <!-- Floor -->
        <a-plane static-body position="0 0 -4" rotation="-90 0 0" width="7" height="4" color="#7BC8A4"></a-plane>
    </a-scene>
`