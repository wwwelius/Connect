document.getElementById('userplay').addEventListener('click',()=>{
    document.querySelector('.board').innerHTML = "";
    game_board();
    document.querySelector('.turn').innerHTML = "User's First"
    var alg = new Algorithm();
    alg.player = 'P';
    alg.gameBoard = alg.getNewGameBoard();
    document.getElementById('output').innerHTML = alg.getGameBoardAsString();
})
document.getElementById('aiplay').addEventListener('click',()=>{
    document.querySelector('.board').innerHTML = "";
    game_board();
    document.querySelector('.turn').innerHTML = "AI First"
    var alg = new Algorithm();
    alg.player = 'P';
    alg.gameBoard = alg.getNewGameBoard();

    var move = alg.move( alg.getAvailableMoves(), alg.gameBoard );
    alg.doMove(move, alg.player);
    log('P', move);

    document.getElementById('output').innerHTML = alg.getGameBoardAsString();
})

document.getElementById('reset').addEventListener('click',()=>{
    document.querySelector('.board').innerHTML = "";
    document.querySelector('.turn').innerHTML = "";
    document.querySelector('.win').innerHTML = "";
})

function log(player, move) {
    if (player == 'O') {
        let row = rows_count[move];
        let ball = document.getElementById(row + "$" + move);
        let innerBall = document.createElement("div");
        innerBall.classList.add("inner-ball");
        innerBall.classList.remove("yellow");
        innerBall.classList.add("red");
        ball.append(innerBall);
        rows_count[move]--;
    } else {
        setTimeout(() => {
            let row = rows_count[move];
            let ball = document.getElementById(row + "$" + move);
            let innerBall = document.createElement("div");
            innerBall.classList.add("inner-ball");
            innerBall.classList.remove("red");
            innerBall.classList.add("yellow");
            ball.append(innerBall);
            rows_count[move]--;
        }, 750);
    }
}
let rows_count;
function game_board() {
    rows_count = [5, 5, 5, 5, 5, 5, 5];
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 7; col++) {
            let ball = document.createElement('div');
            ball.classList.add('ball');
            ball.id = row + "$" + col;
            ball.addEventListener('click', set_ball)
            document.querySelector('.board').append(ball);
        }
    }
}

function set_ball() {
    let row_col = this.id.split('$');

    let col = parseInt(row_col[1]);
    let row = rows_count[col];
    var alg = new Algorithm();
    alg.player = 'P';
    alg.gameBoard = alg.parseGameBoard(document.getElementById('output').innerHTML.split('\n'));
    alg.doMove(col, 'O');
    log('O', col);

    if (alg.isVictory(false)) {
        setTimeout(() => {
            document.querySelector('.win').innerHTML = "Red Win";
            document.querySelectorAll('.ball').forEach((ball)=>{
                ball.removeEventListener('click');
            })
        }, 1000);
    }
    else {
        var move = alg.move(alg.getAvailableMoves(), alg.gameBoard);
        alg.doMove(move, alg.player);
        log('P', move);
        if (alg.isVictory(true)) {
            setTimeout(() => {
                document.querySelector('.win').innerHTML = "Yellow Win";
                document.querySelectorAll('.ball').forEach((ball)=>{
                    console.log(ball);
                    ball.removeEventListener('click',set_ball);
                })
            }, 1000);
        }
    }
    document.getElementById('output').innerHTML = alg.getGameBoardAsString();
    console.log(document.getElementById('output').innerHTML);
}