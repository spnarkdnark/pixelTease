
let gridState = JSON.parse(sessionStorage.getItem('gridState'));
let gridCount = sessionStorage.getItem('gridCount');
let exportContainer = document.querySelector('.exportContainer');
let pdfContainer = document.querySelector('.everything');

function translateArtwork(state, count, container){
    let scale = container.clientHeight / gridCount;

    for (i = 0; i < count; i++){
        tempGridRow = document.createElement('div');
        tempGridRow.id = i;
        tempGridRow.classList.add('gridRow');
        for (p = 0; p < count; p++){
            tempUnit = document.createElement('div');
            tempUnit.id = p;
            tempUnit.style.backgroundColor = state[i][p];
            tempUnit.style.height = `${scale}px`;
            tempUnit.style.width = `${scale}px`;
            tempUnit.classList.add('gridUnit');
            tempGridRow.appendChild(tempUnit);
        }
        container.appendChild(tempGridRow);
    }
}

translateArtwork(gridState, gridCount, exportContainer);
