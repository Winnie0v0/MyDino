// GLOBAL VARIABLES
var delta = 0;
var yPosition = 23;
var gameStatus = "readyToPlay";
var cactusPool = [];
var newCactusFrontPool = [];
var newCactusBackPool = [];
var originalSpeed = 0.3;
var collisionTolerance;
var percent = 100;
var fieldGameOver, fieldDistance;
var distance = 0;
var gltfObj,gltfObj1;

//COLORS
/* Learned to use the color method from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
var Colors = {
    red:0xab0702,
    white:0xd8d4d0,
    green:0x245707,
};

// THREEJS RELATED VARIABLES
var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    renderer, container,
    clock;

//SCREEN & MOUSE VARIABLES
var HEIGHT, WIDTH;

//INIT THREE JS, SCREEN AND MOUSE EVENTS
function createScene() {
  //var audio = document.getElementById("myAudio");
  //audio.volume = 0.07;

  /* Learned to adjust the window size from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(
    fieldOfView,
    aspectRatio,
    nearPlane,
    farPlane
    );
  scene.fog = new THREE.Fog(0xf7d9aa,170,700);
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = THREE.sRGBEncoding;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  /* Learned to use the even listener from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
  window.addEventListener('resize', handleWindowResize, false);
  document.addEventListener('mousedown', handleMouseDown, false);
  document.addEventListener("touchend", handleMouseDown, false);

  clock = new THREE.Clock();
}

// HANDLE SCREEN EVENTS
/* Learned to adjust the window size from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

// LIGHTS
/* Learned to more properly add lights from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  ambientLight = new THREE.AmbientLight(0xffffff,0.1);
        scene.add(ambientLight);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

// OBJECTS
/* Learned to create objects from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
MyDino = function(){
  this.status = "running";
	this.mesh = new THREE.Object3D();

  var geomHead = new THREE.BoxGeometry(30,40,40);
  var matHead = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var head = new THREE.Mesh(geomHead, matHead);
	head.castShadow = true;
  head.receiveShadow = true;
  this.mesh.add(head);

  var geomFrontHeadTop = new THREE.BoxGeometry(20,25,40);
  var matFrontHeadTop = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var frontHeadTop = new THREE.Mesh(geomFrontHeadTop, matFrontHeadTop);
	frontHeadTop.castShadow = true;
  frontHeadTop.receiveShadow = true;
  frontHeadTop.position.set(25,7.5,0);
  this.mesh.add(frontHeadTop);

  var geomFrontHeadBot = new THREE.BoxGeometry(20,5,40);
  var matFrontHeadBot = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var frontHeadBot = new THREE.Mesh(geomFrontHeadBot, matFrontHeadBot);
	frontHeadBot.castShadow = true;
  frontHeadBot.receiveShadow = true;
  frontHeadBot.position.set(21,-17.5,0);
  this.mesh.add(frontHeadBot);

  var geomBody = new THREE.BoxGeometry(30,40,40);
  var matBody = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var body = new THREE.Mesh(geomBody, matBody);
	body.castShadow = true;
  body.receiveShadow = true;
  body.position.set(-20,-50,0);
  body.rotation.z = 30*Math.PI/180;
  this.mesh.add(body);

  var geomTail = new THREE.BoxGeometry(40,10,10);
  var matTail = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var tail = new THREE.Mesh(geomTail, matTail);
	tail.castShadow = true;
  tail.receiveShadow = true;
  tail.position.set(-60,-30,0);
  tail.rotation.z = -40*Math.PI/180;
  this.mesh.add(tail);

  var geomEyeR = new THREE.BoxGeometry(10,14,1);
  var matEyeR = new THREE.MeshPhongMaterial({color:"black", shading:THREE.FlatShading});
  var eyeR = new THREE.Mesh(geomEyeR, matEyeR);
	eyeR.castShadow = true;
  eyeR.receiveShadow = true;
  eyeR.position.set(10,20,26);
  this.mesh.add(eyeR);

  var geomEyeBR = new THREE.BoxGeometry(6,6,1);
  var matEyeBR = new THREE.MeshPhongMaterial({color:"white", shading:THREE.FlatShading});
  var eyeBR = new THREE.Mesh(geomEyeBR, matEyeBR);
	eyeBR.castShadow = true;
  eyeBR.receiveShadow = true;
  eyeBR.position.set(13,20,27);
  this.mesh.add(eyeBR);

  var geomEyeL = new THREE.BoxGeometry(10,14,1);
  var matEyeL = new THREE.MeshPhongMaterial({color:"black", shading:THREE.FlatShading});
  var eyeL = new THREE.Mesh(geomEyeL, matEyeL);
	eyeL.castShadow = true;
  eyeL.receiveShadow = true;
  eyeL.position.set(10,20,-26);
  this.mesh.add(eyeL);

  var geomEyeBL = new THREE.BoxGeometry(6,6,1);
  var matEyeBL = new THREE.MeshPhongMaterial({color:"white", shading:THREE.FlatShading});
  var eyeBL = new THREE.Mesh(geomEyeBL, matEyeBL);
	eyeBL.castShadow = true;
  eyeBL.receiveShadow = true;
  eyeBL.position.set(12,20,-27);
  this.mesh.add(eyeBL);

  this.legL = new THREE.Object3D();
  var geomFootL = new THREE.BoxGeometry(20,10,10);
  var matFootL = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var footL = new THREE.Mesh(geomFootL, matFootL);
  footL.position.set(0,-30,0);
  footL.castShadow = true;
  footL.receiveShadow = true;
	this.legL.add(footL);
  this.legL.position.set(-20,-70,-20);
  this.mesh.add(this.legL);

  this.legR = new THREE.Object3D();
  var geomFootR = new THREE.BoxGeometry(20,10,10);
  var matFootR = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var footR = new THREE.Mesh(geomFootR, matFootR);
  footR.position.set(0,-30,0);
  footR.castShadow = true;
  footR.receiveShadow = true;
	this.legR.add(footR);
  this.legR.position.set(-20,-60,20);
  this.mesh.add(this.legR);

  var geomHand = new THREE.BoxGeometry(10,10,20);
  var matHand = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
  var hand = new THREE.Mesh(geomHand, matHand);
  hand.position.set(5,-40,10);
  hand.castShadow = true;
  hand.receiveShadow = true;
  this.mesh.add(hand);
};

/* Learned this prototyping method from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
var rotationAngle = 0
MyDino.prototype.run = function(){
  this.status = "running";
  rotationAngle += 0.1+delta/percent/10;
  this.legL.rotation.z = Math.sin(rotationAngle);
  this.legR.rotation.z = -Math.sin(rotationAngle);
}

MyDino.prototype.jump = function(){
  if (this.status == "jumping") return;
  this.status = "jumping";
  var _this = this;
  var jumpHeight = 70;
  var currentRadSpeed = (originalSpeed + delta/percent)*Math.PI/180*600;
  TweenMax.to(this.mesh.position,
  1.5/currentRadSpeed,
  {y:yPosition+jumpHeight, ease:Power2.easeOut});
  TweenMax.to(this.mesh.position,
  1.5/currentRadSpeed,
  {y:yPosition, ease:Power4.easeIn, delay:1.5/currentRadSpeed, onComplete: function(){
    _this.status="running";
  }});
}

Desert = function(){
  var txtLoader = new THREE.TextureLoader();
  var marsTexture = txtLoader.load("marsmap1kdark1.jpg");
  var marsBumpTexture = txtLoader.load ("marsbump1k.jpg");
  var marsMaterial = new THREE.MeshPhongMaterial({
    map: marsTexture,
    bumpMap: marsBumpTexture,
    bumpScale: 10,
    shading:THREE.FlatShading});

  var geom = new THREE.SphereGeometry(600,30,30);
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

  this.mesh = new THREE.Mesh(geom, marsMaterial);
  this.mesh.receiveShadow = true;
}

/* Get this idea to create sky and cloud from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
Cloud = function(){
  this.mesh = new THREE.Object3D();
  var geom = new THREE.SphereGeometry(15,4,4);

  var mat = new THREE.MeshPhongMaterial({
    color:Colors.white,
    shading:THREE.FlatShading
  });

  var nBlocs = 3+Math.floor(Math.random()*3);
  for (var i=0; i<nBlocs; i++ ){
    var m = new THREE.Mesh(geom.clone(), mat);
    m.position.x = i*15;
    m.position.y = Math.random()*10;
    m.position.z = Math.random()*10;
    m.rotation.z = Math.random()*Math.PI*2;
    m.rotation.y = Math.random()*Math.PI*2;
    var s = .1 + Math.random()*.9;
    m.scale.set(s,s,s);
    m.castShadow = true;
    m.receiveShadow = true;
    this.mesh.add(m);
  }
}
// From
Sky = function(){
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){
    var c = new Cloud();
    this.clouds.push(c);
    var a = stepAngle*i;
    var h = 750 + Math.random()*200;
    c.mesh.position.y = Math.sin(a)*h;
    c.mesh.position.x = Math.cos(a)*h;
    c.mesh.position.z = -400-Math.random()*400;
    c.mesh.rotation.z = a + Math.PI/2;
    var s = 1+Math.random()*2;
    c.mesh.scale.set(s,s,s);
    this.mesh.add(c.mesh);
  }
}

Cactus = function(){
	this.mesh = new THREE.Object3D();
  this.angle = getRandomInt(45, 50);

	var geombodyhR = new THREE.BoxGeometry(10,40,15);
  var matbodyR = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  var bodyhR = new THREE.Mesh(geombodyhR, matbodyR);
	bodyhR.castShadow = true;
  bodyhR.receiveShadow = true;
  bodyhR.position.y = -20;
  bodyhR.position.x = -10;
  this.mesh.add(bodyhR);

  var geombodyhRTop = new THREE.BoxGeometry(20,20,15);
  var matbodyRTop = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  var bodyhRTop = new THREE.Mesh(geombodyhRTop, matbodyRTop);
	bodyhRTop.castShadow = true;
  bodyhRTop.receiveShadow = true;
  bodyhRTop.position.y = -30;
  bodyhRTop.position.x = 5;
  this.mesh.add(bodyhRTop);

  var geombodyhL = new THREE.BoxGeometry(10,40,15);
  var matbodyL = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  var bodyhL = new THREE.Mesh(geombodyhL, matbodyL);
	bodyhL.castShadow = true;
  bodyhL.receiveShadow = true;
  bodyhL.position.y = 20;
  bodyhL.position.x = 10;
  this.mesh.add(bodyhL);

  var geombodyhLTop = new THREE.BoxGeometry(20,20,15);
  var matbodyLTop = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  var bodyhLTop = new THREE.Mesh(geombodyhLTop, matbodyLTop);
	bodyhLTop.castShadow = true;
  bodyhLTop.receiveShadow = true;
  bodyhLTop.position.y = 30;
  bodyhLTop.position.x = 25;
  this.mesh.add(bodyhLTop);

  var geombodyv = new THREE.BoxGeometry(90,20,15);
  var matbodyv = new THREE.MeshPhongMaterial({color:Colors.green, shading:THREE.FlatShading});
  var bodyv = new THREE.Mesh(geombodyv, matbodyv);
	bodyv.castShadow = true;
  bodyv.receiveShadow = true;
  this.mesh.add(bodyv);
}

// CREATES
function createPlane(){
  myDino = new MyDino();
  myDino.mesh.scale.set(.5,.5,.5);
  myDino.mesh.position.set(-140,yPosition,-100);
  myDino.mesh.rotation.y = 0.15;
  scene.add(myDino.mesh);
}

function createDesert(){
  desert = new Desert();
  desert.mesh.position.y = -600;
  scene.add(desert.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -600;
  scene.add(sky.mesh);
}

var nCactus;
function createCactus(){
  nCactus = getRandomInt(1,3);
  for (var i=0; i<nCactus; i++){
    cactus = new Cactus();
    if(nCactus == 1){
      collisionTolerance = 45;
      cactus.mesh.scale.set(.55,.55,.55);
    }else if(nCactus == 2){
      collisionTolerance = 40;
      cactus.mesh.scale.set(.45,.45,.45);
    }
    cactus.mesh.position.z = -100;
    cactus.mesh.rotation.z = cactus.angle * Math.PI/180;
    scene.add(cactus.mesh);
    cactusPool.push(cactus);
  }
}

function creatNewCactusFront() {
  var nNewCactus = 10;
  var loader = new THREE.GLTFLoader();
  for(var i = 0; i < nNewCactus; i++){
    loader.load('cactus.glb',
      function (gltf) {
        gltfObj = gltf.scene;
        gltfObj.anglez = getRandomInt(0, 360);
        gltfObj.scale.set(4,3,4);
        gltfObj.traverse(function(node){
          if(node.isMesh){
            node.castShadow=true;}
        });
        var pos = getRandomInt(-10,50);
        gltfObj.rotation.x = pos/2 * Math.PI/180;
        gltfObj.position.z = pos;

        gltfObj.position.x = Math.cos(gltfObj.anglez * Math.PI/180)*600;
        gltfObj.position.y = Math.sin(gltfObj.anglez * Math.PI/180)*600-603;
        gltfObj.rotation.z = (gltfObj.anglez + 270) * Math.PI/180;
        scene.add(gltfObj);
        newCactusFrontPool.push(gltfObj);
      }
    );
  }
}

function creatNewCactusBack() {
  var nNewCactus = 10;
  var loader = new THREE.GLTFLoader();
  for(var i = 0; i < nNewCactus; i++){
    loader.load('cactus.glb',
      function (gltf) {
        gltfObj = gltf.scene;
        gltfObj.anglez = getRandomInt(0, 360);
        gltfObj.scale.set(4,3,4);
        gltfObj.traverse(function(node){
          if(node.isMesh){
            node.castShadow=true;}
        });
        var pos = getRandomInt(-250,-190);
        gltfObj.rotation.x = (pos+200)/2 * Math.PI/180;
        gltfObj.position.z = pos;
        gltfObj.position.x = Math.cos(gltfObj.anglez * Math.PI/180)*600;
        gltfObj.position.y = Math.sin(gltfObj.anglez * Math.PI/180)*600-655;
        gltfObj.rotation.z = (gltfObj.anglez + 270) * Math.PI/180;
        scene.add(gltfObj);
        newCactusBackPool.push(gltfObj);
      }
    );
  }
}

// UPDATES
function updateBackgroundRotation(){
  desert.mesh.rotation.z += (originalSpeed + delta/percent)* Math.PI/180;
  sky.mesh.rotation.z += (originalSpeed + + delta/percent)* Math.PI/180;
}

function updateCactusRotation(){
  if (cactusPool.length == 0){
    createCactus();
  }
  for (var i=0; i<cactusPool.length; i++){
    cactus = cactusPool[i];
    angleUpdate = originalSpeed + delta/percent;
    cactus.angle += angleUpdate;
    cactus.mesh.position.x = Math.cos(cactus.angle * Math.PI/180)*600;
    if(nCactus == 1){
      cactus.mesh.position.y = Math.sin(cactus.angle * Math.PI/180)*600-590;
    } else if (nCactus == 2){
      cactus.mesh.position.y = Math.sin(cactus.angle * Math.PI/180)*600-595;
    }
    cactus.mesh.rotation.z += angleUpdate * Math.PI/180;
    checkCollision();
    if (cactus.angle > 135){
      cactusPool.splice(i,1);
    }
  }
}

function updateNewCactusFrontRotation(){
  for (var i=0; i<newCactusFrontPool.length; i++){
    newCactus = newCactusFrontPool[i];
    angleUpdate = originalSpeed + delta/percent;
    newCactus.anglez += angleUpdate;
    newCactus.position.x = Math.cos(newCactus.anglez * Math.PI/180)*600;
    newCactus.position.y = Math.sin(newCactus.anglez * Math.PI/180)*600-603;
    newCactus.rotation.z = (newCactus.anglez + 270) * Math.PI/180;
  }
}

function updateNewCactusBackRotation(){
  for (var i=0; i<newCactusBackPool.length; i++){
    newCactus = newCactusBackPool[i];
    angleUpdate = originalSpeed + delta/percent;
    newCactus.anglez += angleUpdate;
    newCactus.position.x = Math.cos(newCactus.anglez * Math.PI/180)*600;
    newCactus.position.y = Math.sin(newCactus.anglez * Math.PI/180)*600-655;
    newCactus.rotation.z = (newCactus.anglez + 270) * Math.PI/180;
  }
}

// HELPERS
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min)
}

/* Learned this collision checking method from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
function checkCollision(){
  var distance = myDino.mesh.position.clone().sub(cactus.mesh.position.clone());
  if(distance.length() < collisionTolerance){
    gameStatus = "gameOver";
    gameOver();
  }
}

// MAINS
function render(){
  delta = clock.getElapsedTime();

  if (gameStatus=="playing"){
    if (myDino.status == "running"){
      myDino.run();
    }
    updateBackgroundRotation();
    updateCactusRotation();
    updateDistance();
    updateNewCactusFrontRotation();
    updateNewCactusBackRotation();
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function init(event){
  createScene();
  createLights();
  createPlane();
  createDesert();
  createSky();
  creatNewCactusFront();
  creatNewCactusBack();
  initUI();
  requestAnimationFrame(render);
}

// HANDLE MOUSE EVENTS
var mousePos = { x: 0, y: 0 };

function handleMouseDown(event){
  if (gameStatus == "playing"){
    myDino.jump();
  }
  else if (gameStatus == "gameOver"){
    replay();
  }
  else if (gameStatus == "readyToPlay"){
    replay();
  }
}

window.addEventListener('load', init, false);

// CSS
/* Learned to link to .css files from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
function initUI(){
  fieldDistance = document.getElementById("distValue");
  fieldGameOver = document.getElementById("gameoverInstructions");
}

function gameOver(){
  fieldGameOver.className = "show";
  gameStatus = "gameOver";
}

function updateDistance(){
  var currentRadSpeed = (originalSpeed + delta/percent)*Math.PI/180*600;
  distance += currentRadSpeed;
  var d = Math.floor(distance/100);
  var zeroFilledD = ('00000'+d).slice(-5);
  fieldDistance.innerHTML = zeroFilledD;
}

function replay(){
  /* Learned to adjust the game status from the Aviator game tutorial  https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/ */
  fieldGameOver.className = "";
  gameStatus = "playing";
  for (var i=0; i<cactusPool.length; i++){
    cactus = cactusPool[i];
    scene.remove(cactus.mesh);
  }
  distance = 0;
  cactusPool = [];
  createCactus();
  clock = new THREE.Clock();
}
