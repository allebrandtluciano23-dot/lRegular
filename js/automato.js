(function (global) {
    'use strict';

    const AFD = {
        estados: ['q0', 'q1', 'q2', 'q3', 'q4'],
        inicial: 'q0',
        finais: new Set(['q2', 'q4']),
        alfabeto: ['0', '1'],
        transicoes: {
            q0: { '0': 'q1', '1': 'q3' },
            q1: { '0': 'q2', '1': 'q1' },
            q2: { '0': 'q1', '1': 'q2' },
            q3: { '0': 'q4', '1': 'q3' },
            q4: { '0': 'q3', '1': 'q4' },
        },
    };

    function transitar(estado, simbolo) {
        return AFD.transicoes[estado] && AFD.transicoes[estado][simbolo];
    }

    function ehFinal(estado) {
        return AFD.finais.has(estado);
    }

    global.Automato = { AFD, transitar, ehFinal };
})(window);