function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    const resetBoard = () => {
        board.splice(0, board.length);
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        boardWithCellValues.forEach((value, index) => console.log(`${index + 1}.\t${value}`));
    };

    function placeMarker(row, col, marker) {
        board[row][col].setValue(marker);
    }

    resetBoard();

    return { getBoard, printBoard, placeMarker, resetBoard }
};

function Cell() {
    let value = 0;

    const getValue = () => value;

    const setValue = (player) => value = player;

    return { getValue, setValue }
}

function GameController() {
    const gameboard = Gameboard();

    let playerOneName = "Player One";
    let playerTwoName = "Player Two";

    const players = {
        playerOne: {
            name: playerOneName,
            marker: 1
        },
        playerTwo: {
            name: playerTwoName,
            marker: -1
        }
    }

    let status;

    let activePlayer = players.playerOne;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players.playerOne ? players.playerTwo : players.playerOne;
    };

    //remove later
    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`${activePlayer.name}'s turn`);
    }

    const getBoard = () => gameboard.getBoard();

    const getActivePlayer = () => activePlayer;

    const getStatus = () => status;

    const playRound = (row, col) => {
        if (gameboard.getBoard()[row][col].getValue() != 0) return

        gameboard.placeMarker(row, col, activePlayer.marker);

        if (checkTie()) {
            status = "Tie";
            gameboard.resetBoard();
            return
        }

        if (checkWinner(row, col)) {

            status = `${activePlayer.name} won`;
            gameboard.resetBoard();
            return
        }
        status = "";

        switchActivePlayer();
        printNewRound();
    };

    const checkWinner = (row, col) => {
        const board = gameboard.getBoard();
        const size = board.length;
        const target = board[row][col].getValue() * 3;

        let rowSum = 0;
        let colSum = 0;
        let diagSum = 0;
        let antiDiagSum = 0;

        for (let i = 0; i < size; i++) {
            rowSum += board[row][i].getValue();
            colSum += board[i][col].getValue();
            diagSum += board[i][i].getValue();
            antiDiagSum += board[i][size - i - 1].getValue();
        }

        return (rowSum === target || colSum === target || diagSum === target || antiDiagSum === target);
    };

    const checkTie = () => {
        let tie = true;
        gameboard.getBoard().forEach((row) => {
            row.forEach((cell) => {
                if (cell.getValue() === 0) {
                    console.log(cell.getValue());
                    tie = false;
                }
            });
        });
        return tie;
    }

    printNewRound();

    return { playRound, getBoard, getActivePlayer, getStatus };
}

function ScreenController() {
    const game = GameController();
    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");
    const statusDiv = document.querySelector(".status");

    const updateScreen = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        boardDiv.replaceChildren();

        turnDiv.textContent = `${activePlayer.name}'s turn`;
        statusDiv.textContent = game.getStatus();

        board.forEach((rows, rowIndex) => {
            rows.forEach((cell, colIndex) => {
                const button = document.createElement("button");
                button.classList.add("cell");

                button.dataset.row = rowIndex;
                button.dataset.col = colIndex;

                button.textContent = cell.getValue() === 1 ? "X"
                    : cell.getValue() === -1 ? "O"
                        : "";
                boardDiv.appendChild(button);
            });
        });
    };

    const clickHandler = (e) => {
        const clickedRow = e.target.dataset.row;
        const clickedCol = e.target.dataset.col;

        if (!clickedCol || !clickedRow) return

        game.playRound(clickedRow, clickedCol);
        updateScreen();
    };

    boardDiv.addEventListener("click", clickHandler);

    updateScreen();
}

ScreenController();