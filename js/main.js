var camera, scene, renderer;
var group;
var el1, el2,el3; //三顆電子


function init() {

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x090b33, 5, 50);  //加入霧 景深明顯 5~50 看的到霧
    renderer = new THREE.WebGLRenderer({
        antialias: true // 渲染毛邊會比較少
    });
    renderer.setSize(window.innerWidth, window.innerHeight); //渲染器尺寸
    renderer.shadowMap.enable = true;  // 開啟陰影

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 100 ); 
    camera.position.set(16, 10, 12);
    camera.lookAt(scene.position);//預設(0, 0, 0)

    group = new THREE.Object3D();  //物件群組
    scene.add(group);

    function generateBall(r, color, name, x, y, z) {

        var SphereGeometry = new THREE.SphereGeometry( r, 32, 32 );  // 半徑,邊數  邊數越高越逼近圓形
        var sphereMaterial = new THREE.MeshLambertMaterial( {color: color} ); //這個材質要新增光才看的到
        var sphere = new THREE.Mesh( SphereGeometry, sphereMaterial );
        sphere.name = name;
        sphere.position.set(x || 0, y || 0, z || 0);
        group.add(sphere);
        return sphere;

    }

    // generateBall(5, "#f24", "test");
    // generateBall(5, "#24f", "test", -5);
    // generateBall(5, "#2f4", "test", 5);

    var radius = 2; //原子核的半徑
    var stepdiv = 4;  //橫切一圈是8顆球， 180度分割四塊
    var dd = true; // 讓球紅藍轉換

    // 第一個迴圈angle1控制是哪一圈，第二個迴圈angle2控制圈上的圓

    for(var angle1 = 0; angle1<Math.PI*2; angle1+=Math.PI/stepdiv) {
        for(var angle2 = 0; angle2<Math.PI*2; angle2+=Math.PI/stepdiv) {
        
            var layerRadius = Math.cos(angle1) * radius;  //每一層的半徑  每一層角度*整體半徑
            var ballColor = (dd)?"#f24":"#24f";

            // 0.9 球本身半徑, X 每顆角度 cos*這層半徑 ， Z 每顆角度sin * 這層半徑， Y 高度以橫切面來看 每層角度*整體半徑
            generateBall(0.9, ballColor, "atom", Math.cos(angle2)* layerRadius, Math.sin(angle1)*radius, Math.sin(angle2) * layerRadius);

            dd = !dd // 每畫一顆翻轉一次顏色
        }
        // 每畫一層反轉一次
        dd = !dd 
    }

    el1 = {
        orbit_r: 10,  //繞行半徑
        orbit_speed: 0.05, //每秒鐘0.05的角度
        angle: Math.random()*Math.PI*2, //隨機產生角度
        obj: generateBall(0.2, "#fff", "el1")
    }

    el2 = {
        orbit_r: 10,  //繞行半徑
        orbit_speed: 0.05, //每秒鐘0.05的角度
        angle: Math.random()*Math.PI*2, //隨機產生角度
        obj: generateBall(0.2, "#fff", "el2")
    }

    el3 = {
        orbit_r: 10,  //繞行半徑
        orbit_speed: 0.05, //每秒鐘0.05的角度
        angle: Math.random()*Math.PI*2, //隨機產生角度
        obj: generateBall(0.2, "#fff", "el3")
    }





    var ambientLight = new THREE.AmbientLight("#333");
    scene.add(ambientLight);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); //0.5 是強度  //平行燈
    scene.add(directionalLight);

    var spotLight = new THREE.SpotLight( "#fff" );  // 聚光燈
    spotLight.position.set( -20, 20, 10 );
    spotLight.castShadow = true;
    scene.add(spotLight);


    //綁定控制攝影機 
    cameraControl = new THREE.OrbitControls(camera);

}

init();

function render() {


    renderer.render(scene, camera);  //渲染器去渲染場景從camera的角度

    //更新攝影機
    cameraControl.update();

    // 更新電子位置
    el1.obj.position.x = Math.cos(el1.angle)*el1.orbit_r;
    el1.obj.position.y = Math.sin(el1.angle)*el1.orbit_r;
    el1.angle += el1.orbit_speed;

    el2.obj.position.x = Math.cos(el2.angle)*el2.orbit_r;
    el2.obj.position.z = Math.sin(el2.angle)*el2.orbit_r;
    el2.angle += el2.orbit_speed;

    el3.obj.position.y = Math.cos(el3.angle)*el3.orbit_r;
    el3.obj.position.z = Math.sin(el3.angle)*el3.orbit_r;
    el3.angle += el3.orbit_speed;


    group.rotation.y += 0.02;


    requestAnimationFrame(render);

}

render();

window.addEventListener("resize", function() {

    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

})