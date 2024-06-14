import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { Ref, watch } from 'vue';
export const useScene = (
  canvas: Ref<HTMLCanvasElement | undefined>
) => {
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x160016);
    let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
    camera.position.set(0, 4, 21);
    camera.position.z = 30;
    let renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        canvas: canvas.value
    });
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    watch(canvas, ()=>{
      renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          canvas: canvas.value
      })
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      window.addEventListener("resize", () => {
          camera.aspect = innerWidth / innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(innerWidth, innerHeight);
      })
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
    })

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