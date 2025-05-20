import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'
import './components/character'
import './components/obstacle'

document.querySelector('#app').innerHTML = `
    <div id="game-over">You lost!</div>
    <a-scene>
        <!-- External files -->
        <!-- TODO -->
  
        <!-- Environment -->
        <!--  sky    --> <a-sky color="#eeeeee"></a-sky>
        <!-- TODO -->
  
        <!-- Camera -->
        <a-entity camera position="0 3 3" rotation="-20 0 0"></a-entity>

        <!-- Obstacles -->
        <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.2;" position="2 1 -3" radius="0.5" color="orange"></a-sphere>
        
        <!-- Character -->
        <!-- TODO -->
        
    </a-scene>
`