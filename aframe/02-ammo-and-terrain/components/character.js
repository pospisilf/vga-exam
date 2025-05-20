AFRAME.registerComponent('character', {
    init() {
        console.log('Hello, character!');

        this.health = 100
        this.collisionBodies = []
        this.runningState = 'idle'
        this.velocity = null
        this.rotationY = 0
        this.characterModel = this.el.children[0]

        document.addEventListener('keydown', event => {
            this.wakeUp()
            if (event.key === 'ArrowLeft') {
                this.startRunning('left');
            } else if (event.key === 'ArrowRight') {
                this.startRunning('right');
            } else if (event.key === 'ArrowUp') {
                this.startRunning('up');
            } else if (event.key === 'ArrowDown') {
                this.startRunning('down');
            } else if (event.key === ' ') {
                this.jump()
            }
        })
        document.addEventListener('keyup', () => this.stop())
        this.el.addEventListener('collidestart', event => this.processCollision(event))
    },

    wakeUp() {
        this.el.body.setActivationState(1); // Wake it up
    },

    startRunning(direction) {
        if (direction === this.runningState) return
        this.runningState = direction

        if (direction === 'left') {
            this.velocity= new CANNON.Vec3(-3, 0, 0)
            this.rotationY = -90
        } else if (direction === 'right') {
            this.velocity = new CANNON.Vec3(3, 0, 0)
            this.rotationY = 90
        } else if (direction === 'up') {
            this.velocity = new CANNON.Vec3(0, 0, -3)
            this.rotationY = 180
        } else if (direction === 'down') {
            this.velocity = new CANNON.Vec3(0, 0, 3)
            this.rotationY = 0
        }

        // rotate the character to the correct direction of movement
        this.characterModel.setAttribute('animation', {
            property: 'rotation',
            to: {x: 0, y: this.rotationY, z: 0},
            dur: 500,
            easing: 'easeOutQuad',
        })

        // start the character's animation
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'run',
            crossFadeDuration: 0.2,
        });
    },

    stop() {
        // stop moving the object
        this.velocity = null;

        if (this.runningState !== 'jumping') {
            this.runningState = 'idle';

            // stop the animation
            this.characterModel.setAttribute('animation-mixer', {
                clip: 'idle',
                crossFadeDuration: 0.2,
            });
        }
    },

    jump() {
        if (this.runningState === 'jumping') return

        this.runningState = 'jumping'

        let currentVelocity = this.el.body.getLinearVelocity();
        this.el.body.setLinearVelocity(new Ammo.btVector3(currentVelocity.x(), 5, currentVelocity.z()));

        setTimeout(() => {
            // play the idle animation
            this.characterModel.setAttribute('animation-mixer', {
                clip: 'idle',
                loop: 'repeat',
                crossFadeDuration: 0.2,
            });

            this.runningState = 'idle'
        }, 700)

    },

    tick() {
        if (this.velocity) {
            // constantly update the velocity of the character to the speed of the movement
            // bypasses friction slowing down the character
            // do not set y axis velocity, because it is already set by the physics system (gravity)
            // this.el.body.velocity.x = this.velocity.x
            // this.el.body.velocity.z = this.velocity.z

            let currentVelocity = this.el.body.getLinearVelocity();
            let newVelocity = new Ammo.btVector3(this.velocity.x, currentVelocity.y(), this.velocity.z);  // Set X to 10, keep Y and Z as they are
            this.el.body.setLinearVelocity(newVelocity);
            this.el.body.setFriction(2)
        }
    },

    processCollision(event) {
        console.log('Collision with', event)
        const otherEntity = event.detail.targetEl;


        // consider only collisions with obstacles (entities having obstacle component)
        if (!otherEntity?.hasAttribute('obstacle')) {
            return;
        }

        // do not collide repeatedly with the same entity
        if (this.collisionBodies.includes(otherEntity)) {
            return;
        }

        // add the entity, which we collided with, to the array, so we can avoid another collision with the same entity
        this.collisionBodies.push(otherEntity);

        // if there is a delay of at least 500ms between the collisions, enable collision with the same entity
        // in other words: remove the collided entity from the array after 500ms if no other collisions happen in the meantime
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(() =>
                this.collisionBodies.splice(this.collisionBodies.indexOf(otherEntity)),
            500
        );

        // the collision affects the character's health
        this.health -= 40;
        console.log('Health', this.health)

        // if there is no health remaining, the game is over
        if (this.health < 0) {
            document.getElementById('game-over').style.display = 'block';
        }

        // tell the other entity that the collision happened, so it can destroy itself
        otherEntity.emit('collide-with-character')
    },
});