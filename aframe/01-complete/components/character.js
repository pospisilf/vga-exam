AFRAME.registerComponent('character', {
    init() {
        console.log('Hello, you cube!');

        this.health = 100;
        this.collisionBodies = [];

        document.addEventListener('keydown', event => {
            const pos = this.el.getAttribute('position')

            if (event.key === 'ArrowLeft') {
                // 1st approach: directly change position without animation
                // jump the character to another position without animation (immediately)
                this.el.setAttribute('position', {x: pos.x - 1, y: pos.y, z: pos.z})
                this.el.components['dynamic-body'].syncToPhysics();

            } else if (event.key === 'ArrowRight') {
                // 2nd approach: with animation
                // move the character to another position using a classic animation (however, does not work with physics)
                // this.el.setAttribute('animation', {
                //     property: 'position',
                //     to: {x: pos.x + 1, y: pos.y, z: pos.z},
                //     dur: 1000, // ms
                //     easing: 'easeOutQuad'
                // });

                // 3rd approach: applying physics force
                // apply a force in the physics system to move the character
                this.el.body.applyImpulse(
                    /* impulse */        new CANNON.Vec3(10, 0, 0),
                    /* world position */ new CANNON.Vec3(pos.x, pos.y, pos.z + 3)
                )

                // 4th approach: directly change velocity
                // this.el.body.velocity.x = 3;
            }
        })

        this.el.addEventListener('collide', event => {
            const otherBody = event.detail.body;
            const otherEntity = otherBody.el;

            // consider only collisions with obstacles (entities having obstacle component)
            if (!otherEntity?.hasAttribute('obstacle')) {
                return;
            }

            // do not collide repeatedly with the same entity
            if (this.collisionBodies.includes(otherBody)) {
                return;
            }

            // add the entity, which we collided with, to the array, so we can avoid another collision with the same entity
            this.collisionBodies.push(otherBody);

            // if there is a delay of at least 500ms between the collisions, enable collision with the same entity
            // in other words: remove the collided entity from the array after 500ms if no other collisions happen in the meantime
            clearTimeout(this.collisionTimeout);
            this.collisionTimeout = setTimeout(
                () => this.collisionBodies.splice(this.collisionBodies.indexOf(otherBody)),
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
            otherEntity?.emit('collide-with-character')
        })
    }
});