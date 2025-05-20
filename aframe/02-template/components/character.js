AFRAME.registerComponent('character', {
    init() {
        console.log('Hello, character!');

        this.health = 100;
        this.collisionBodies = [];

        this.el.addEventListener('collide', event => this.processCollision(event))

        // TODO

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
        otherEntity.el.emit('collide-with-character')
    },
});