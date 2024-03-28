import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.150.1-r75e9MvYwn7pBFuUt6Gu/mode=imports,min/optimized/three.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

import { MapMaze } from './map_maze.js';
import { Wall } from './wall.js';

import { Player } from './player.js';

export class Game {
    BACKGROUND_COLOR_SCENE = 0x0A0A0A;
    NEAR_CAMERA = 0.1;
    FAR_CAMERA = 1000;
    FOV_CAMERA = 75;
    RATIO_CAMERA = window.innerWidth / window.innerHeight;
    POSITION_Z_CAMERA = 8;
    POSITION_Y_CAMERA = 1;

    SPOTLIGHT_POSITION = { x: 0, y: 7, z: 0 };
    SPOTLIGHT_DISTANCE = 10;
    SPOTLIGHT_ANGLE = Math.PI / 5;
    SPOTHLIGHT_INTENSITY = 90;

    MAP_WIDTH = 101;
    MAP_HEIGHT = 101;

    LIGHT_COLOR = 0xffffff;
    LIGHT_INTENSITY = 0.5;

    WALL_MIN_HEIGHT = 2;
    WALL_MAX_HEIGHT = 3;

    CONTROLS_MIN_DISTANCE = 2;
    CONTROLS_MAX_DISTANCE = 10;

    GRAVITY = -9.8;

    isStarted = false;

    constructor(widthRender, heightRender) {
        this.widthRender = widthRender;
        this.heightRender = heightRender;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.map = null;
        this.ground = null;
        this.physicsWorld = null;

    }

    animate = () => {
        requestAnimationFrame(this.animate);
        this.physicsWorld.stepSimulation(1 / 60, 10)
        if (this.isStarted) {
            this.player.update();
        }

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

            this.addMainCamera();
            this.placeGround();
            this.animate();
        }.bind(this));
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
        const groundGeometry = new THREE.PlaneGeometry(this.MAP_WIDTH, this.MAP_HEIGHT, 10, 10);
        const groundMaterial = new THREE.MeshStandardMaterial({
            side: THREE.DoubleSide,
            color: 0x0A0A0A
        });

        const texture = new THREE.TextureLoader().load(
            './assets/img/textures/Carpet.jpg',
            texture => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(this.MAP_WIDTH, this.MAP_HEIGHT);
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
        const spotLight = new THREE.SpotLight(this.LIGHT_COLOR, this.SPOTHLIGHT_INTENSITY);
        spotLight.angle = this.SPOTLIGHT_ANGLE;
        spotLight.distance = this.SPOTLIGHT_DISTANCE;
        spotLight.position.set(this.SPOTLIGHT_POSITION.x, this.SPOTLIGHT_POSITION.y, this.SPOTLIGHT_POSITION.z);
        spotLight.castShadow = true;
        this.player.recoverMesh().add(spotLight);
    }

    addMainCamera() {
        this.camera = new THREE.PerspectiveCamera(this.FOV_CAMERA, this.RATIO_CAMERA, this.NEAR_CAMERA, this.FAR_CAMERA);
        this.camera.position.z = this.POSITION_Z_CAMERA;

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.update();
        controls.minDistance = this.CONTROLS_MIN_DISTANCE;
        controls.maxDistance = this.CONTROLS_MAX_DISTANCE;

        controls.maxPolarAngle = Math.PI / 2;
        controls.dampingFactor = 0.005;
    }

    start() {
        if (this.isStarted) {
            return;
        }

        this.player = new Player(this.physicsWorld);

        this.addSpotLight();
        this.player.addMesh(this.scene);

        this.isStarted = true
        this.map = new MapMaze(this.MAP_WIDTH, this.MAP_HEIGHT).createMap();

        for (let y = 0; y < this.MAP_HEIGHT; y++) {
            for (let x = 0; x < this.MAP_WIDTH; x++) {
                if (!this.map[y][x]) {
                    const randomHeight = Math.floor(Math.random() * this.WALL_MAX_HEIGHT) + this.WALL_MIN_HEIGHT;
                    this.scene.add(new Wall(randomHeight, x - (this.MAP_WIDTH / 2), y - (this.MAP_WIDTH / 2)).addWall());
                }
            }
        }
    }

    movePlayer(where) {
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
}