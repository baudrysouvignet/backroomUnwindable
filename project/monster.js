import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.150.1-r75e9MvYwn7pBFuUt6Gu/mode=imports,min/optimized/three.js';


export class Monster {
    SPEED = 0.04;
    direction = new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);

    moveDirection = {
        forward: 0,
        backward: 0,
        leftward: 0,
        rightward: 0,
    };
    isForward = true;
    isBackward = false;
    isLeft = false;
    isRight = false;

    constructor(physicsWorld, radius = 0.4, position = new THREE.Vector3(1, 0, 3), color = 0x00ff00) {
        this.physicsWorld = physicsWorld;
        this.radius = radius;
        this.position = position;
        this.color = color;
        this.mesh = null;

        this.createMesh();
        this.createPhysicsBody();
    }

    createMesh() {
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: this.color });
        this.mesh = new THREE.Mesh(geometry, material);
    }

    addMesh(scene) {
        scene.add(this.mesh);
    }

    recoverMesh() {
        return this.mesh;
    }

    createPhysicsBody() {
        const shape = new Ammo.btSphereShape(this.radius);
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(this.position.x, this.position.y, this.position.z));
        const mass = 1;
        const inertia = new Ammo.btVector3(0, 0, -10000);
        shape.calculateLocalInertia(mass, inertia);
        const motionState = new Ammo.btDefaultMotionState(transform);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia);
        this.body = new Ammo.btRigidBody(rbInfo);
        this.physicsWorld.addRigidBody(this.body);
    }

    updateMoveDirection() {
        this.moveDirection.forward = this.isForward || this.isRight ? 1 : 0;
        this.moveDirection.backward = this.isBackward || this.isLeft ? 1 : 0;
        this.moveDirection.right = this.isBackward || this.isRight ? 1 : 0;
        this.moveDirection.left = this.isForward || this.isLeft ? 1 : 0;
    }

    moveBall() {
        this.updateMoveDirection();
        let scalingFactor = 1.3;

        let moveX = this.moveDirection.right * scalingFactor - this.moveDirection.left * scalingFactor;
        let moveZ = this.moveDirection.backward * scalingFactor - this.moveDirection.forward * scalingFactor;
        let moveY = 0;

        if (moveX === 0 && moveZ === 0) return;

        let resultantImpulse = new Ammo.btVector3(moveX, moveY, moveZ);
        this.body.setLinearVelocity(resultantImpulse);
    }


    update(game, scene) {
        this.moveBall();

        const transform = new Ammo.btTransform();
        this.body.getMotionState().getWorldTransform(transform);
        const pos = transform.getOrigin();
        this.mesh.position.set(pos.x(), pos.y(), pos.z());
    }

    collisionCallback(result) {
        this.hasHit = function () {
            return result.hasHit();
        };

        this.getHitPointWorld = function () {
            return result.getHitPointWorld();
        };

        this.getHitNormalWorld = function () {
            return result.getHitNormalWorld();
        };
    }

    normalizeDirection() {
        this.direction.normalize();
    }
}