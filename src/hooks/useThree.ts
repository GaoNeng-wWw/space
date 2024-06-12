import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
export const useScene = () => {
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x160016);
    let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
    camera.position.set(0, 4, 21);
    camera.position.z = 30;
    let renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setClearColor(0x0E2255);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    window.addEventListener("resize", () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    })

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    const tasks:((params: {renderer:THREE.Renderer, camera: THREE.Camera})=>void)[] = [];
    const onUpdate = (cb: (
        params: {renderer:THREE.Renderer, camera: THREE.Camera}
    )=>void) => tasks.push(cb);
    const update = () => {
        requestAnimationFrame(update);
        renderer.render(scene, camera);
        controls.update()
        tasks.forEach((t)=>{
            t({renderer, camera})
        })
    };
    return {scene, update, onUpdate};
}