/*
a simple script to display the "game of life" in memory of John Conway, the mathematician who set the rules Copyright (C) 2021 samas69420
This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details

*********************************
HOW TO USE: put this div into your html

<div class="sfondo">
    <canvas id="canvas_sfondo"></canvas>
    <script src="gameoflife.js"></script>
</div>

*/
const canvas =document.getElementById("canvas_sfondo");
const ctx = canvas.getContext('2d');
const lato=15;
var mat;
const delay =50;
const colour='rgb(30, 0, 180)';//'indigo';//'rgb(30, 0, 140)';//'rgb(30,5,115)';//'rgb(20,0,80)';//'lime';//'rgb(34,13,129)';
window.addEventListener('resize', resizahandler);
window.addEventListener('mousemove',(event)=>{
    var melmntx=Math.floor(event.x/lato);
    var melmnty=Math.floor(event.y/lato);
    var soglia;
    for(var i=melmnty-5;i<melmnty+5;i++){
        for(var j=melmntx-5;j<melmntx+5;j++){
            try{
                if(Math.pow(i-melmnty,2)+Math.pow(j-melmntx,2)<3){soglia=0.314;}
                else{soglia=0.7;}
                Math.random() > soglia ? mat[i][j]=1 : mat[i][j]=0;
            }catch{}
        }
    }
});


// OK

function setcanvasfullscreen(offsetx=6,offsety=6){ // mette il canvas in full screen 
    document.getElementById("canvas_sfondo").width = window.innerWidth-offsetx;
    document.getElementById("canvas_sfondo").height = window.innerHeight-offsety;
}


function drawgrid(mat){ // disegna la griglia seguendo le indicazioni della matrice
    ctx.fillStyle=colour;
    for(var i=0;i<mat.length;i++){
        for(var j=0;j<mat[0].length;j++){
            if(mat[i][j]===1){
                ctx.fillRect(j*lato,i*lato,lato,lato);
            }
        }
    }
}


function initmatrix(){ // inizializza la matrice a random in base alle dimensioni della pagina
    var matrix = [];
    for(var i=0;i<window.innerHeight/lato;i++){
        matrix[i]=[];
        for(var j=0;j<window.innerWidth/lato;j++){
        Math.random()>0.5 ? matrix[i][j]=1 : matrix[i][j]=0;
        }
    }
    return matrix;
}


function resizemat(){ // aggiusta la matrice dopo il resize caso per caso anche se è un po' buggato quando metto intera la finestra di chrome
    var matrix = [];
    //intanto prendo le nuove dimensioni (sono esatte quindi possono essere dei floating point)
    var nHeight=window.innerHeight/lato;
    var nWidth=window.innerWidth/lato;
    //studio tutti i casi possibili del ridimensionamento
    if(nHeight>mat.length && nWidth>mat[0].length){
        setcanvasfullscreen();
        //se aumentano tutte e due => ricopio tutto e metto anche random
        for(var i=0;i<mat.length;i++){
            matrix[i]=[];
            for(var j=0;j<mat[0].length;j++){
                matrix[i][j]=mat[i][j];
            }
        }
        for(var i=mat.length;i<nHeight;i++){
            matrix[i]=[];
            for(var j=mat[0].length;j<nWidth;j++){
                Math.random() > 0.5 ? matrix[i][j]=1 : matrix[i][j]=0;
            }
        }

    }
    else if(nHeight<=mat.length && nWidth<=mat[0].length){
        setcanvasfullscreen();
        //console.log("ooo new: "+nHeight+" "+nWidth+" old: "+mat.length+" "+mat[0].length); per debug
        //se rimpicciolisco tutte e due le dimensioni => ricopio tutto dalla matrice vecchia fino alle nuove dimensioni
        for(var i=0;i<nHeight;i++){
            matrix[i]=[];
            for(var j=0;j<nWidth;j++){
                matrix[i][j]=mat[i][j];
            }
        }
    }
    else if (nHeight>mat.length && nWidth<=mat[0].length){
        setcanvasfullscreen();
        //se rimpicciolisce la larghezza ma aumenta l'altezza => ricopio un po' in larghezza e tutto in altezza ma metto random le altre
        for(var i=0;i<mat.length;i++){
            matrix[i]=[];
            for(var j=0;j<nWidth;j++){
                matrix[i][j]=mat[i][j];
            }
        }
        for(var i=mat.length;i<nHeight;i++){
            matrix[i]=[];
            for(var j=0;j<nWidth;j++){
                Math.random() > 0.5 ? matrix[i][j]=1 : matrix[i][j]=0;
            }
        }
    }
    else if (nHeight<=mat.length && nWidth>mat[0].length){
        setcanvasfullscreen();
        //se rimpicciolisce l'altezza ma aumenta la larghezza => ricopio un po' in altezza e tutto in larghezza ma metto random le altre
        for(var i=0;i<nHeight;i++){
            matrix[i]=[];
            for(var j=0;j<mat[0].length;j++){
                matrix[i][j]=mat[i][j];
            }
            for(var j=mat[0].length;j<nWidth;j++){
                Math.random() > 0.5 ? matrix[i][j]=1 : matrix[i][j]=0;
            }
        }
    }
    return matrix;
}


function resizahandler(){ // aggiunsta la matrice e disegna
    mat = resizemat()
    drawgrid(mat);
}


function calcneighbours(_i,_j){
    var n=0;
    for(var i=_i-1;i<=_i+1;i++){
        for(var j=_j-1;j<=_j+1;j++){
            if(mat[i][j]===1)n++;
        }
    }
    if(mat[_i][_j]===1){n-=1;}
    return n;
}


function GOLupdate(){ // game of life
    var nmat = [];
    var neig;
    for(var i=0;i<mat.length;i++){
        nmat[i]=[];
        for(var j=0;j<mat[0].length;j++){

            nmat[i][j]=0;

            if(i >= 1 && i < mat.length-1 && j >=1 && j < mat[0].length-1){ // if per evitare la cornice

                neig=calcneighbours(i,j);
                //if(i==1 && j==1){console.log("i vicini di 1 1 sono: "+neig)} per debug

                // MAIN RULES
                if(neig<2){nmat[i][j]=0;}
                else if(neig == 2){nmat[i][j]=mat[i][j];}
                else if(neig == 3){nmat[i][j]=1;}
                else if(neig>3){nmat[i][j]=0;}
            }

        }
    }

    return nmat;
}

function init(){
    setcanvasfullscreen();
    mat = initmatrix();
    drawgrid(mat);
}




function sleep(ms) { // cosa significano le cose in questa funzione? boh l'ho presa da internet javascript di merda
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function run(){
    init();
    while(true){
        mat=GOLupdate();
        drawgrid(mat);
        await sleep(delay);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}


/* l'ho definito direttamente nel listner ma vabe
async function mousehandler(event){
    var melmntx=Math.floor(event.x/lato);
    var melmnty=Math.floor(event.y/lato);
    var soglia;
    for(var i=melmnty-5;i<melmnty+5;i++){
        for(var j=melmntx-5;j<melmntx+5;j++){
            try{
                if(Math.pow(i-melmnty,2)+Math.pow(j-melmntx,2)<3){soglia=0.314;}
                else{soglia=0.7;}
                Math.random() > soglia ? mat[i][j]=1 : mat[i][j]=0;
            }catch{}
        }
    }
    await sleep(50);
}
*/





// leeessgooooo
run();