function start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

    /* Principais variaves do jogo */
    var jogo = {};
    var vel_Inimigo1 = 7;
    var posY_Inimigo1 = parseInt(Math.random() * 334);
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }

    jogo.pressionou = [];

    /* Verifica se o jogador pressionou alguma tecla */
    $(document).keydown(function(e) {
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e) {
        jogo.pressionou[e.which] = false;
    });

    /* Game Loop */
    jogo.timer = setInterval(loop, 30);

    function loop() {
        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
    }

    /* Função que movimenta o Background */
    function moveFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position")); //Pega o valor da posição atual do background
        $("#fundoGame").css("background-position", esquerda-2); //atualiza a posição 1 pixel para a esquerda
    }

    function moveJogador() {
        /* Pega o valor do top e diminui em 10px */
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo-10);

            if (topo <= 0) {
                $("#jogador").css("top", topo+10);
            }
        }

        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo+10);

            if (topo >= 434) {
                $("#jogador").css("top", topo-10);
            }
        }

        if (jogo.pressionou[TECLA.D]) {
            //Funcao Disparo
        }
    }

    function moveInimigo1() {
        posX_Inimigo1 =  parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posX_Inimigo1 - vel_Inimigo1);
        $("#inimigo1").css("top", posY_Inimigo1);

        if (posX_Inimigo1 <= 0) {
            posY_Inimigo1 = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posY_Inimigo1);
        }
    }

    function moveInimigo2() {
        posX_Inimigo2 = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posX_Inimigo2 - 3);

        if (posX_Inimigo2 <= 0) {
            $("#inimigo2").css("left", 775);
        }
    }

    function moveAmigo() {
        posX_Amigo = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posX_Amigo + 1);

        if (posX_Amigo >= 906) {
            $("#amigo").css("left", 0);
        }
    }

}
