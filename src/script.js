import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DirectionalLight } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.CircleGeometry(5, 32)
const material = new THREE.MeshBasicMaterial({color: 'skyblue'})
const pond = new THREE.Mesh(geometry, material)
scene.add(pond)
// const object1 = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 16, 16),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
// object1.position.x = - 2
// scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0) //direction has to be normalized 
// rayDirection.normalize()
// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Mouse
 */
 const mouse = new THREE.Vector2() //mouse only moves on x and y axis

 window.addEventListener('mousemove', (event) =>
 {
     mouse.x = event.clientX / sizes.width * 2 - 1 //formula needed in order to get x axix
     mouse.y = - (event.clientY / sizes.height) * 2 + 1 //special formula
 
 })

window.addEventListener('click', () => 
{
    if(currentIntersect)
    {
        if(currentIntersect.object === object1)
        {
            console.log('click on object 1')
        }
        else if(currentIntersect.object === object2)
        {
            console.log('click on object 2')
        }
        else if(currentIntersect.object === object3)
        {
            console.log('click on object 3')
        }
    }
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/** 
 * Model
*/
const gltfLoader = new GLTFLoader() //const keeps the variable value as a constant
let model = null //let allows for variable to be reassigned later
gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf) =>
    {
        model = gltf.scene
        model.position.y = -1.2
        scene.add(model)
    }
)

/** 
 * Lights makes it so that the duck is lit, letting us see the image of the duck
 */
//Ambient Lights
const ambientLight = new THREE.AmbientLight('#ffffff', 0.3)
scene.add(ambientLight)

//Directional Light
const directionalLight = new THREE.DirectionalLight('#ffffff', 0.7)
directionalLight.position.set(1, 2, 3)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

let currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    //Cast a ray
    raycaster.setFromCamera(mouse, camera)
    

    //Test intersection iwth model
    if(model) //tick keeps ticking, so this statement allows for the model to be loaded properly
    {
        const modelIntersects = raycaster.intersectObject(model)
        console.log(modelIntersects)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()