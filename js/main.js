function start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");

    /* Principais variaves do jogo */
    var jogo = {};
    var gameOver = false;
    var podeAtirar = true;
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
        divCollision();
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
            disparo();
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

    function disparo() {
        if (podeAtirar == true) {
            podeAtirar = false;

            posY_Jogador = parseInt($("#jogador").css("top"));
            posX_Jogador = parseInt($("#jogador").css("left"));
            posX_Disparo = posX_Jogador + 190;
            posY_Disparo = posY_Jogador + 37;

            $("#fundoGame").append("<div id='disparo'></div>"); //cria a div.disparo dentro de fundoGame
            $("#disparo").css("top", posY_Disparo);
            $("#disparo").css("left", posX_Disparo);

            var tempoDisparo = window.setInterval(executaDisparo, 30);
        }

        function executaDisparo() {
            posX_Disparo = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posX_Disparo + 15);

            if (posX_Disparo > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    function divCollision() {
        var collision1 = ($("#jogador").collision($("#inimigo1")));
        var collision2 = ($("#jogador").collision($("#inimigo2")));
        var collision3 = ($("#disparo").collision($("#inimigo1")));
        var collision4 = ($("#disparo").collision($("#inimigo2")));
        var collision5 = ($("#jogador").collision($("#amigo")));
        var collision6 = ($("#inimigo2").collision($("#amigo")));
        
        if (collision1.length > 0) {
            posX_Inimigo1 = parseInt($("inimigo1").css("left"));
            posY_Inimigo1 = parseInt($("#inimigo1").css("top"));
            explosion1(posX_Inimigo1, posY_Inimigo1);

            posY_Inimigo1 = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posY_Inimigo1);
        }

        if (collision2.length > 0) {
            posX_Inimigo2 = parseInt($("#inimigo2").css("left"));
            posY_Inimigo2 = parseInt($("#inimigo2").css("top"));
            explosion2(posX_Jogador, posX_Jogador);

            $("#inimigo2").remove;
            
            respawnInimigo2();
        }

        

    }

    function explosion1(posX, posY) {
        $("#fundoGame").append("<div id='explosion1'></div>");
        $("#explosion1").css("background-image", "../imgs/explosao.png");

        var div = $("#explosion1");
        div.css("top", posY);
        div.css("left", posX);
        div.animate({width: 200, opacity: 0}, "slow");

        var timeExplosion = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            div.remove();
            window.clearInterval(timeExplosion);
            timeExplosion = null;
        }
    }

    function explosion2(posX, posY) {
        $("#fundoGame").append("<div id='explosion1'></div>");
        $("#explosion1").css("background-image", "../imgs/explosao.png");

        var div = $("#explosion1");
        div.css("top", posY);
        div.css("left", posX);
        div.animate({width: 200, opacity: 0}, "slow");

        var timeExplosion = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            div.remove();
            window.clearInterval(timeExplosion);
            timeExplosion = null;
        }
    }

    function respawnInimigo2() {
        var timeCollision2 = window.setInterval(respawn2, 5000);

        function respawn2() {
            window.clearInterval(timeCollision2);
            timeCollision2 = null;

            if (gameOver === false) {
                $("#fundoGame").append("<div id='inimigo2'></div>");
            }
        }
    }

}
