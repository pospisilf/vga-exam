import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'

document.querySelector('#app').innerHTML = `
<div class="dialog">
    <h1>🚀 A-FRAME template initialized! 🚀</h1>
    <p>Welcome, brave developer! You have successfully summoned the ancient forces of 3D wizardry. Your project template is alive, breathing, and ready to shape worlds!</p>
    
    <p><strong>⚠️ WARNING:</strong> Side effects may include excessive coffee consumption, questioning the nature of reality, and spontaneous debugging at 3 AM.</p>
    
    <p>Now go forth and create! But remember... if your 3D object disappears into the void, it’s not a bug—it’s just exploring the 4th dimension 👀</p>
</div>
<a-scene>
    <a-entity
        position="0 -2 -5"
        rotation="0 90 0"
        gltf-model="/wizard.glb"
        animation-mixer="clip: *Spell2*; loop: repeat;"
    />
</a-scene>
`