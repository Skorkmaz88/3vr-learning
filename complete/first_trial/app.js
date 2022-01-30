import * as THREE from '../../libs/three/three.module.js';
import { VRButton } from '../../libs/three/jsm/VRButton.js';
import { BoxLineGeometry } from '../../libs/three/jsm/BoxLineGeometry.js';
import { Stats } from '../../libs/stats.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { GLTFLoader } from '../../libs/three/jsm/GLTFLoader.js';

const light = new THREE.DirectionalLight( 0xffffff );
let angle = 0;
class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
		this.camera.position.set( -2, 1.6, 3 );
        
		this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xbbbbbb );

		this.scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );

        //const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
        light.intensity = 2.5;

		this.scene.add( light );
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
		container.appendChild( this.renderer.domElement );
        
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();
        
        this.stats = new Stats();
        container.appendChild( this.stats.dom );
        
        this.initScene();
        this.setupVR();
        
        window.addEventListener('resize', this.resize.bind(this) );
        
        this.renderer.setAnimationLoop( this.render.bind(this) );
	}	
    
    random( min, max ){
        return Math.random() * (max-min) + min;
    }
    
    initScene(){
        this.radius = 0.08;

        // Try to load our stuff
        const loader = new GLTFLoader();

        const MODEL_PATH =
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/stacy_lightweight.glb";

        this.room = new THREE.LineSegments(
					new BoxLineGeometry( 10, 10, 10, 10, 10, 10 ),
					new THREE.LineBasicMaterial( { color: 0x808080 } )
				);
        this.room.geometry.translate( 0, 3, 0 );
        this.scene.add( this.room );
        const self = this;
        loader.load(
            MODEL_PATH,
            function (gltf) {
                gltf.scene.position.z  = -1;
                self.scene.add( gltf.scene );

            },
            undefined,
            function (error) {
              console.error(error);
            }
          );
        const geometry = new THREE.IcosahedronBufferGeometry( this.radius, 2 );

        for ( let i = 0; i < 0; i ++ ) {

            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = this.random( -2, 2 );
            object.position.y = this.random( -2, 2 );
            object.position.z = this.random( -2, 2 );

            this.room.add( object );

        }
    }
    
    setupVR(){
        this.renderer.xr.enabled = true;
        document.body.appendChild( VRButton.createButton( this.renderer ) );
    }
    
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
    
	render( ) {   
        this.stats.update();
        angle -=0.01;
  
        light.position.x =1+2*Math.sin(angle);
        light.position.y =1+2*Math.cos(angle);
        this.renderer.render( this.scene, this.camera );


    }
}

export { App };
