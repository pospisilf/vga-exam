AFRAME.registerComponent('obstacle', {
    schema: {
        strength: {
            type: 'int',
            default: 100 // Výchozí "odolnost" překážky – kolik poškození vydrží
        },
        type: {
            type: 'string',
            default: 'trunk',
            oneOf: ['trunk', 'crown', 'branch', 'other'] // Possible tree part types
        }
    },

    init() {
        console.log('Hello, you obstacle!'); // Výpis při inicializaci překážky
        console.log('Tree part type: ' + this.data.type);

        this.damage = 0; // Počáteční nasbírané poškození (zvyšuje se po kolizi)
        this.hasBeenDestroyed = false; // Příznak, zda už byla překážka zničena
        this.isBeingHit = false; // Track if currently being hit by raycast
        this.damageInterval = null; // Store the interval ID

        // Set different strength based on type
        if (this.data.type === 'trunk') {
            this.data.strength = 200; // Trunks are stronger
            console.log("Je to trunkkk");
        } else if (this.data.type === 'crown') {
            this.data.strength = 150; // Crown is medium strength
        } else if (this.data.type === 'branch') {
            this.data.strength = 100; // Branches are weaker
        }

        // Listen for raycast hits
        this.el.addEventListener('raycaster-intersected', event => {
            console.log('Raycast hit detected!');
            console.log('Tree part type: ' + this.data.type);
            
            if (!this.isBeingHit) {
                this.isBeingHit = true;
                // Start continuous damage
                this.damageInterval = setInterval(() => {
                    if (!this.hasBeenDestroyed) {
                        this.damage += 30;
                        console.log('Current damage: ' + this.damage);
                        
                        if (this.damage > this.data.strength) {
                            console.log('Destroying tree part!');
                            this.hasBeenDestroyed = true;
                            clearInterval(this.damageInterval);

                            // If this is a trunk being destroyed, make other parts fall
                            if (this.data.type === 'trunk') {
                                this.makeTreeFall();
                            } else {
                                setTimeout(() => this.el.remove(), 0);
                            }
                        }
                    }
                }, 500); // Apply damage every 500ms
            }
        });

        // Stop damage when raycast stops intersecting
        this.el.addEventListener('raycaster-intersected-cleared', event => {
            console.log('Raycast no longer intersecting with: ' + this.data.type);
            this.isBeingHit = false;
            if (this.damageInterval) {
                clearInterval(this.damageInterval);
                this.damageInterval = null;
            }
        });

        // Reakce na vlastní událost 'collide-with-character', kterou vysílá postava
        this.el.addEventListener('collide-with-character', event => {
            console.log('Collision with tree part type: ' + this.data.type);
            this.damage += 60; // Každá kolize způsobí překážce 60 bodů poškození

            // Pokud překážka utrpěla víc poškození než má sílu a ještě nebyla zničena:
            if (this.damage > this.data.strength && !this.hasBeenDestroyed) {
                this.hasBeenDestroyed = true; // Označ ji jako zničenou, aby se neodstranila vícekrát

                // If this is a trunk being destroyed, make other parts fall
                if (this.data.type === 'trunk') {
                    this.makeTreeFall();
                } else {
                    setTimeout(() => this.el.remove(), 0);
                }
            }
        });
    },

    makeTreeFall() {
        // Find all tree parts in the scene
        const treeParts = document.querySelectorAll('[obstacle]');
        
        treeParts.forEach(part => {
            const obstacle = part.components.obstacle;
            if (obstacle && !obstacle.hasBeenDestroyed) {
                // Add physics to make it fall
                part.setAttribute('dynamic-body', {
                    mass: 1,
                    linearDamping: 0.01,
                    angularDamping: 0.01
                });
                
                // Add some random rotation for more realistic falling
                const randomRotation = {
                    x: Math.random() * 360,
                    y: Math.random() * 360,
                    z: Math.random() * 360
                };
                part.setAttribute('rotation', randomRotation);
                
                // Remove the part after 5 seconds
                setTimeout(() => {
                    if (part.parentNode) {
                        part.parentNode.removeChild(part);
                    }
                }, 5000);
            }
        });
    },

    // Helper method to check if this is a trunk
    isTrunk() {
        return this.data.type === 'trunk';
    },

    // Helper method to check if this is a crown
    isCrown() {
        return this.data.type === 'crown';
    },

    // Helper method to check if this is a branch
    isBranch() {
        return this.data.type === 'branch';
    }
});
