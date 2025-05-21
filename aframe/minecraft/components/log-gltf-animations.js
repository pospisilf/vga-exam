AFRAME.registerComponent('log-gltf-animations', {
    init: function () {
        // Po načtení modelu (událost model-loaded)
        this.el.addEventListener('model-loaded', (e) => {
            const model = e.detail.model;

            // Získání seznamu animací z modelu (různé pro různé formáty/GLTF exporty)
            const animations = model.animations || model.scene.animations;

            // Pokud nejsou žádné animace, vypiš zprávu a skonči
            if (!animations || animations.length === 0) {
                console.log('No animations found in GLTF model.');
                return;
            }

            // Vypiš názvy všech nalezených animací v konzoli
            console.log(
                'Animations found in GLTF model: ',
                animations.map((clip, i) => clip.name).join(', ')
            );
        });
    }
});
