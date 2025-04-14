const boardSize = 15;
let board = [];
let currentPlayer = "X"; // Người chơi luôn là X
let gameOver = false;

const boardElement = document.getElementById("board");

// Khởi tạo bàn cờ
function createBoard() {
    boardElement.innerHTML = "";
    board = [];

    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener("click", handleCellClick);
            boardElement.appendChild(cell);
            row.push("");
        }
        board.push(row);
    }

    gameOver = false;
    currentPlayer = "X";
}

function handleCellClick(e) {
    if (gameOver || currentPlayer !== "X") return;

    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);

    if (board[row][col] !== "") return;

    board[row][col] = "X";
    e.target.textContent = "X";

    if (checkWin(board, row, col, "X")) {
        alert("Bạn thắng!");
        gameOver = true;
        return;
    }

    currentPlayer = "O";

    // Delay bot chơi
    setTimeout(botMove, 300);
}

function botMove() {
    if (gameOver) return;

    const move = getBestMove(board, "O", "X");
    if (!move) {
        alert("Hòa!");
        return;
    }

    board[move.row][move.col] = "O";
    const cell = document.querySelector(
        `.cell[data-row='${move.row}'][data-col='${move.col}']`
    );
    cell.textContent = "O";

    if (checkWin(board, move.row, move.col, "O")) {
        alert("Bot thắng!");
        gameOver = true;
        return;
    }

    currentPlayer = "X";
}

// Bot thông minh hơn
function getBestMove(board, botSymbol = "O", playerSymbol = "X") {
    const size = board.length;
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                // Thử bot thắng
                board[i][j] = botSymbol;
                if (checkWin(board, i, j, botSymbol)) {
                    board[i][j] = "";
                    return { row: i, col: j };
                }
                board[i][j] = "";

                // Chặn người chơi thắng
                board[i][j] = playerSymbol;
                if (checkWin(board, i, j, playerSymbol)) {
                    board[i][j] = "";
                    return { row: i, col: j };
                }
                board[i][j] = "";

                // Đánh giá điểm
                const score = evaluateMove(board, i, j, botSymbol, playerSymbol);
                if (score > bestScore) {
                    bestScore = score;
                    move = { row: i, col: j };
                }
            }
        }
    }

    return move;
}

function evaluateMove(board, row, col, bot, player) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    let score = 0;

    for (let [dx, dy] of directions) {
        score += countSequence(board, row, col, dx, dy, bot) * 2;
        score += countSequence(board, row, col, dx, dy, player);
    }

    return score;
}

function countSequence(board, row, col, dx, dy, symbol) {
    const size = board.length;
    let count = 0;
    let block = 0;

    // Forward
    let i = row + dx;
    let j = col + dy;
    while (i >= 0 && i < size && j >= 0 && j < size) {
        if (board[i][j] === symbol) {
            count++;
            i += dx;
            j += dy;
        } else if (board[i][j] === "") {
            break;
        } else {
            block++;
            break;
        }
    }

    // Backward
    i = row - dx;
    j = col - dy;
    while (i >= 0 && i < size && j >= 0 && j < size) {
        if (board[i][j] === symbol) {
            count++;
            i -= dx;
            j -= dy;
        } else if (board[i][j] === "") {
            break;
        } else {
            block++;
            break;
        }
    }

    if (block === 2) return 0;
    return Math.pow(10, count);
}

// Kiểm tra thắng (chỉ 5 con liên tiếp)
function checkWin(board, row, col, player) {
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1]
    ];

    for (let [dx, dy] of directions) {
        let count = 1;

        let r = row - dx;
        let c = col - dy;
        while (isValid(r, c, board) && board[r][c] === player) {
            count++;
            r -= dx;
            c -= dy;
        }

        r = row + dx;
        c = col + dy;
        while (isValid(r, c, board) && board[r][c] === player) {
            count++;
            r += dx;
            c += dy;
        }

        if (count === 5) {
            return true;
        }
    }

    return false;
}

function isValid(row, col, board) {
    return row >= 0 && row < board.length && col >= 0 && col < board[0].length;
}

// Bắt đầu
createBoard();
