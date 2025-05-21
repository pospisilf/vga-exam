AFRAME.registerComponent('collider-check', {
    // Tato komponenta vyžaduje, aby entita měla také komponentu 'raycaster'
    dependencies: ['raycaster'],

    init() {
        this.isIntersecting = false;
        this.intersectedObject = null;

        // Naslouchej události 'raycaster-intersection', která se spustí,
        // když raycaster této entity detekuje průnik (kolizi) s jiným objektem
        this.el.addEventListener('raycaster-intersection', event => {
            this.isIntersecting = true;
            this.intersectedObject = event.detail.els[0];
        });

        // Naslouchej události 'raycaster-intersection-cleared', která se spustí,
        // když raycaster přestane detekovat průnik s objektem
        this.el.addEventListener('raycaster-intersection-cleared', () => {
            this.isIntersecting = false;
            this.intersectedObject = null;
        });

        // Naslouchej stisku mezerníku
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && this.isIntersecting && this.intersectedObject) {
                console.log('Collision found by raycaster!', this.intersectedObject);
            }
        });
    }
});
