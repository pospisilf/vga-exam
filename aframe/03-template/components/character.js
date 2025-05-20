AFRAME.registerComponent('character', {
    init() {
        console.log('Hello, character!');

        this.directions = {
            'back': new CANNON.Vec3(0, 0, 3),
            'right': new CANNON.Vec3(3, 0, 0),
            'front': new CANNON.Vec3(0, 0, -3),
            'left': new CANNON.Vec3(-3, 0, 0),
        }

        this.health = 100;
        this.collisionBodies = [];
        this.velocity = null;
        this.rotationY = 90;
        this.direction = 'right';
        this.characterModel = this.el.children[0];

        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                this.startRunning('left');
            } else if (event.key === 'ArrowRight') {
                this.startRunning('right');
            } else if (event.key === 'ArrowUp') {
                this.startRunning('front');
            } else if (event.key === 'ArrowDown') {
                this.startRunning('back');
            }
        })
        document.addEventListener('keyup', () => this.stop())
        this.el.addEventListener('collide', event => this.processCollision(event))
    },

    startRunning(direction) {
        const directions = Object.keys(this.directions);
        let diff = directions.indexOf(direction) - directions.indexOf(this.direction);
        diff = diff >= 3 ? diff - 4 : diff;
        diff = diff <= -3 ? diff + 4 : diff;

        this.rotationY += diff * 90;
        this.direction = direction;
        this.velocity = this.directions[direction];

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

        // stop the animation
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'idle',
            crossFadeDuration: 0.2,
        });
    },

    tick() {
        if (this.velocity !== null) {
            // constantly update the velocity of the character to the speed of the movement
            // bypasses friction slowing down the character
            // do not update Y to avoid interference with the physics gravity
            this.el.body.velocity.x = this.velocity.x
            this.el.body.velocity.z = this.velocity.z
        }
    },

    processCollision(event) {
        const otherEntity = event.detail.body;

        // consider only collisions with obstacles (entities having obstacle component)
        if (!otherEntity.el.hasAttribute('obstacle')) {
            return;
        }

        // do not collide repeatedly with the same entity
        if (this.collisionBodies.includes(otherEntity)) {
            return;
        }

        // add the entity, which we collided with, to the array, so we can avoid another collision with the same entity
        this.collisionBodies.push(otherEntity);

        // if there is a delay of at least 500ms between the collisions, enable repeated collision with the same entity
        // in other words: remove the collided entity from the array after 500ms if no other collisions happen in the meantime
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(() =>
                this.collisionBodies.splice(0, this.collisionBodies.length),
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
        otherEntity.el.emit('collide-with-character')
    },
});