import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';

export class Game {
    BACKGROUND_COLOR_SCENE = 0xa0A0A0;
    NEAR_CAMERA = 0.1;
    FAR_CAMERA = 1000;
    FOV_CAMERA = 75;
    RATIO_CAMERA = window.innerWidth / window.innerHeight;
    POSITION_Z_CAMERA = 5;
    POSITION_Y_CAMERA = 1;

    constructor(widthRender, heightRender) {
        this.widthRender = widthRender;
        this.heightRender = heightRender;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        this.renderer.render(this.scene, this.camera);
    }


    addScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(this.BACKGROUND_COLOR_SCENE);

        this.addMainCamera();

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.widthRender, this.heightRender);
        document.body.appendChild(this.renderer.domElement)

        this.animate();
    }

    addMainCamera() {
        this.camera = new THREE.PerspectiveCamera(this.FOV_CAMERA, this.RATIO_CAMERA, this.NEAR_CAMERA, this.FAR_CAMERA);
        this.camera.position.z = this.POSITION_Z_CAMERA;
    }
}