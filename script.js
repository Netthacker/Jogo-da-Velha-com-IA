let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function makeMove(index) {
  if (gameActive && board[index] === '') {
    board[index] = currentPlayer;
    updateBoard();
    checkWinner();
    togglePlayer();
  
    //Passo da onde a máquina faz a jogada.

    if (currentPlayer === 'O' && gameActive) {
      index = findBestMove();
      if (index !== null) {
        setTimeout(() => {
          board[index] = currentPlayer;
          updateBoard();
          checkWinner();
          togglePlayer();
        }, 500);
      }
    }
  }
}

function togglePlayer() {
  //Seleção do jogador
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  document.getElementById('current-player').textContent = `Próxima Jogada: ${currentPlayer}`
}

function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    // Atualiza o conteúdo de cada célula no tabuleiro
    cell.textContent = board[index];
  });
}

function checkWinner() {

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      displayWinner(board[a]);
      gameActive = false;
      return;
    }
  }
  // Verificar se todos os espaços foram preenchidos e não houve vencendor
  if (board.every(cell => cell !== '')) {
    displayDraw();
    gameActive = false;
  }
}

//Função para exibir mensagens de ganhador na tela
function displayWinner(player) {
  document.getElementById('status').textContent = `Jogador ${player} venceu!`;
}

//Função onde mostra o empate na tela
function displayDraw() {
  document.getElementById('status').textContent = 'Empate!';
}

//auto explicativo
function resetGame() {
  currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  //setando o reinício do jogo
  gameActive = true;
  updateBoard();
  document.getElementById('current-player').textContent = '1ª Jogada: X';
  document.getElementById('status').textContent = '';
}


//AI
function findBestMove() {
  /**
   * Aqui são usados duas variáveis, o melhor escore e o melhor jeito de movimentar
   */
  let bestScore = -Infinity;
  let bestMove = null;
  /**
   * Percorre todo o board checando o que tá vazio
   */
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      //Faz uma jogada simulada
      board[i] = 'O';
      //Checa se o escore para ver se  é a melhor jogada até agora
      const score = minimax(board, false);
      //retorna ao estado original
      board[i] = '';
      //Se a pontuação dessa jogada foi maior que a melhor até agora, atualiza as variáveis
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}


function minimax(board, isMaximizing) {
 // Se houver um vencedor, retorna pontuação dependendo do jogador maximizador ou minimizador
  if (checkWinner()) {
    return isMaximizing ? -1 : 1;
  }
  // Se o tabuleiro estiver cheio e não houver vencedor, retorna um empate (pontuação 0)
  if (board.every(cell => cell !== '')) {
    return 0;
  }
  
  // Lógica recursiva para calcular a pontuação para cada movimento possível
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        // Simula uma jogada 'O' e chama recursivamente a função minimax para o próximo nível da árvore
        board[i] = 'O';
        const score = minimax(board, false);
        //Desfaz a jogada simulada
        board[i] = '';
        // Atualiza o melhor escore com o máximo entre o escore atual e o melhor escore encontrado
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
}