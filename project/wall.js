import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.150.1-r75e9MvYwn7pBFuUt6Gu/mode=imports,min/optimized/three.js';

export class Wall {
    LIGHT_COLOR = 0x0A0A0A;

    constructor(physicsWorld, height, positionX, positionY) {
        this.physicsWorld = physicsWorld;
        this.height = height;
        this.positionX = positionX;
        this.positionY = positionY;
    }

    physics(wall) {
        const shape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, this.height / 2, 0.5)); // Half the dimensions for collider
        const mass = 0; // Static wall, so mass is 0
        const localInertia = new Ammo.btVector3(0, 0, 0);
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(wall.position.x, wall.position.y, wall.position.z));
        const motionState = new Ammo.btDefaultMotionState(transform);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
        const wallBody = new Ammo.btRigidBody(rbInfo);
        this.physicsWorld.addRigidBody(wallBody);
    }

    addWall() {
        const geometry = new THREE.BoxGeometry(1, this.height, 1);
        const material = new THREE.MeshStandardMaterial({
            color: this.LIGHT_COLOR,
            emissive: 0x111111,
        });

        const texture = new THREE.TextureLoader().load(
            './assets/img/textures/backroomWall.jpg',
            (texture) => {
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
        wall.position.y = this.height / 2; 

        this.physics(wall);

        return wall;
    }
}