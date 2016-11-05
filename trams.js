var haltDuration = 2000;
var tramDotRadius = 6;
var stationRadius = 4;

var tracksColor = "#555b67";

var lineWidth = 3;
ctx.lineWidth = lineWidth;

var distanceBetweenStations = Math.floor(canvasWidth/10);
var paddingCanvas = Math.floor(canvasWidth/10);
var distanceBetweenTramTracks = Math.floor(canvasWidth/20);

var tramA = createTram("Tramway A", 'red', "123");
var tramB = createTram("Tramway B", 'blue', "80");
var tramC = createTram("Tramway C", 'green', "80");

var allTrams = [tramA, tramB, tramC];
// how to make it robust?? ie how to make it so, that the node is always on the
// path  (and forbidden if not on path)
// Take a tram
// Say 'that Y will be a node'
// Use this coordinate for all trams


var node = {
  x: canvasWidth/2,
  impactedTrams: allTrams
};

function getMaxNumberOfStationsBeforeNode(){
  var availableHorizontalSpace = Math.abs(node.x - paddingCanvas);
  var maxNumber = Math.floor(availableHorizontalSpace/distanceBetweenStations);
  return maxNumber;
}

function getMaxNumberOfStationsAfterNode(){
  var availableHorizontalSpace = (canvasWidth - node.x) - paddingCanvas;
  var maxNumber = Math.floor(availableHorizontalSpace/distanceBetweenStations);
  return maxNumber;
}

function getRandomNumberOfStationsAfterNode(){
  var min = 1;
  var max = getMaxNumberOfStationsAfterNode();
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumberOfStationsBeforeNode(){
  var min = 1;
  var max = getMaxNumberOfStationsBeforeNode();
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function generateAllTramPaths(){
  var numTrams = allTrams.length;
  for (var tramIndex=0 ; tramIndex<numTrams; tramIndex++){
    generateTramPath(tramIndex, allTrams[tramIndex]);
  }
}

function generateTramPath(tramIndex, tram){
  // H: tram always crosses
  // if tram doesn't cross, don't show it!!! simple :)
  var yPosition = (tramIndex*distanceBetweenTramTracks) + paddingCanvas;
  var stationsBefore = getRandomNumberOfStationsBeforeNode();
  var stationsAfter = getRandomNumberOfStationsAfterNode();

  tram.path.push({x: node.x, y: yPosition});

  for (var i=1 ; i<=stationsBefore ; i++){
    tram.path.unshift({x: node.x - i*distanceBetweenStations, y: yPosition});
  }
  for (var j=1 ; j<=stationsAfter ; j++){
    tram.path.push({x: node.x + j*distanceBetweenStations, y: yPosition});
  }

  initializePosition(tram);
}


function initializePosition(tram){
  tram.position={
    x: tram.path[0].x,
    y: tram.path[0].y
  };
}

// var nodes= [node];
  // lines: all
  // position: xxx
  // then place the lines accordingly


function drawNode(){
  var yFirstTram = allTrams[0].path[0].y;
  var yLastTram = allTrams[allTrams.length - 1].path[0].y;
  var rectangleWidth = stationRadius*5;
  var rectangleHeight = yLastTram - yFirstTram + rectangleWidth;

  var startingPoint = {
    x: node.x - (rectangleWidth/2),
    y: yFirstTram - (rectangleWidth/2)
  }
  ctx.rect(startingPoint.x, startingPoint.y, rectangleWidth, rectangleHeight);
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawTram(tram){
  // The tram is drawn as a point.
  //ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath();
  ctx.arc(tram.position.x, tram.position.y, tramDotRadius, 0, 2*Math.PI);
  ctx.fillStyle = tram.color;
  ctx.fill();
}


function drawTracks(tram){
  ctx.moveTo(tram.path[0].x, tram.path[0].y);
  //init context

  var nbStations = tram.path.length;
  for (var i=0 ; i<nbStations ; i++){
    ctx.strokeStyle = tracksColor;
    ctx.lineTo(tram.path[i].x, tram.path[i].y);
    ctx.stroke();
  }

  for (var i=0 ; i<nbStations ; i++){
    ctx.beginPath();
    ctx.arc(tram.path[i].x, tram.path[i].y, stationRadius, 0, 2*Math.PI);
    ctx.fillStyle = '#282C34';
    ctx.fill();
    ctx.stroke();
  }

  tram.position = {
    x: tram.path[0].x,
    y: tram.path[0].y
  }
}

function drawAllTracks(){
  var numTram = allTrams.length;
  for (var i=0; i<numTram ; i++){
    var tram = allTrams[i];
    drawTracks(tram);
  }
}


function drawAllTrams(){
  var numTrams = allTrams.length;
  for (var i=0 ; i<numTrams ; i++){
    drawTram(allTrams[i]);
  }
}

function wouldCollide(){
  // is there a risk of collision?
  // am I in priority?
  // what if same?
}

function continuePath(tram){
  if(checkAllowed(tram)){
    // go to next station
  }else{
    // wait
  }
}

function checkAllowed(tramA){
  return true;
  // if ((tramA.path[stationsDone +1].isNode
  // check number
}

generateAllTramPaths();
drawAllTracks();// how can i be sure??? callback?
drawNode();

//drawAllTrams();

setTimeout(function(){
    goAllTheWay(tramA);
    goAllTheWay(tramB);
    goAllTheWay(tramC);
}, 500);


function goAllTheWay(tram){
    var vx = 1;
    var vy = 0;
    var myInt = setInterval(function(){
      if(isAtAStation(tram)){
        tram.nextStationIndex++;
        haltAtStation(tram);
        if (isAtLastStation(tram)){
          clearInterval(myInt);
        }
      }else{
        tram.position.x += vx;
        tram.position.y += vy;
      }
      drawTram(tram);
    }, 1000/20);
}


function isAtLastStation(tram){
  var xPositionOfStations = [];
  for (var i=0 ; i<tram.path.length; i++){
    xPositionOfStations.push(tram.path[i].x);
  }
  var k = xPositionOfStations.indexOf(tram.position.x);
  if (k === tram.path.length - 1){
    return true;
  }else{
    return false;
  }
}

function isAtAStation(tram){
  var xPositionOfStations = [];
  for (var i=0 ; i<tram.path.length; i++){
    xPositionOfStations.push(tram.path[i].x);
  }
  var k = xPositionOfStations.indexOf(tram.position.x);
  if (k > -1){
    return true;
  }else{
    return false;
  }
}

function haltAtStation(tram){
  //console.log(tram.name + " arrived at station " + (x) + " of " + tram.path.length);
  var haltDurationX = haltDuration;
  /*if (mustWait(tram)){
    haltDurationX += 1000;
  }*/
  setTimeout(function(){
    tram.position.x += 1;
  }, haltDurationX);
}

function mustWait(tram){
  var nextStationIndex = tram.nextStationIndex;
  var nextStationIsNode = (tram.path[nextStationIndex].x === node.x)? true:false;
  //for // other trams
  //if (tram.path[tram.nextStationIndex].x === node.x)
  //&& tram != thisTram
}
