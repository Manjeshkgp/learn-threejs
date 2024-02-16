import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import nebula from "../img/nebula.jpg";
import stars from "../img/stars.jpg";

const monkeyUrl = new URL("../assets/monkey.glb", import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
const AxesHelper = new THREE.AxesHelper(3);
scene.add(AxesHelper);

camera.position.set(-10, 20, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({ color: "#00ff00" });
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = -5 * Math.PI;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 100, 100);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: "blue" });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);
sphere.position.set(-10, -10, 8);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const sphereId = sphere.id;

// const directionLight = new THREE.DirectionalLight(0xFFFFFF,0.8);
// directionLight.castShadow = true;
// scene.add(directionLight);
// directionLight.position.set(0,-80,50);
// directionLight.shadow.camera.far = 400;
// // directionLight.shadow.bias = 0
// directionLight.shadow.camera.left = -50
// directionLight.shadow.camera.top = 50

// const DirectionLightHelper = new THREE.DirectionalLightHelper(directionLight,3);
// scene.add(DirectionLightHelper);

// const dlightShadowHelper = new THREE.CameraHelper(directionLight.shadow.camera);
// scene.add(dlightShadowHelper);

const spotLight = new THREE.SpotLight("white", 50000);
spotLight.position.set(0, -30, 100);
// spotLight.color = "black"
spotLight.angle = 0.25;
spotLight.castShadow = true;
scene.add(spotLight);

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog("#537692",0,200);
scene.fog = new THREE.FogExp2("#537692", 0.01);
// renderer.setClearColor(0xFFEA00);

const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  nebula,
  nebula,
  nebula,
  nebula,
  nebula,
  nebula,
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  // color: "#00FF00",
  // map: textureLoader.load(stars),
});

const box2MultiMaterial = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
];

const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 5, 10);
box2.castShadow = true;
box2.name = "theBox";
// box2.material.map = textureLoader.load(nebula);

const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 15);

const vShader = `
  void main(){
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fShader = `
void main(){
  gl_FragColor = vec4(1.0, 0.1, 0.3, 1.0);
}
`;

const sphere2Geometry = new THREE.SphereGeometry(4);
const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: vShader,
  fragmentShader: fShader,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-5, 10, 10);

const assetLoader = new GLTFLoader();

assetLoader.load(
  monkeyUrl.href,
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(6, 5, 3);
  },
  undefined,
  function (error) {
    console.log({ error });
  }
);

const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  cameraX: -10,
  cameraY: 20,
  cameraZ: 30,
  spotLightAngle: 0.2,
  spotLightPenumbra: 0,
  spotLightIntensity: 50000,
};

gui.addColor(options, "sphereColor").onChange((e) => {
  sphere.material.color.set(e);
});

// gui.add(options,'wireframe').onChange((e)=>{
//   sphere.material.wireframe = e;
// })

gui.add(options, "speed", 0, 0.1);
gui.add(options, "cameraX", -360, 360).onChange((e) => {
  camera.position.x = e;
});
gui.add(options, "cameraY", -360, 360).onChange((e) => {
  camera.position.y = e;
});
gui.add(options, "cameraZ", -360, 360).onChange((e) => {
  camera.position.z = e;
});
gui.add(options, "spotLightAngle", 0, 1);
gui.add(options, "spotLightPenumbra", 0, 1);
gui.add(options, "spotLightIntensity", 0, 100000);

let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

function animate(time) {
  box.rotation.y += time / 1000;
  box.rotation.x += time / 1000;

  step += options.speed;
  sphere.position.z = 10 * Math.abs(Math.sin(step));

  spotLight.intensity = options.spotLightIntensity;
  spotLight.angle = options.spotLightAngle;
  spotLight.penumbra = options.spotLightPenumbra;
  sLightHelper.update();

  rayCaster.setFromCamera(mousePosition, camera);
  const intersects = rayCaster.intersectObjects(scene.children);
  // console.log({intersects});

  for (let i = 0; i < intersects.length; i++) {
    if (intersects[i].object.id === sphereId) {
      intersects[i].object.material.color.set(0xff0000);
    }
    if (intersects[i].object.name === "theBox") {
      intersects[i].object.rotation.x += time / 1000;
      intersects[i].object.rotation.y += time / 1000;
    }
  }
  plane2.geometry.attributes.position.array[0] -= 10 * Math.random();
  plane2.geometry.attributes.position.array[1] -= 10 * Math.random();
  plane2.geometry.attributes.position.array[2] -= 10 * Math.random();
  const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
  plane2.geometry.attributes.position.array[lastPointZ] = -10 * Math.random();
  plane2.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate.bind(null, 10));

window.addEventListener("resize",()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight)
})