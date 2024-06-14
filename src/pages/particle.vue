<template>
  <canvas ref="canvas" />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useScene } from "../hooks/useThree";
import * as THREE from "three";

const canvas = ref<HTMLCanvasElement>();


  const {scene,update,onUpdate} = useScene(canvas);


  const g = new THREE.Group()

  const planetGeometry = new THREE.SphereGeometry(14);
    
  const planetMaterial = new THREE.MeshPhongMaterial({
    color: 0x37BE95,
    transparent: false,
    blending: THREE.NoBlending
  });
  planetMaterial.flatShading = true;
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);

  planet.castShadow = true;
  planet.receiveShadow = true;
  planet.rotation.order = "ZYX";
  planet.rotation.z = 0.2;
  g.add(planet)


  let uniforms = {
    time: {value: 0}
  }

  let sizes = [];
  let shift: number[] = [];
  let pushShift = () => {
    shift.push(
      Math.random() * Math.PI, 
      Math.random() * Math.PI * 2, 
      (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
      Math.random() * 0.9 + 0.1
    );
  }
  let pts = new Array(50000).fill(0).map(() => {
    sizes.push(Math.random() * 1.5 + 0.5);
    pushShift();
    return new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 14);
  })
  for(let i = 0; i < 100000; i++){
    let r = 40, R = 14;
    let rand = Math.pow(Math.random(), 2);
    let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
    pts.push(new THREE.Vector3().setFromCylindricalCoords(radius, Math.random() * 2 * Math.PI, (Math.random() - 0.5) * 2 ));
    sizes.push(Math.random() * 1.5 + 0.5);
    pushShift();
  }

  let g2 = new THREE.BufferGeometry().setFromPoints(pts);
  g2.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
  g2.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));
  let m = new THREE.PointsMaterial({
    size: 0.125,
    transparent: true,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  m.onBeforeCompile = (shader) => {
      shader.uniforms.time = uniforms.time;
      shader.vertexShader = `
        uniform float time;
        attribute float sizes;
        attribute vec4 shift;
        varying vec3 vColor;
        ${shader.vertexShader}
      `.replace(
        `gl_PointSize = size;`,
        `gl_PointSize = size * sizes;`
      ).replace(
        `#include <color_vertex>`,
        `#include <color_vertex>
          float d = length(abs(position) / vec3(40., 10., 40));
          d = clamp(d, 0., 1.);
          vColor = mix(vec3(227., 155., 0.), vec3(100., 50., 255.), d) / 255.;
        `
      ).replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
          float t = time;
          float moveT = mod(shift.x + shift.z * t, PI2);
          float moveS = mod(shift.y + shift.z * t, PI2);
          transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.w;
        `
      );
      shader.fragmentShader = `
        varying vec3 vColor;
        ${shader.fragmentShader}
      `.replace(
        `#include <clipping_planes_fragment>`,
        `#include <clipping_planes_fragment>
          float d = length(gl_PointCoord.xy - 0.5);
          //if (d > 0.5) discard;
        `
      ).replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `vec4 diffuseColor = vec4( vColor, smoothstep(0.5, 0.1, d)/* * 0.5 + 0.5*/ );`
      );
    }
  let p = new THREE.Points(g2, m);
  p.rotation.order = "ZYX";
  p.rotation.z = 0.2;
  scene.add(p)

  scene.add(g);

  onUpdate(()=>{
    uniforms.time.value +=0.1
  })

  update()
</script>

<style>
body{
  overflow: hidden;
  margin: 0;
}
</style>