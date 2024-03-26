import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';

export class Wall {
    WALL_COLOR = 0x000000;

    constructor(height, positionX, positionY) {
        this.height = height;
        this.positionX = positionX;
        this.positionY = positionY;
    }


    addWall() {
        const geometry = new THREE.BoxGeometry(1, this.height, 1);
        const material = new THREE.MeshPhongMaterial({
            color: this.WALL_COLORWALL_COLOR
        });
        let cube = new THREE.Mesh(geometry, material);
        cube.position.x = this.positionX;
        cube.position.y = this.positionY;

        return cube;
    }
}