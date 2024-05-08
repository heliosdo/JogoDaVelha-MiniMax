var tabuleiroOriginal;
const jogador01 = "O";
const jogador02 = "X";
const combinacoesVencedoras = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6],
  [2, 4, 6],
  [0, 4, 8]
];
const celulas = document.querySelectorAll(".cell");
const mensagemElement = document.getElementById("qualJogador");

let jogadorAtual = jogador01;
let pontuacaoJogador = 0;
let pontuacaoIA = 0;



function clicarCelulaContraIA(celula) {
  if (typeof tabuleiroOriginal[celula.target.id] === "number" && !verificarVitoria(tabuleiroOriginal, jogador01) && !verificarVitoria(tabuleiroOriginal, jogador02)) {
    if (jogadorAtual === jogador01) {
      realizarJogada(celula.target.id, jogador01);
      if (!verificarVitoria(tabuleiroOriginal, jogador01) && !verificarEmpate()) {
        jogadorAtual = jogador02;
        realizarJogada(melhorPosicao(), jogador02);
      }
    }
  }
}


function clicarCelulaContraAmigo(celula) {

  if (typeof tabuleiroOriginal[celula.target.id] === "number" && !verificarVitoria(tabuleiroOriginal, jogador01) && !verificarVitoria(tabuleiroOriginal, jogador02)) {
    if (jogadorAtual === jogador01) {
      realizarJogada(celula.target.id, jogador01);
      if (!verificarVitoria(tabuleiroOriginal, jogador01) && !verificarEmpate()) {
        jogadorAtual = jogador02; // Troca para o próximo jogador
      }
    } else {
      realizarJogada(celula.target.id, jogador02); // Joga com o segundo jogador
      if (!verificarVitoria(tabuleiroOriginal, jogador02) && !verificarEmpate()) {
        jogadorAtual = jogador01; // Troca para o próximo jogador
      }
    }
  }
}

function iniciarJogoContraIA() {
  mensagemElement.innerText = "Jogando contra IA";
  tabuleiroOriginal = Array.from(Array(9).keys());
  jogadorAtual = jogador01; // Define o jogador humano como o primeiro a jogar
  for (var i = 0; i < celulas.length; i++) {
    celulas[i].innerText = "";
    celulas[i].style.removeProperty("background-color");
    celulas[i].removeEventListener("click", clicarCelulaContraAmigo, false);
    celulas[i].addEventListener("click", clicarCelulaContraIA, false);
  }
}

function iniciarJogoContraAmigo() {
  mensagemElement.innerText = "Que vença o Melhor!!";
  tabuleiroOriginal = Array.from(Array(9).keys());
  jogadorAtual = jogador01; // Define o jogador humano como o primeiro a jogar
  for (var i = 0; i < celulas.length; i++) {
    celulas[i].innerText = "";
    celulas[i].style.removeProperty("background-color");
    celulas[i].removeEventListener("click", clicarCelulaContraIA, false);
    celulas[i].addEventListener("click", clicarCelulaContraAmigo, false);
  }
}

function realizarJogada(posicao, jogador) {
  if (!verificarVitoria(tabuleiroOriginal, jogador01) && !verificarVitoria(tabuleiroOriginal, jogador02) && typeof tabuleiroOriginal[posicao] === "number") {
    tabuleiroOriginal[posicao] = jogador;
    document.getElementById(posicao).innerText = jogador;
    let jogoVencido = verificarVitoria(tabuleiroOriginal, jogador);
    if (jogoVencido) finalizarJogo(jogoVencido);
    jogadorAtual = jogadorAtual === jogador01 ? jogador02 : jogador01; // Troca de jogador apenas se o jogo não terminou
  }
}

function verificarVitoria(tabuleiro, jogador) {
  let jogadas = tabuleiro.reduce((a, e, i) => (e === jogador ? a.concat(i) : a), []);
  let jogoVencido = null;
  for (let [index, combinacao] of combinacoesVencedoras.entries()) {
    if (combinacao.every(elem => jogadas.indexOf(elem) > -1)) {
      jogoVencido = { index: index, jogador: jogador };
      break;
    }
  }
  return jogoVencido;
}


function finalizarJogo(jogoVencido) {
  for (let index of combinacoesVencedoras[jogoVencido.index]) {
    document.getElementById(index).style.backgroundColor =
      jogoVencido.jogador == jogador01 ? "blue" : "red";
  }
  for (var i = 0; i < celulas.length; i++) {
    celulas[i].removeEventListener("click", clicarCelula, false);
  }
}

function casasVazias() {
  return tabuleiroOriginal.filter(s => typeof s == "number");
}

function melhorPosicao() {
  return minimax(tabuleiroOriginal, jogador02).index;
}

function verificarEmpate() {
  if (casasVazias().length == 0) {
    for (var i = 0; i <= celulas.length; i++) {
      celulas[i].style.backgroundColor = "green";
      celulas[i].removeEventListener("click", clicarCelula, false);
    }
    return true;
  }
  return false;
}

function minimax(novoTabuleiro, jogador, alpha = -Infinity, beta = Infinity) {
  var casasDisponiveis = casasVazias();

  if (verificarVitoria(novoTabuleiro, jogador01)) {
    return { score: -1 };
  } else if (verificarVitoria(novoTabuleiro, jogador02)) {
    return { score: 1 };
  } else if (casasDisponiveis.length === 0) {
    return { score: 0 };
  }

  var jogadas = [];
  for (var i = 0; i < casasDisponiveis.length; i++) {
    var jogada = {};
    jogada.index = novoTabuleiro[casasDisponiveis[i]];
    novoTabuleiro[casasDisponiveis[i]] = jogador;

    if (jogador == jogador02) {
      var resultado = minimax(novoTabuleiro, jogador01, alpha, beta);
      jogada.score = resultado.score;
      alpha = Math.max(alpha, jogada.score); // Atualiza o alfa
    } else {
      var resultado = minimax(novoTabuleiro, jogador02, alpha, beta);
      jogada.score = resultado.score;
      beta = Math.min(beta, jogada.score); // Atualiza o beta
    }

    novoTabuleiro[casasDisponiveis[i]] = jogada.index;

    jogadas.push(jogada);

    // Poda alfa-beta
    if (jogador === jogador02 && jogada.score >= beta) {
      break; 
    }
    if (jogador === jogador01 && jogada.score <= alpha) {
      break; 
    }
  }

  var melhorJogada;
  if (jogador === jogador02) {
    var melhorPontuacao = -Infinity;
    for (var i = 0; i < jogadas.length; i++) {
      if (jogadas[i].score > melhorPontuacao) {
        melhorPontuacao = jogadas[i].score;
        melhorJogada = i;
      }
    }
  } else {
    var melhorPontuacao = Infinity;
    for (var i = 0; i < jogadas.length; i++) {
      if (jogadas[i].score < melhorPontuacao) {
        melhorPontuacao = jogadas[i].score;
        melhorJogada = i;
      }
    }
  }

  return jogadas[melhorJogada];
}

