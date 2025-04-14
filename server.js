<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chơi với Bot</title>
    <link rel="stylesheet" href="style.css" />
    <style>
        #board {
            display: grid;
            grid-template-columns: repeat(15, 30px);
            grid-template-rows: repeat(15, 30px);
            gap: 1px;
            margin-top: 20px;
        }
        .cell {
            width: 30px;
            height: 30px;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            background-color: #f0f0f0;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Chế độ: Chơi với Bot</h1>
        <div id="board"></div>
        <p id="status"></p>
        <button onclick="window.location.href='game.html'">Quay lại</button>
    </div>
    <script src="bot.js"></script>
    <script>
        const size = 15;
        const board = [];
        let gameOver = false;
        let currentPlayer = "X";

        const boardDiv = document.getElementById("board");

        function createBoard() {
            boardDiv.innerHTML = "";
            board.length = 0;
            for (let i = 0; i < size; i++) {
                const row = [];
                for (let j = 0; j < size; j++) {
                    const cell = document.createElement("div");
                    cell.classList.add("cell");
                    cell.dataset.row = i;
                    cell.dataset.col = j;
                    cell.addEventListener("click", handleClick);
                    boardDiv.appendChild(cell);
                    row.push("");
                }
                board.push(row);
            }
        }

        function handleClick(e) {
            if (gameOver || currentPlayer !== "X") return;
            const row = +e.target.dataset.row;
            const col = +e.target.dataset.col;
            if (board[row][col] !== "") return;

            makeMove(row, col, "X");
            if (checkWin(board, row, col, "X")) {
                document.getElementById("status").textContent = "Bạn thắng!";
                gameOver = true;
                return;
            }
            currentPlayer = "O";
            setTimeout(botMove, 300);
        }

        function botMove() {
            const move = getBestMove(board, "O", "X", 3); // độ sâu 3 để bot chơi khó hơn
            if (!move) return;
            makeMove(move.row, move.col, "O");
            if (checkWin(board, move.row, move.col, "O")) {
                document.getElementById("status").textContent = "Bot thắng!";
                gameOver = true;
                return;
            }
            currentPlayer = "X";
        }

        function makeMove(row, col, symbol) {
            board[row][col] = symbol;
            const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
            if (cell) cell.textContent = symbol;
        }

        createBoard();
    </script>
</body>
</html>