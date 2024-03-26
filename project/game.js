import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.150.1-r75e9MvYwn7pBFuUt6Gu/mode=imports,min/optimized/three.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

import { MapMaze } from './map_maze.js';
import { Wall } from './wall.js';

export class Game {
    BACKGROUND_COLOR_SCENE = 0x0A0A0A;
    NEAR_CAMERA = 0.1;
    FAR_CAMERA = 1000;
    FOV_CAMERA = 75;
    RATIO_CAMERA = window.innerWidth / window.innerHeight;
    POSITION_Z_CAMERA = 8;
    POSITION_Y_CAMERA = 1;

    MAP_WIDTH = 101;
    MAP_HEIGHT = 101;

    LIGHT_COLOR = 0xff35;
    LIGHT_INTENSITY = 0.5;

    isStarted = false;

    constructor(widthRender, heightRender) {
        this.widthRender = widthRender;
        this.heightRender = heightRender;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.map = null;
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        this.renderer.render(this.scene, this.camera);
    }


    addScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.BACKGROUND_COLOR_SCENE);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.widthRender, this.heightRender);
        document.body.appendChild(this.renderer.domElement)

        this.addMainCamera();

        const spotLight = new THREE.SpotLight(0xffffff, 85);
        spotLight.angle = Math.PI / 5;
        spotLight.distance = 10;
        spotLight.position.set(0, 7, 0);
        spotLight.castShadow = true;
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        spotLightHelper.visible = true;
        this.scene.add(spotLightHelper)
        this.scene.add(spotLight);


        this.animate();
    }

    addMainCamera() {
        this.camera = new THREE.PerspectiveCamera(this.FOV_CAMERA, this.RATIO_CAMERA, this.NEAR_CAMERA, this.FAR_CAMERA);
        this.camera.position.z = this.POSITION_Z_CAMERA;

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.update();
        controls.minDistance = 2;
        controls.maxDistance = 10;

        controls.maxPolarAngle = Math.PI / 2;
        controls.dampingFactor = 0.005;
    }

    start() {
        if (this.isStarted) {
            return;
        }

        this.isStarted = true
        this.map = new MapMaze(this.MAP_WIDTH, this.MAP_HEIGHT).createMap();

        for (let y = 0; y < this.MAP_HEIGHT; y++) {
            for (let x = 0; x < this.MAP_WIDTH; x++) {
                if (!this.map[y][x]) {
                    const randomHeight = Math.floor(Math.random() * 3) + 1; 
                    this.scene.add(new Wall(randomHeight, x - (this.MAP_WIDTH / 2), y - (this.MAP_WIDTH / 2)).addWall());
                }
            }
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