import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.150.1-r75e9MvYwn7pBFuUt6Gu/mode=imports,min/optimized/three.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

import { MapMaze } from './map_maze.js';
import { Wall } from './wall.js';

import { Player } from './player.js';

import { Monster } from './monster.js';

export class Game {
    BACKGROUND_COLOR_SCENE = 0x0A0A0A;
    NEAR_CAMERA = 0.1;
    FAR_CAMERA = 1000;
    FOV_CAMERA = 75;
    RATIO_CAMERA = window.innerWidth / window.innerHeight;

    POSITION_X_CAMERA = 4;
    POSITION_Y_CAMERA = 4;
    POSITION_Z_CAMERA = 9;

    SPOTLIGHT_POSITION = { x: 0, y: 7, z: 0 };
    SPOTLIGHT_DISTANCE = 15;
    SPOTLIGHT_ANGLE = Math.PI / 5;
    SPOTHLIGHT_INTENSITY = 70;

    LIGHT_COLOR = 0xffffff;
    LIGHT_INTENSITY = 0.5;

    WALL_MIN_HEIGHT = 1;
    WALL_MAX_HEIGHT = 2;

    CONTROLS_MIN_DISTANCE = 2;
    CONTROLS_MAX_DISTANCE = 10;

    GRAVITY = -9.8;

    isStarted = false;
    startedAt = null;

    constructor(widthRender, heightRender, size) {
        this.widthRender = widthRender;
        this.heightRender = heightRender;
        this.mapWidth = size;
        this.mapHeight = size;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.map = null;
        this.ground = null;
        this.physicsWorld = null;
        this.spotLight = null;
        this.monster = null;
    }

    animate = () => {
        if (!this.isStarted) {
            return;
        }
        requestAnimationFrame(this.animate);
        this.finish();
        this.physicsWorld.stepSimulation(1 / 60, 10)
        this.checkColision();
        if (this.isStarted) {
            this.player.update(this);
        }
        if (this.monster) {
            this.monster.update(this, this.scene);
        }
        this.updateCamera();
        this.updateSpotLight();
        this.renderer.render(this.scene, this.camera);
    }

    addScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.BACKGROUND_COLOR_SCENE);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.widthRender, this.heightRender);
        document.body.appendChild(this.renderer.domElement);

        this.createPhysicsWorld();
    }

    createPhysicsWorld() {
        Ammo().then(function (AmmoLib) {
            Ammo = AmmoLib;

            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
            const overlappingPairCache = new Ammo.btDbvtBroadphase();
            const solver = new Ammo.btSequentialImpulseConstraintSolver();

            this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
            this.physicsWorld.setGravity(new Ammo.btVector3(0, this.GRAVITY, 0));

            this.initGroundPhysics(this.physicsWorld);

            this.placeGround();
        }.bind(this));
    }


    finish() {
        if (this.player.recoverMesh().position.z > this.mapHeight / 2 || this.player.recoverMesh().position.z < -this.mapHeight / 2 || this.player.recoverMesh().position.x > this.mapWidth / 2 || this.player.recoverMesh().position.x < -this.mapWidth / 2) {
            this.die();
            document.querySelector('.finish').style.display = 'flex';
            document.querySelector('#timeGame').innerHTML = Math.floor((Date.now() - this.startedAt) / 1000) + ' secondes';


        }
    }

    initGroundPhysics(physicsWorld) {
        const groundShape = new Ammo.btStaticPlaneShape(new Ammo.btVector3(0, 1, 0), 0);
        const groundTransform = new Ammo.btTransform();
        groundTransform.setIdentity();
        const groundMass = 0;
        const localInertia = new Ammo.btVector3(0, 0, 0);
        const motionState = new Ammo.btDefaultMotionState(groundTransform);
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(groundMass, motionState, groundShape, localInertia);
        const groundBody = new Ammo.btRigidBody(rbInfo);
        physicsWorld.addRigidBody(groundBody);
    }

    placeGround() {
        const groundGeometry = new THREE.PlaneGeometry(this.mapWidth, this.mapHeight, 10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: 0x0A0A0A
        });

        const texture = new THREE.TextureLoader().load(
            './assets/img/textures/Carpet.jpg',
            texture => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(this.mapWidth, this.mapHeight);
                groundMaterial.map = texture;
                groundMaterial.needsUpdate = true;
            }
        );

        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.position.y = 0;
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);
    }

    addSpotLight() {
        this.spotLight = new THREE.SpotLight(this.LIGHT_COLOR, this.SPOTHLIGHT_INTENSITY);
        this.spotLight.angle = this.SPOTLIGHT_ANGLE;
        this.spotLight.distance = this.SPOTLIGHT_DISTANCE;
        this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);
    }

    updateSpotLight() {
        let mesh = this.player.recoverMesh();
        let position = mesh.position;

        this.spotLight.position.set(position.x + this.SPOTLIGHT_POSITION.x, position.y + this.SPOTLIGHT_POSITION.y, position.z + this.SPOTLIGHT_POSITION.z);
        this.spotLight.target = mesh;
    }

    addMainCamera() {
        this.camera = new THREE.PerspectiveCamera(this.FOV_CAMERA, this.RATIO_CAMERA, this.NEAR_CAMERA, this.FAR_CAMERA);
        this.camera.position.set(this.POSITION_X_CAMERA, this.POSITION_Y_CAMERA, this.POSITION_Z_CAMERA)
        this.camera.lookAt(this.player.recoverMesh().position);
    }

    updateCamera() {
        this.camera.lookAt(this.player.recoverMesh().position);
        let position = this.player.recoverMesh().position;
        this.camera.position.set(position.x + this.POSITION_X_CAMERA, position.y + this.POSITION_Z_CAMERA, position.z + this.POSITION_Y_CAMERA)
    }

    start() {
        if (this.isStarted) {
            return;
        }
        this.startedAt = Date.now();
        this.isStarted = true

        this.player = new Player(this.physicsWorld);
        this.monster = new Monster(this.physicsWorld);

        this.addSpotLight();
        this.addMainCamera();
        this.monster.addMesh(this.scene)
        this.animate();
        this.player.addMesh(this.scene);


        this.map = new MapMaze(this.mapWidth, this.mapHeight).createMap();

        for (let y = 0; y < this.mapHeight; y++) {
            for (let x = 0; x < this.mapWidth; x++) {
                if (!this.map[y][x]) {
                    const randomHeight = Math.floor(Math.random() * this.WALL_MAX_HEIGHT) + this.WALL_MIN_HEIGHT;
                    this.scene.add(new Wall(this.physicsWorld, randomHeight, x - (this.mapWidth / 2), y - (this.mapWidth / 2)).addWall());
                }
            }
        }
    }

    movePlayer(where) {
        if (!this.isStarted) {
            return;
        }
        if (where === 'forward') {
            this.player.forward('keydown');
        } else if (where === 'backward') {
            this.player.backward('keydown');
        } else if (where === 'leftward') {
            this.player.leftward('keydown');
        } else if (where === 'rightward') {
            this.player.rightward('keydown');
        }
    }

    stopPlayer(where) {
        if (!this.isStarted) {
            return;
        }
        if (where === 'forward') {
            this.player.forward('keydup');
        } else if (where === 'backward') {
            this.player.backward('keydup');
        } else if (where === 'leftward') {
            this.player.leftward('keydup');
        } else if (where === 'rightward') {
            this.player.rightward('keydup');
        }
    }

    resizeWindow() {
        this.widthRender = window.innerWidth;
        this.heightRender = window.innerHeight;
        this.renderer.setSize(this.widthRender, this.heightRender);
        this.camera.aspect = this.widthRender / this.heightRender;
        this.camera.updateProjectionMatrix();
    }

    checkColision() {
        if (this.player.recoverMesh().position.distanceTo(this.monster.recoverMesh().position) < this.player.radius + this.monster.radius) {
            if (this.startedAt + 1000 < Date.now()) {
                this.die('monster');
            }
        }
    }

    die(type) {
        this.isStarted = false;
        this.scene.remove(this.player.recoverMesh());
        this.scene.remove(this.spotLight);

        if (type === 'monster') {
            document.querySelector('.dieMonster').style.display = 'flex';
            return;
        }
        document.querySelector('.die').style.display = 'flex';
    }
}