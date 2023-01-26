//API



fetch('https://app.gazerecorder.com/GazeRecorderAPI.js')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))

function handleFileSelect(event) {
    const file = event.target.files[0];
    const imageContainer = document.getElementById("image-container");
    const image = new Image();
    image.src = URL.createObjectURL(file);
    imageContainer.appendChild(image);
    image.style.width = 300;
    image.style.height = 300;

    const uploadButtons = document.getElementsByClassName("upload-button");
    const testButtons = document.getElementsByClassName("test-button");
    for (let i = 0; i < uploadButtons.length; i++) {
       uploadButtons[i].style.display = "none";
    }
    for (let i = 0; i < testButtons.length; i++) {
       if(i != 1){
          testButtons[i].style.display = "block";
       }
    }
 }

 let optionVal;
 //Función para el display de los formularios de ingreso para cada formato (imagen/video)
 function handleOptionSelect(option) {
    const imageForm = document.getElementById("upload-image-form");
    const videoForm = document.getElementById("upload-video-form");
    if (option === "image") {
        imageForm.style.display = "block";
        videoForm.style.display = "none";
        optionVal = "image";
    } else {
        imageForm.style.display = "none";
        videoForm.style.display = "block";
        optionVal = "video";
    }
 }

 //script para ingresar un video
 function uploadVideo() {
    var input = document.getElementById("video-input");
    var btn = document.getElementById("upload-video-button");
    input.style.display = "block";
    input.onchange = function() {
       var video = document.getElementById("video");
       video.src = URL.createObjectURL(input.files[0]);
       video.style.display = "block";
       document.getElementById("video-player").style.display = "block";
       video.style.width = "100%";
       video.style.height = "100%";
       btn.style.display = "none";
    };
    input.click();
    const uploadButtons = document.getElementsByClassName("upload-button");
    const testButtons = document.getElementsByClassName("test-button");
    const btnPruebaImagen = document.getElementById("pruebaImagen");
    const btnPruebaVideo= document.getElementById("pruebaVideo");
    for (let i = 0; i < uploadButtons.length; i++) {
       uploadButtons[i].style.display = "none";
    }
    for (let i = 0; i < testButtons.length; i++) {
       if(i == 2){
          testButtons[i].style.display = "none";
       }else{
          testButtons[i].style.display = "block";
       }
    }
 }
 function playPauseVideo() {
    var video = document.getElementById("video");
    if (video.paused) {
          video.play();
    } else {
          video.pause();
    }
 }

 //variables globales para el Gaze
 let x,y,gaze;
 //variables para cronometro
 let timer;
 let hours = 0;
 let minutes = 0;
 let seconds = 0;

 //instanciación de variables para el gaze
 function setVars(GazeData) {
    x = GazeData.docX;
    y = GazeData.docY;
    gaze = document.getElementById("gaze");
 }

 //Funciones de prueba de calibración   
 function PlotGaze(GazeData) {
    //settea los valores de tracking en tiempo real
    document.getElementById("GazeData").innerHTML = " DirMiradaX: " + GazeData.GazeX + " DirMiradaY: " + GazeData.GazeY;
    document.getElementById("HeadPhoseData").innerHTML = " Rot/Pos CabezaX: " + GazeData.HeadX + " Rot/Pos CabezaY: " + GazeData.HeadY + " Posición CabezaZ: " + GazeData.HeadZ;
    document.getElementById("HeadRotData").innerHTML = " Yaw: " + GazeData.HeadYaw + " Pitch: " + GazeData.HeadPitch + " Roll: " + GazeData.HeadRoll;
    
    setVars(GazeData);
    
    //Anchura interior del elemento
    x -= gaze.clientWidth/2;
    //Altura interior del elemento
    y -= gaze.clientHeight/2;
    //Setea la posición horizontal mediante la toma de la posición izquierda
     gaze.style.left = x + "px";
    //Setea la posición vertical mediante la toma de la posición superior
     gaze.style.top = y + "px";
    //Muestra o no el cursor de tracking de la mirada según las condiciones en tiempo real
    if(GazeData.state != 0)
    {
       if( gaze.style.display  == 'block')
          gaze.style.display = 'none';
    }
    else
    {
       if( gaze.style.display  == 'none')
          gaze.style.display = 'block';
    }
 }

 window.addEventListener("load", function() {
    GazeCloudAPI.OnCalibrationComplete =function(){
       ShowHeatMap(); console.log('Calibracion Completa');
       if (optionVal == "video"){
          playPauseVideo();
       }  
    }
    GazeCloudAPI.OnCamDenied =  function(){ console.log('No se puede obtener acceso a la cámara')  }
    GazeCloudAPI.OnError =  function(msg){ console.log('ERROR: ' + msg)  }
    GazeCloudAPI.UseClickRecalibration = true;
    GazeCloudAPI.OnResult = PlotGaze; 
 });

 function handleClickHeatMap(cb) {
    if( cb.checked)
    {
       ShowHeatMap();
       document.getElementById("gaze").style.display = 'none';
    }
    else
       RemoveHeatMap()
 
 }

 //Funciones de usabilidad en una web
 GazeRecorderAPI.OnNavigation = function(url)
    {
        document.getElementById("url").value = url;
    }

    function start(GazeData)
    {
        document.getElementById("inicio").style.display = 'block';
        var url = document.getElementById("urlstart").value
        GazeCloudAPI.StartEyeTracking();
        GazeCloudAPI.OnCalibrationComplete  = function(){
            GazeRecorderAPI.Rec(url);
       toggleTimer();
       resetTimer();
       startTimer();
        };
    
    setVars(GazeData);
    //Anchura interior del elemento
    x -= gaze.clientWidth/2;
    //Altura interior del elemento
    y -= gaze.clientHeight/2;
    //Setea la posición horizontal mediante la toma de la posición izquierda
     gaze.style.left = x + "px";
    //Setea la posición vertical mediante la toma de la posición superior
     gaze.style.top = y + "px";
    //Muestra o no el cursor de tracking de la mirada según las condiciones en tiempo real
    if(GazeData.state != 0)
    {
       if( gaze.style.display  == 'block')
          gaze.style.display = 'none';
    }
    else
    {
       if( gaze.style.display  == 'none')
          gaze.style.display = 'block';
    }

    }

    function Navigate() 
    {
        var url = document.getElementById("url").value;
        GazeRecorderAPI.Navigate (url );
    }

 //CRONOMETRO
 function startTimer() {
        timer = setInterval(() => {
            seconds++;

            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }

            if (minutes === 60) {
                minutes = 0;
                hours++;
            }

            document.getElementById("timer").innerHTML = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }
    function resetTimer() {
        clearInterval(timer);
        hours = 0;
        minutes = 0;
        seconds = 0;
        document.getElementById("timer").innerHTML = `${hours}:${minutes}:${seconds}`;
    }

    // Function to toggle the timer display
    function toggleTimer() {
        const timerDisplay = document.getElementById("timer-display");
        if (timerDisplay.style.display === "none") {
            timerDisplay.style.display = "block";
        } else {
            timerDisplay.style.display = "none";
        }
    }  
    function generatePDF() {
       window.print({marginsType: 0});
    }