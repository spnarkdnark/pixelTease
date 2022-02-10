//initialize DOM variables
let gridCount = 8;
let mouseDown = false;
let erasing = false;
let gridState = [];
currentColor = 'rgb(0,0,0)';
buttonColor = '';

//debugging canvas listener
//canvas.addEventListener('mousemove',function(e){getMousePosition(canvas,e)});

//initialize DOM elements
let sketchContainer = document.querySelector('.sketchContainer');
let gridRow = document.createElement('div');
let eightButton = document.getElementById('eight');
let sixteenButton = document.getElementById('sixteen');
let sixtyFourButton = document.getElementById('sixtyfour');
let trashIcon = document.querySelector('.trashIcon');
let eraser = document.querySelector('.eraser');
let exportButton = document.querySelector('.export');
let colorInput = document.querySelector('.colorInput');


//initialize event listeners
eightButton.addEventListener('click', function(){refreshGrid(8)});
sixteenButton.addEventListener('click', function(){refreshGrid(16)});
sixtyFourButton.addEventListener('click', function(){refreshGrid(64)});
trashIcon.addEventListener('click', trashClick);
eraser.addEventListener('click', function(){currentColor = 'rgb(255,255,255)'});
exportButton.addEventListener('click', exportClick);
colorInput.addEventListener('input', colorInputButton);

function colorInputButton(event){
    currentColor = event.target.value;
    console.log(buttonColor);
}

function exportClick(){
    updateGridState();
    sessionStorage.setItem('gridState', JSON.stringify(gridState));
    sessionStorage.setItem('gridCount', gridCount);
    window.open('exportTemplate.html');
}

function updateColor(color){
    //update the active color to black, will eventually react to broader color changes
    currentColor = color.toString();
}

function getMousePosition(canvas, event){
    //log mouses position within canvas mostly for debugging
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    console.log(x,y);
}

//these two help the mouseover event listeners to draw pixels onto the grid
sketchContainer.onmousedown = function() {
    mouseDown = true;
}
sketchContainer.onmouseup = function() {
    mouseDown = false;
    updateGridState();
    eraseShirt();
    drawShirt(170,130,150/gridCount);
}

//initialize the canvas context on top of shirt
let canvas = document.querySelector('#myCanvas');
let ctx = canvas.getContext('2d');
ctx.strokeStyle = 'white';

function drawShirt(startX, startY, increment){
    let xPos = startX;
    let yPos = startY;

    for (i = 0; i < gridState.length; i++){
        for (p = 0; p < gridState[i].length; p++){
            if (gridState[i][p] === ''){
                xPos += increment;
                continue;
            }
            else{
            ctx.fillStyle = gridState[i][p];
            console.log(ctx.fillStyle);
            ctx.fillRect(xPos, yPos, increment, increment);
            ctx.strokeRect(xPos, yPos, increment, increment);
            xPos += increment;
            }
        }
        yPos += increment;
        xPos = startX;
    }
}

function eraseShirt(){
    ctx.clearRect(0,0,500,500);
}

function drawGrid(gridValue){
    //use gridValue to insert divs into DOM
    for (i = 0; i < gridValue; i++){
        tempGridRow = document.createElement('div');
        tempGridRow.id = i;
        tempGridRow.classList.add('gridRow');
        for (p = 0; p < gridValue; p++){
            tempUnit = document.createElement('div');
            tempUnit.id = p;
            tempUnit.classList.add('gridUnit');
            tempGridRow.appendChild(tempUnit);
        }
        sketchContainer.appendChild(tempGridRow);
    }
}

function getGridState(){
    //return a boolean array of the grid state to hopefully facilitate export2pdf
    gridRows = document.querySelectorAll('.gridRow');
    tempArray = [];

    for (i = 0; i < gridRows.length; i++){
        let tempRow = [];
        let children = gridRows[i].children;

        for (p = 0; p < children.length; p++){
            tempRow.push(children[p].style.backgroundColor);
        }
        tempArray.push(tempRow);
    }

    return tempArray;
}

function updateGridState(){
    gridState = getGridState();
}

function trashClick(){
    //do these things when the trash icon is clicked
    eraseGrid(sketchContainer);
    buildGrid(gridCount);
    eraseShirt();
}

function getUnitDimension(gridValue){
    //divide the height of grid element by gridValue to get unit size
    return sketchContainer.offsetHeight / gridValue;
}

function styleGrid(gridValue){
    //add height and width to grid units
    let unitDim = getUnitDimension(gridValue);
    let unitDimConvert = unitDim.toString();
    let allUnits = document.querySelectorAll('.gridUnit');

    for (i = 0; i < allUnits.length; i++){
        allUnits[i].style.height = `${unitDimConvert}px`;
        allUnits[i].style.width = `${unitDimConvert}px`;
    }
}

function changeColor(){
    if (mouseDown){
        this.style.backgroundColor = currentColor;
    }

}

function changeColorBrute(){
   this.style.backgroundColor = currentColor;
}

function addGridListeners(){
    let allUnits = document.querySelectorAll('.gridUnit');
    
    for (i = 0; i < allUnits.length; i++){
        allUnits[i].addEventListener('mouseover', changeColor);
        allUnits[i].addEventListener('mousedown', changeColorBrute);
    }
}

function buildGrid(gridValue){
    drawGrid(gridValue);
    styleGrid(gridValue);
    addGridListeners();
}

function refreshGrid(gridValue){
    eraseGrid(sketchContainer);
    buildGrid(gridValue);
    gridCount = gridValue;
    eraseShirt();
    erasing = false;
}

function eraseGrid(container){
    while (container.firstElementChild){
        container.firstElementChild.remove();
    }
}

buildGrid(gridCount);

