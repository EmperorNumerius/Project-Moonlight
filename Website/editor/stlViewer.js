import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// three js docs https://threejs.org/docs/

// camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 90, 1, 0.1, 1000 );
const viewportSize = window.innerWidth /3;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( viewportSize, viewportSize ); // make sure to also change ratio in camera
document.body.appendChild( renderer.domElement );



// orbit controls setup https://threejs.org/docs/?q=orbit#examples/en/controls/OrbitControls
//const controls = new OrbitControls( camera, renderer.domElement );
//controls.rotateSpeed = 1.5;
camera.position.set( 20, 20, 0 ); // this seems to be buggy
//controls.update();

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(0, -10, -10);
scene.add(directionalLight2);

// background
scene.background = new THREE.Color(0xaaaaaa);

// guides
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

// shadowplane
var planeMaterial = new THREE.ShadowMaterial();
planeMaterial.opacity = .25;
var newPlaneGeometry = new THREE.PlaneGeometry( 100, 100 );
var planeMesh = new THREE.Mesh( newPlaneGeometry, planeMaterial );
planeMesh.receiveShadow = true;
planeMesh.rotation.x = - Math.PI / 2;
scene.add( planeMesh );

// Binary files
const stlMaterial = new THREE.MeshPhongMaterial( { color: 0xAAAA00, specular: 0x000000, shininess: 20 } );
//
//loader.load( './models/test.stl', function ( geometry ) {
//
//    const mesh = new THREE.Mesh( geometry, stlMaterial );
//
//    mesh.position.set( 0, 6, - 0.6 );
//    mesh.rotation.set( - Math.PI / 2, 0, 0 );
//    mesh.scale.set( 2, 2, 2 );
//    
//
//    mesh.castShadow = true;
//    mesh.receiveShadow = true;
//
//    scene.add( mesh );
//
//} );


//camera.position.z = 5;
let readyToRender = null;

function animate() {
    //requestAnimationFrame(animate);
	//controls.update();
    renderSTL(readyToRender);

	renderer.render( scene, camera );

}
//animate();
renderer.setAnimationLoop(animate);

//export function renderSTL(stl) {
//    loader.load( stl, function ( geometry ) {
//        const mesh = new THREE.Mesh( geometry, stlMaterial );
//        scene.add( mesh );
//    } );
//}
//const loader = new STLLoader();

export function addSTLToQueue(stlArrayBuffer) {
    readyToRender = stlArrayBuffer;
}

let currentMesh = null;

function renderSTL(stlArrayBuffer) {
    if (stlArrayBuffer === null) {
        //console.log ("stlArrayBuffer is null");
    } else {
        //console.log("stlArrayBuffer is not null");
        readyToRender = null;
        console.log("renderSTL called with ArrayBuffer:", stlArrayBuffer);
        const loader = new STLLoader();
        loader.load( stlArrayBuffer, function ( geometry ) {
            console.log("loader entered")

            // Remove the previous mesh if it exists
            if (currentMesh) {
                scene.remove(currentMesh);
                currentMesh.geometry.dispose();
                currentMesh.material.dispose();
                currentMesh = null;
            }

            const mesh = new THREE.Mesh(geometry, stlMaterial);

            mesh.position.set(0, 6, -0.6);
            mesh.rotation.set(-Math.PI / 2, 0, 0);
            mesh.scale.set(2, 2, 2);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            camera.lookAt(mesh.position);
            scene.add(mesh);
            camera.lookAt(mesh.position);
            console.log("mesh added to scene");

            // Update the current mesh reference
            currentMesh = mesh;
        });
    }
    
}


