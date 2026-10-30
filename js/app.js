(function () {
    'use strict';

    // import
    var AFD = window.Automato.AFD;
    var transitar = window.Automato.transitar;
    var ehFinal = window.Automato.ehFinal;

    // histórico
    var listaAceitas = document.getElementById('lista-aceitas');
    var listaRejeitadas = document.getElementById('lista-rejeitadas');
    var LIMITE_HISTORICO = 7;

    // elementos da tela
    var input = document.getElementById('frase');
    var estadoAtualEl = document.getElementById('estado-atual');
    var palavraAtualEl = document.getElementById('palavra-atual');
    var resultadoEl = document.getElementById('resultado');
    var linhas = Array.prototype.slice.call(
        document.querySelectorAll('#tabela-afd tr[data-estado]')
    );

    // --- estado interno ---
    var estadoAtual = AFD.inicial;
    var palavra = '';
    var aceitou = null;
    var proximaPalavraReset = false;

    // guarda o <td> da última transição
    var ultimaCelula = null;

    // ---------- UI ----------
    function destacarEstado(estado, classe) {
        // percorre as linhas e marca/desmarca o <th> da primeira coluna (estado)
        linhas.forEach(function (tr) {
            var th = tr.querySelector('th');
            if (!th) return;

            var ehAtual = tr.dataset.estado === estado;

            th.classList.toggle('estado-ativo', ehAtual);

            if (ehAtual && classe) th.classList.add(classe);
            if (!ehAtual) th.classList.remove('aceito', 'rejeitado');
        });
    }

    // acende a célula <td id="origem-simbolo"> (ex: "q0-1") (última transição)
    function destacarCelula(origem, simbolo) {
        if (ultimaCelula) {
            ultimaCelula.classList.remove('celula-ativa', 'aceita', 'celula-rejeitada');
        }

        var td = document.getElementById(origem + '-' + simbolo);
        if (td) {
            td.classList.add('celula-ativa');
            ultimaCelula = td;
        } else {
            ultimaCelula = null;
        }
    }

    // apaga o destaque da célula (usado no reset)
    function limparCelula() {
        if (ultimaCelula) {
            ultimaCelula.classList.remove('celula-ativa', 'aceita', 'celula-rejeitada');
            ultimaCelula = null;
        }
    }

    function atualizarStatus() {
        estadoAtualEl.textContent = estadoAtual;
        palavraAtualEl.textContent = palavra;
        destacarEstado(estadoAtual);
    }

    function mostrarResultado(texto, tipo) {
        resultadoEl.textContent = texto;
        resultadoEl.className = 'resultado ' + tipo;
    }

    function resetarPara(q) {
        estadoAtual = q || AFD.inicial;
        palavra = '';
        aceitou = null;
        resultadoEl.textContent = '';
        resultadoEl.className = 'resultado';
        limparCelula();
        atualizarStatus();
    }

    // ---------- núcleo ----------
    function processarSimbolo(simbolo) {
        if (aceitou !== null) resetarPara();

        var origem = estadoAtual;
        var proximo = transitar(origem, simbolo);
        if (proximo === undefined) return;

        // acende a célula correspondente (origem × símbolo)
        destacarCelula(origem, simbolo);

        palavra += simbolo;
        estadoAtual = proximo;
        atualizarStatus();
    }

    function verificarPalavra() {
        if (palavra.length === 0) return;

        var aceita = ehFinal(estadoAtual);
        aceitou = aceita;

        if (aceita) {
            mostrarResultado('✅ Palavra "' + palavra + '" RECONHECIDA', 'aceita');
            destacarEstado(estadoAtual, 'aceito');

            if (ultimaCelula) {
                ultimaCelula.classList.remove('celula-rejeitada');
                ultimaCelula.classList.add('aceita');
            }
        } else {
            mostrarResultado('❌ Palavra "' + palavra + '" REJEITADA', 'rejeita');
            destacarEstado(estadoAtual, 'rejeitado');

            if (ultimaCelula) {
                ultimaCelula.classList.remove('aceita');
                ultimaCelula.classList.add('celula-rejeitada');
            }
        }

        adicionarAoHistorico(palavra, aceita);

        palavra = '';
        palavraAtualEl.textContent = '';
        proximaPalavraReset = true;
    }

    // adiciona a palavra na lista correspondente
    function adicionarAoHistorico(palavra, aceita) {
        var lista = aceita ? listaAceitas : listaRejeitadas;

        var li = document.createElement('li');
        li.textContent = palavra;               // exibe a palavra
        if (palavra === '') li.textContent = '(vazio)';

        lista.insertBefore(li, lista.firstChild); // mais recente no topo

        // remove o excesso (mantém só LIMITE_HISTORICO itens)
        while (lista.children.length > LIMITE_HISTORICO) {
            lista.removeChild(lista.lastChild);
        }
    }

    // ---------- teclado ----------
    input.addEventListener('keydown', function (e) {
        if (e.key === ' ') {
            e.preventDefault();
            verificarPalavra();
            return;
        }

        if (e.key === 'Backspace') {
            e.preventDefault();
            resetarPara();
            return;
        }

        if (e.key === '0' || e.key === '1') {
            e.preventDefault();
            if (proximaPalavraReset) {
                resetarPara();
                proximaPalavraReset = false;
            }
            processarSimbolo(e.key);
            return;
        }

        if (e.key.length === 1) e.preventDefault();
    });

    // ---------- init ----------
    resetarPara();
})();