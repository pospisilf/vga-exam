AFRAME.registerComponent('character', {
    init() {
        console.log('Hello, character!'); // Výpis do konzole při inicializaci

        this.health = 100; // Výchozí zdraví postavy
        this.collisionBodies = []; // Sledování entit, se kterými postava již kolidovala

        // --- VLOŽENÉ PROMĚNNÉ ---
        this.runningState = 'idle'; // Aktuální stav pohybu postavy ('idle', 'left', 'right')
        this.velocity = null; // Směr a rychlost pohybu (vektor CANNON.Vec3)
        this.rotationY = 0; // Úhel rotace kolem osy Y
        this.rotationStep = 15; // Velikost kroku rotace ve stupních
        this.characterModel = this.el.children[0]; // Předpokládá se, že první potomek entity je 3D model postavy
        this.currentModel = 'axe'; // Začínáme se sekerou
        this.blocksMined = 0; // Počet vytěžených bloků
        this.hasPickaxe = false; // Zda má hráč krumpáč

        // Nastavení počátečního modelu na sekeru
        this.characterModel.setAttribute('gltf-model', '#axe');
        this.characterModel.setAttribute('scale', '0.2 0.2 0.2');

        // Přidání raycasteru pro detekci bloků
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
       

        // --- OVLÁDÁNÍ POMOCÍ KLÁVES ---
        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                this.rotateCharacter(this.rotationStep); // otoč vlevo o malý krok
            } else if (event.key === 'ArrowRight') {
                this.rotateCharacter(-this.rotationStep); // otoč vpravo o malý krok
            } else if (event.key === 'ArrowUp') {
                this.startRunning(); // běž dopředu
            } else if (event.key === 'ArrowDown') {
                this.rotateCharacter(180); // otoč se o 180 stupňů
            } else if (event.key === 'Space') {
                this.breakBlock();
            } else if (event.key === 'm') {
                this.switchModel();
            }
        });

        document.addEventListener('keyup', () => this.stop()); // při uvolnění klávesy zastav pohyb

        // Událost při kolizi s jiným objektem
        //this.el.addEventListener('collide', event => this.processCollision(event));
    },

    // --- SPUŠTĚNÍ BĚHU ---
    startRunning() {
        if (this.runningState === 'running') return;
        this.runningState = 'running';

        // Převod úhlu na radiány
        const angleRad = THREE.MathUtils.degToRad(this.rotationY);

        // Výpočet směrového vektoru podle aktuální rotace
        const speed = 3;
        const vx =  -Math.sin(angleRad) * speed;
        const vz = -Math.cos(angleRad) * speed;

        this.velocity = new CANNON.Vec3(vx, 0, vz);

        // Animace běhu
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'CharacterArmature|Run',
            crossFadeDuration: 0.2,
        });
    },

    rotateCharacter(degrees) {
        // Přidáme rotaci
        this.rotationY += degrees;
        
        // Normalizujeme úhel na rozsah 0-360
        this.rotationY = ((this.rotationY % 360) + 360) % 360;
        
        // Okamžitě aplikujeme rotaci na model
        this.characterModel.setAttribute('rotation', {
            x: 0,
            y: this.rotationY,
            z: 0
        });
    },

    // --- ZASTAVENÍ POHYBU ---
    stop() {
        this.velocity = null; // Zastav pohyb
        this.runningState = 'idle';

        // Přepnutí zpět na idle animaci
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'idle',
            crossFadeDuration: 0.2,
        });
    },

    // --- FUNKCE, KTERÁ SE VOLÁ KAŽDÝ SNÍMEK ---
    tick(time, deltaTime) {
        if (this.velocity) {
            // Neustále nastavuj rychlost pohybu – obejde zpomalování vlivem tření
            // Neovlivňuj osu Y, protože ta je řízena gravitací ve fyzikálním systému
            this.el.body.velocity.x = this.velocity.x;
            this.el.body.velocity.z = this.velocity.z;
        }
    },

    // --- FUNKCE PRO ROZBÍJENÍ BLOKŮ ---
    breakBlock() {
        const camera = this.el.querySelector('[camera]');
        if (!camera) return;

        // Nastavení směru raycasteru ve směru kamery
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(camera.object3D.quaternion);
        
        this.raycaster.set(camera.object3D.position, direction);

        // Získání všech bloků ve scéně
        const blocks = Array.from(document.querySelectorAll('a-box[obstacle]'));
        
        // Kontrola průsečíku s bloky
        const intersects = this.raycaster.intersectObjects(
            blocks.map(block => block.object3D),
            true
        );

        if (intersects.length > 0) {
            console.log("intersects je vetsi nez 0");
            const hitBlock = intersects[0].object.el;
            const distance = this.el.object3D.position.distanceTo(hitBlock.object3D.position);
            
            // Kontrola vzdálenosti a existence komponenty obstacle
            if (distance <= 2 && hitBlock.hasAttribute('obstacle')) {
                // Získání typu bloku a nástroje
                const blockType = hitBlock.getAttribute('obstacle').type;
                const currentTool = this.currentModel;

                // Kontrola, zda má hráč správný nástroj
                if (blockType === 'trunk' && currentTool !== 'axe') {
                    console.log('Pro vytěžení kmene potřebuješ sekeru!');
                    return;
                }

                // Animace sekání - několikrát opakujeme
                const chopAnimation = () => {
                    this.characterModel.setAttribute('animation-mixer', {
                        clip: 'idle',
                        crossFadeDuration: 0.2,
                        timeScale: 2
                    });
                };

                // Spustíme animaci 3x
                for (let i = 0; i < 3; i++) {
                    setTimeout(chopAnimation, i * 200);
                }

                // Po dokončení animací odstraníme blok
                setTimeout(() => {
                    // Odstranění bloku
                    hitBlock.parentNode.removeChild(hitBlock);

                    // Zvýšení počtu vytěžených bloků pouze pro kmeny
                    if (blockType === 'trunk') {
                        this.blocksMined++;
                        
                        // Kontrola, zda hráč získal krumpáč
                        if (this.blocksMined >= 5 && !this.hasPickaxe) {
                            this.hasPickaxe = true;
                            console.log('Získal jsi krumpáč! Stiskni M pro přepnutí nástrojů.');
                        }
                    }

                    // Vrátit model do výchozí pozice
                    this.characterModel.setAttribute('animation-mixer', {
                        clip: 'idle',
                        crossFadeDuration: 0.2,
                        timeScale: 1
                    });
                }, 600); // Čas na dokončení všech animací
            }
        }
    },

    // --- FUNKCE PRO PŘEPÍNÁNÍ MODELU ---
    switchModel() {
       // if (!this.hasPickaxe) return; // Pokud nemá krumpáč, nemůže přepínat

        const modelEntity = this.characterModel;
        if (this.currentModel === 'axe') {
            // Přepnutí na krumpáč
            modelEntity.setAttribute('gltf-model', '#pickaxe');
            modelEntity.setAttribute('scale', '0.2 0.2 0.2');
            this.currentModel = 'pickaxe';
        } else {
            // Přepnutí na sekeru
            modelEntity.setAttribute('gltf-model', '#axe');
            modelEntity.setAttribute('scale', '0.2 0.2 0.2');
            this.currentModel = 'axe';
        }
    },
});
