var fft, // Allow us to analyze the song
    numBars = 1024, // The number of bars to use; power of 2 from 16 to 1024
    song; // The p5 sound object

// Load our song

let sum=0;
let smoothingFactor=0.007;

let px=0;
let py=0;
let ox=0;
let oy=0;
let flag=false;
let dy=0;

document.getElementById("save").onclick = function(event){
    let filename = document.getElementById("num").value + '_' + document.getElementById("artist").value + '_' + document.getElementById("album").value + '_' + document.getElementById("title").value
    saveCanvas(canvas, filename, 'png');
}

document.getElementById("generate").onclick = function(event) {
    if(document.getElementById("audioFile").files[0]) {
        if(typeof song != "undefined") { // Catch already playing songs
            song.disconnect();
            song.stop();
        }
        
        // Load our new song
        song = loadSound(URL.createObjectURL(document.getElementById("audioFile").files[0]));
    }
}

document.getElementById("stop").onclick = function(event) {
    document.getElementById("title").disabled = false;
    document.getElementById("cbTitle").disabled = false;
    document.getElementById("artist").disabled = false;
    document.getElementById("cbArtist").disabled = false;
    document.getElementById("album").disabled = false;
    document.getElementById("cbAlbum").disabled = false;
    document.getElementById("num").disabled = false;
    document.getElementById("cbNum").disabled = false;
    document.getElementById("audioFile").disabled = false;
    document.getElementById("generate").disabled = false;
    document.getElementById("gencolor").disabled = false;
    document.getElementById("gencolor").style="opacity: 1";
    document.getElementById("stop").disabled = true;
    document.getElementById("save").disabled = false;
    song.disconnect();
    song.stop();
   // noLoop();
}

let canvas;
function setup() { // Setup p5.js
    canvas = createCanvas(700, 700);
    background(0);
}

function draw() {
    
    if(typeof song != "undefined" 
       && song.isLoaded() 
       && !song.isPlaying()) { // Do once
        
        song.play();
        song.setVolume(1);

        fft = new p5.FFT();
        fft.waveform(numBars);
        fft.smooth(0.9);
    }
    
    if(typeof fft != "undefined") {
        var spectrum = fft.analyze();
        noStroke();
        colorMode(HSB);
        let gen_hue = document.getElementById("gencolor").value;
        document.getElementById("gencolor").disabled = true
        document.getElementById("gencolor").style="opacity: 0.3"

        document.getElementById("title").disabled = true
        document.getElementById("cbTitle").disabled = true
        document.getElementById("artist").disabled = true
        document.getElementById("cbArtist").disabled = true
        document.getElementById("album").disabled = true
        document.getElementById("cbAlbum").disabled = true
        document.getElementById("num").disabled = true
        document.getElementById("cbNum").disabled = true
        document.getElementById("audioFile").disabled = true
        document.getElementById("generate").disabled = true

        document.getElementById("stop").disabled = false
        document.getElementById("save").disabled = false
        //document.getElementById("generate").style="background-color:lightgray";

        let spect = spectrum.reduce((a, b) => a + b, 0) / spectrum.length;
        sum = spect*smoothingFactor
        let start = gen_hue-20
        let stop = start+40
        let rms_h=map(sum,0,1,start,stop,true)
        //let rms_h = gen_hue
        let rms_s=sum*100
        let rms_b=sum*100

        if(!flag) px+=1;
        else px-=1;
        py=spect*0.2+dy;
        colorMode(HSB);
        stroke(rms_h, rms_s, rms_b);
        line(ox, oy, px, py);
        if(!flag) ox+=1;
        else ox-=1;
        if(ox==700||ox==-1){
        flag=!flag;
        dy+=45;
    }
    oy=700;

    textFont('Inter Tight SemiBold');
    noStroke();
    fill(0,0,100)
    textAlign(CENTER,CENTER);
    textSize(40);
    if(document.getElementById("cbTitle").checked) text(document.getElementById("title").value/*.toUpperCase()*/, 350,350);
    textFont('Inter Tight Light');
    textSize(25)
    if(document.getElementById("cbArtist").checked) text(document.getElementById("artist").value/*.toUpperCase()*/, 350,380);
    textSize(20);
    textAlign(LEFT,CENTER);
    if(document.getElementById("cbAlbum").checked) text(document.getElementById("album").value/*.toUpperCase()*/, 50,650);
    textAlign(RIGHT,CENTER);
    if(document.getElementById("cbNum").checked) text(document.getElementById("num").value/*.toUpperCase()*/, 650,650);
        /*for(var i = 0; i < numBars; i++) {
            var x = map(i, 0, numBars, 0, width);
            var h = -height + map(spectrum[i], 0, 255, height, 0);
            rect(x, height, width / numBars, h);
        }*/
    }
}

function windowResized() {
  resizeCanvas(700, 700);
}