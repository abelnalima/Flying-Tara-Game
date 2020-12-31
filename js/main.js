function start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

    /* Principais variaves do jogo */
    var jogo = {};

    /* Game Loop */
    jogo.timer = setInterval(loop, 30);

    function loop() {
        moveFundo();
    }

    /* Função que movimenta o Background */
    function moveFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position")); //Pega o valor da posição atual do background
        $("#fundoGame").css("background-position", esquerda-2); //atualiza a posição 1 pixel para a esquerda
    }

}
