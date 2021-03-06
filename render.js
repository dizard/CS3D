/**
  File Name: render.js
  File Author: SamJ
  File Desc: Handle rendering of object and interaction with it
*/

function render(canvas, meshURL, textureURL){
  let debug = false;

  // Variables
  let renderer,
      scene,
      camera,
      loader,
      mesh,
      delta = 0,
      prevTime = Date.now();

  // Create & setup our scene Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  renderer.setClearColor(0x071116); // BG Color
  renderer.setPixelRatio(window.devicePixelRatio); // Pixel Ratio
  renderer.setSize(canvas.clientWidth, canvas.clientHeight); // Size

  // Handle Resizing
  window.addEventListener('resize',handleResize);
  function handleResize(){
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }

  // Create Our Camera
  camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 10000);

  // Create The Scene
  scene = new THREE.Scene();

  // Create And Add Lighting
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  var pointLight = new THREE.PointLight(0xffffff, .5);
  scene.add(ambientLight);
  scene.add(pointLight);

  // Create the JSONLoader
  loader = new THREE.JSONLoader();

  // Add Mouse Movement Stuff
  let xy;
  function handleMouseMove(e){
    let t = { x: e.clientX, y: e.clientY };
    let delta = { x: (xy.x - t.x), y: (xy.y - t.y) } // Distance Moved Since Last Trigger
    xy = t;

    mesh.rotation.y -= (delta.x / 50);
  }
  function handleMouseUp(){
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }
  function handleMouseDown(e){
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    xy = { x: e.clientX, y: e.clientY }
  }
  function handleScroll(e){
    if(e.deltaY > 0){ // UP - Zoom In
      if(mesh.position.z < -10)
        mesh.position.z += .5
    }else{ // DOWN - Zoom Out
      if(mesh.position.z > -45)
        mesh.position.z -= .5;
    };
    e.preventDefault();
  }

  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('wheel', handleScroll);

  //RENDER LOOP
  (function render(){
    delta += 0.1;
    if(mesh)mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  })();

  // Load Model
  loader.load(meshURL, function(geometry, materials) {
      let texture = new THREE.TextureLoader().load(textureURL),
          material = new THREE.MeshLambertMaterial({map: texture, morphTargets: true, side: THREE.Doubleside});

      mesh = new THREE.Mesh(geometry, material); // Create Mesh
      scene.add(mesh); // Add Mesh Into Scene
      mesh.position.z = -25; // Set Mesh Pos
      mesh.position.y = -2;
      mesh.rotation.x = .2; // Set Rotation
  });
};
