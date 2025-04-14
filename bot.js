// bot.js - bot thông minh đánh khó

function getBestMove(board, bot = "O", player = "X") {
    const size = board.length;
    let bestScore = -Infinity;
    let bestMove = null;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === "") {
                board[i][j] = bot;
                if (checkWin(board, i, j, bot)) {
                    board[i][j] = "";
                    return { row: i, col: j }; // thắng luôn thì đánh
                }
                board[i][j] = player;
                if (checkWin(board, i, j, player)) {
                    board[i][j] = "";
                    return { row: i, col: j }; // chặn người chơi thắng
                }
                board[i][j] = "";

                const score = evaluate(board, i, j, bot, player);
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }
    return bestMove;
}

function evaluate(board, row, col, bot, player) {
    let score = 0;
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (const [dx, dy] of directions) {
        score += count(board, row, col, dx, dy, bot) * 10;
        score += count(board, row, col, dx, dy, player) * 2;
    }

    return score;
}

function count(board, row, col, dx, dy, symbol) {
    let count = 0, block = 0;
    const size = board.length;

    let r = row + dx, c = col + dy;
    while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === symbol) {
        count++;
        r += dx;
        c += dy;
    }
    if (r < 0 || r >= size || c < 0 || c >= size || (board[r][c] !== "" && board[r][c] !== symbol)) block++;

    r = row - dx; c = col - dy;
    while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === symbol) {
        count++;
        r -= dx;
        c -= dy;
    }
    if (r < 0 || r >= size || c < 0 || c >= size || (board[r][c] !== "" && board[r][c] !== symbol)) block++;

    return block === 2 ? 0 : count;
}

function checkWin(board, row, col, symbol) {
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (const [dx, dy] of directions) {
        let count = 1;
        let r = row + dx, c = col + dy;
        while (r >= 0 && r < board.length && c >= 0 && c < board.length && board[r][c] === symbol) {
            count++;
            r += dx;
            c += dy;
        }
        r = row - dx; c = col - dy;
        while (r >= 0 && r < board.length && c >= 0 && c < board.length && board[r][c] === symbol) {
            count++;
            r -= dx;
            c -= dy;
        }
        if (count === 5) return true;
    }
    return false;
}