<template>
  <canvas ref="canvas" />
</template>
<script lang="ts" setup>
import fragmentShader from '../shader/perlin-noise-fragment.glsl'
import vertexShader from '../shader/perlin-noise-vertex.glsl';
import { ref } from 'vue';
import {useScene} from '../hooks/useThree';
import * as THREE from 'three';
const canvas = ref();
const {scene,update, onUpdate,camera} = useScene(canvas, '#141414');
const uniforms = {
  time: {
    value: 0.0
  },
  pointscale: {
    value: 0.1
  },
  decay: {
    value: 0.01
  },
  complex: {
    value: 1
  },
  waves: {
    value: 20
  },
  eqcolor: {
    value: 11
  },
  fragment: {
    value: true
  },
  redhell: {
    value: true
  }
}
const mesh = new THREE.Object3D();
const g = new THREE.IcosahedronBufferGeometry(1, 64);
const material = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader,
  uniforms,
  wireframe: false
})
mesh.add(new THREE.Points(g, material));
scene.add(mesh)
camera.position.set(scene.position.x,scene.position.y,-5)
onUpdate(()=>{
  uniforms['time'].value += 0.005
})
update()
</script>