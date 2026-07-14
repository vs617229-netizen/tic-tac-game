const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");

const canvas = document.getElementById("lineCanvas");
const ctx = canvas.getContext("2d");

let currentPlayer = "X";
let gameActive = true;
let board = ["","","","","","","","",""];

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function resizeCanvas(){
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

cells.forEach(cell=>{
    cell.addEventListener("click", cellClick);
});

restartBtn.addEventListener("click", restartGame);

function cellClick(){

    const index = this.dataset.index;

    if(board[index]!=="" || !gameActive) return;

    board[index]=currentPlayer;

    this.textContent=currentPlayer;

    checkWinner();

}

function checkWinner(){

    for(let pattern of winPatterns){

        const [a,b,c]=pattern;

        if(board[a] &&
           board[a]===board[b] &&
           board[a]===board[c]){

            gameActive=false;

            statusText.textContent="🎉 Player "+currentPlayer+" Wins!";

            drawWinningLine(a,c);

            return;

        }

    }

    if(!board.includes("")){
        statusText.textContent="🤝 Match Draw";
        gameActive=false;
        return;
    }

    currentPlayer=currentPlayer==="X"?"O":"X";

    statusText.textContent="Player "+currentPlayer+" Turn";

}

function drawWinningLine(start,end){

    const startCell=cells[start];
    const endCell=cells[end];

    const boardRect=document.getElementById("board").getBoundingClientRect();

    const s=startCell.getBoundingClientRect();
    const e=endCell.getBoundingClientRect();

    const x1=s.left-boardRect.left+s.width/2;
    const y1=s.top-boardRect.top+s.height/2;

    const x2=e.left-boardRect.left+e.width/2;
    const y2=e.top-boardRect.top+e.height/2;

    animateLine(x1,y1,x2,y2);

}

function animateLine(x1,y1,x2,y2){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    let progress=0;

    function animate(){

        progress+=0.03;

        if(progress>1) progress=1;

        const cx=x1+(x2-x1)*progress;
        const cy=y1+(y2-y1)*progress;

        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.beginPath();

        ctx.moveTo(x1,y1);

        ctx.lineTo(cx,cy);

        ctx.lineWidth=8;

        ctx.strokeStyle="#00e5ff";

        ctx.shadowColor="#00e5ff";

        ctx.shadowBlur=20;

        ctx.lineCap="round";

        ctx.stroke();

        if(progress<1){

            requestAnimationFrame(animate);

        }

    }

    animate();

}

function restartGame(){

    board=["","","","","","","","",""];

    currentPlayer="X";

    gameActive=true;

    statusText.textContent="Player X Turn";

    cells.forEach(cell=>cell.textContent="");

    ctx.clearRect(0,0,canvas.width,canvas.height);

}