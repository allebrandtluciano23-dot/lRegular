(function (global) {
    'use strict';

    const AFD = {
        estados: ['q0', 'q1', 'q2'],
        inicial: 'q0',
        finais: new Set(['q2']),
        alfabeto: ['0', '1'],
        transicoes: {
            q0: { '0': 'q1', '1': 'q1' },
            q1: { '0': 'q2', '1': 'q1' },
            q2: { '0': 'q1', '1': 'q2' },
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