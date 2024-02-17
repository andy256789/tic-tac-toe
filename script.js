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

    function placeMarker(row, col, marker) {
        board[row][col].setValue(marker);
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

        boardWithCellValues[row].forEach(((col) => rowSum += col));
        boardWithCellValues.forEach((row) => colSum += row[col]);

        if (rowSum === 3 || rowSum === -3 || colSum === 3 || colSum === -3) {
            console.log(`${activePlayer.name} has won the game!`);
        }

        switchActivePlayer();
        printNewRound();
    };

    printNewRound();

    return { playRound };
}

const game = GameController();
while (true) {
    let row = prompt("Enter the row: ");
    let col = prompt("Enter the column: ");
    game.playRound(row - 1, col - 1);
}