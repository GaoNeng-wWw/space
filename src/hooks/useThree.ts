import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { Ref, watch } from 'vue';
export const useScene = (
  canvas: Ref<HTMLCanvasElement | undefined>,
  color: number|string
) => {
    let scene = new THREE.Scene();
    let width = innerWidth;
    let height = innerHeight;
    scene.background = new THREE.Color(color);
    let camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.set(0, 4, 21);
    camera.position.z = 30;
    let renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: true,
        canvas: canvas.value
    });
    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    watch(canvas, ()=>{
      renderer = new THREE.WebGLRenderer({
          alpha: false,
          antialias: true,
          canvas: canvas.value
      })
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      window.addEventListener("resize", () => {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          width = innerWidth;
          height = innerHeight;
      })
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
    }, {immediate: true})

    const tasks:((params: {renderer:THREE.Renderer, camera: THREE.Camera, width: number, height: number})=>void)[] = [];
    const onUpdate = (cb: (
        params: {renderer:THREE.Renderer, camera: THREE.Camera, width: number, height: number}
    )=>void) => tasks.push(cb);
    const update = () => {
        requestAnimationFrame(update);
        renderer.render(scene, camera);
        controls.update()
        tasks.forEach((t)=>{
            t({renderer, camera, width, height})
        })
    };
    return {scene, update, onUpdate, camera};
}