function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        boardWithCellValues.forEach((value, index) => console.log(`${index + 1}.\t${value}`));
    };

    function placeMarker(player) {
        let placedRow;
        let placedCol;
        do {
            placedRow = prompt("Enter the row:");
        } while (placedRow < 1 || placedRow > 3);
        do {
            placedCol = prompt("Enter the column:");
        } while (placedCol < 1 || placedCol > 3);

        board[placedRow - 1][placedCol - 1].setValue(player);
    }

    return { getBoard, printBoard, placeMarker }
};

function Cell() {
    let value = 0;

    const getValue = () => value;

    const setValue = (player) => value = player;

    return { getValue, setValue }
}

function GameController() {
    const board = Gameboard();

    let playerOneName = "Player One";
    let playerTwoName = "Player Two";

    const players = {
        playerOne: {
            name: playerOneName,
            marker: 1
        },
        playerTwo: {
            name: playerTwoName,
            marker: 2
        }
    }

    let activePlayer = players.playerOne;

    const changeActivePlayer = () => {
        activePlayer = activePlayer === players.playerOne ? players.playerTwo : players.playerOne;
    };



    return {};
}

const game = GameController();