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

    let status = null;

    let activePlayer = players.playerOne;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players.playerOne ? players.playerTwo : players.playerOne;
    };
    const changePlayerOneName = (name) => players.playerOne.name = name;

    const changePlayerTwoName = (name) => players.playerTwo.name = name;

    const getBoard = () => gameboard.getBoard();

    const getActivePlayer = () => activePlayer;

    const getStatus = () => status;

    const resetBoard = () => {
        gameboard.resetBoard()
        activePlayer = players.playerOne;
        status = null;
    };

    const playRound = (row, col) => {
        if (gameboard.getBoard()[row][col].getValue() != 0) return

        gameboard.placeMarker(row, col, activePlayer.marker);

        if (checkWinner(row, col)) {
            status = "win";
            return
        }

        if (checkTie()) {
            status = "tie";
            return
        }

        switchActivePlayer();
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
                    tie = false;
                }
            });
        });
        return tie;
    }

    return { playRound, getBoard, getActivePlayer, getStatus, resetBoard, changePlayerOneName, changePlayerTwoName };
}

function ScreenController() {
    const game = GameController();

    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");
    const statusDiv = document.querySelector("#stats");
    const restartDiv = document.querySelector(".restart");

    const playerOneInput = document.querySelector("#p1");
    const playerTwoInput = document.querySelector("#p2");


    const updateScreen = () => {
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        boardDiv.replaceChildren();
        turnDiv.textContent = "TURN: " + activePlayer.name.toUpperCase();
        statusDiv.classList.remove("status");
        if (game.getStatus() !== null) {
            statusDiv.classList.add("status");
        }
        statusDiv.textContent = game.getStatus() === "win" ? `${activePlayer.name} won`
            : game.getStatus() === "tie" ? "Game is a Tie" : "";


        board.forEach((rows, rowIndex) => {
            rows.forEach((cell, colIndex) => {
                const button = document.createElement("button");
                button.classList.add("cell");

                button.dataset.row = rowIndex;
                button.dataset.col = colIndex;

                if (cell.getValue() === 1)
                    button.classList.add("xInside");

                if (cell.getValue() === -1)
                    button.classList.add("oInside");


                boardDiv.appendChild(button);
            });
        });
    };

    const clickHandler = (e) => {
        const clickedRow = e.target.dataset.row;
        const clickedCol = e.target.dataset.col;

        if (!clickedCol || !clickedRow) return

        if (game.getStatus()) return

        game.playRound(clickedRow, clickedCol);
        updateScreen();
    };

    const resetHandler = () => {
        game.resetBoard();
        updateScreen()
    }


    playerOneInput.addEventListener("input", () => {
        let input = playerOneInput.value ? playerOneInput.value : "Player One";
        game.changePlayerOneName(input);
    });

    playerTwoInput.addEventListener("input", () => {
        let input = playerTwoInput.value ? playerTwoInput.value : "Player One";
        game.changePlayerTwoName(input);
    });

    boardDiv.addEventListener("click", clickHandler);
    restartDiv.addEventListener("click", resetHandler);
    updateScreen();
}

ScreenController();