import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.150.1-r75e9MvYwn7pBFuUt6Gu/mode=imports,min/optimized/three.js';

export class Wall {
    LIGHT_COLOR = 0x0A0A0A;

    constructor(height, positionX, positionY) {
        this.height = height;
        this.positionX = positionX;
        this.positionY = positionY;
    }


    addWall() {
        const geometry = new THREE.BoxGeometry(1, this.height, 1);
        const material = new THREE.MeshStandardMaterial({
            color: this.LIGHT_COLOR,
            emissive: 0x111111,
        });

        const texture = new THREE.TextureLoader().load(
            './assets/img/textures/crate.gif',
            texture => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, this.height);
                material.map = texture;
                material.needsUpdate = true;
            }
        );

        let wall = new THREE.Mesh(geometry, material);
        wall.position.x = this.positionX;
        wall.position.z = this.positionY;
        wall.position.y = (this.height -1) /2;

        return wall;
    }
}