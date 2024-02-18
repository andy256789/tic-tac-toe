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
    const board = gameboard.getBoard();

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

    let activePlayer = players.playerOne;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players.playerOne ? players.playerTwo : players.playerOne;
    };

    const printNewRound = () => {
        gameboard.printBoard();
        console.log(`${activePlayer.name}'s turn`);
    }

    const playRound = (row, col) => {

        console.log(`Placing ${activePlayer.name}'s marker at row: ${row + 1} column: ${col + 1}`);
        gameboard.placeMarker(row, col, activePlayer.marker);

        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));

        let rowSum = 0;
        let colSum = 0;
        let diagSum = 0;
        let antiDiagSum = 0;

        boardWithCellValues[row].forEach(((col) => rowSum += col));
        boardWithCellValues.forEach((row) => colSum += row[col]);

        boardWithCellValues.forEach((row, Yindex) => {
            row.forEach((cell, Xindex) => {
                if (Yindex === Xindex) {
                    diagSum += cell;
                }
            });
        });

        boardWithCellValues.forEach((row, Yindex) => {
            row.forEach((cell, Xindex) => {
                if ((Yindex + Xindex) === (row.length - 1)) {
                    antiDiagSum += cell;
                }
            });
        });

        if (rowSum === 3 || rowSum === -3 || colSum === 3 || colSum === -3 || diagSum === 3 || diagSum === -3 || antiDiagSum === 3 || antiDiagSum === -3) {
            gameboard.printBoard();
            console.log(`${activePlayer.name} has won the game!`);
            gameboard.resetBoard();
            return
        }

        switchActivePlayer();
        printNewRound();
    };

    const promptUser = () => {
        let row;
        let col;

        row = parseInt(prompt("Enter the row: "));
        col = parseInt(prompt("Enter the column: "));

        if (row > 3 || row < 1 || col > 3 || col < 1) {
            console.log("Input must be either 1, 2 or 3");
            return
        }

        if (board[row - 1][col - 1].getValue() !== 0) {
            console.log("Invalid input");
            return
        }

        playRound(row - 1, col - 1);
    };

    printNewRound();

    return { playRound, promptUser };
}

const game = GameController();
while (true) {
    game.promptUser();
}