import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.150.1-r75e9MvYwn7pBFuUt6Gu/mode=imports,min/optimized/three.js';


export class Player {
  SPEED = 0.04;
  isForward = true;

  isBackward = false;
  isLeft = false;
  isRight = false;
  moveDirection = {
    forward: 0,
    backward: 0,
    leftward: 0,
    rightward: 0,
  };
  y = -1;

  constructor(physicsWorld, radius = 0.4, position = new THREE.Vector3(0.01, 10, 0), color = 0xff0000) {
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
    transform.setOrigin(new Ammo.btVector3(this.position.x, this.position.z, this.position.z));
    const mass = 1;
    const inertia = new Ammo.btVector3(0, 0, -10000);
    shape.calculateLocalInertia(mass, inertia);
    const motionState = new Ammo.btDefaultMotionState(transform);
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, inertia);
    this.body = new Ammo.btRigidBody(rbInfo);
    this.physicsWorld.addRigidBody(this.body);
  }

  forward(type) {
    if (type === 'keydown') {
      this.isForward = true;
    } else {
      this.isForward = false;
    }
  }

  backward(type) {
    if (type === 'keydown') {
      this.isBackward = true;
    } else {
      this.isBackward = false;
    }
  }

  leftward(type) {
    if (type === 'keydown') {
      this.isRight = true;
    } else {
      this.isRight = false;
    }

  }



  rightward(type) {
    if (type === 'keydown') {
      this.isLeft = true;
    } else {
      this.isLeft = false;
    }
  }

  updateMoveDirection() {
    this.moveDirection.forward = this.isForward || this.isRight ? 1 : 0;
    this.moveDirection.backward = this.isBackward || this.isLeft ? 1 : 0;
    this.moveDirection.right = this.isBackward || this.isRight ? 1 : 0;
    this.moveDirection.left = this.isForward || this.isLeft ? 1 : 0;
  }

  moveBall() {
    this.updateMoveDirection();
    let scalingFactor = 1;

    let moveX = this.moveDirection.right * scalingFactor - this.moveDirection.left * scalingFactor;
    let moveZ = this.moveDirection.backward * scalingFactor - this.moveDirection.forward * scalingFactor;
    let moveY = 0;

    if (moveX === 0 && moveZ === 0) return;

    let resultantImpulse = new Ammo.btVector3(moveX, moveY, moveZ);
    this.body.setLinearVelocity(resultantImpulse);
  }


  update(game) {
    this.moveBall();

    const transform = new Ammo.btTransform();
    this.body.getMotionState().getWorldTransform(transform);
    const pos = transform.getOrigin();
    const rot = transform.getRotation();
    this.mesh.position.set(pos.x(), pos.y(), pos.z());

    const velocity = this.body.getLinearVelocity();
    const magnitude = velocity.length();
    if (magnitude <= 0) {
      game.die(); d
    }
  }

}
