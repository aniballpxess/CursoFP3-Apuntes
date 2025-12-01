const colors = ['red', 'blue', 'cyan', 'yellow', 'green', 'purple'];
const board = document.getElementById('game_board');

function createBoard() {
    board.innerHTML = '';
    for (let row = 1; row <= 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            const selectedColor = colors[Math.floor(Math.random() * colors.length)];
            let contrastColor;
            switch (selectedColor) {
                case 'red':
                case 'cyan':
                case 'yellow':
                    contrastColor = 'black';
                    break;
                case 'blue':
                case 'green':
                case 'purple':
                    contrastColor = 'white';
                    break;
                default:
                    break;
            }
            cell.style.backgroundColor = selectedColor;
            cell.style.color = contrastColor;
            cell.textContent = String.fromCharCode(97 + col) + row;
            board.appendChild(cell);
        }
    }
}

document.getElementById('btn_newGame').addEventListener('click', createBoard);
createBoard();
