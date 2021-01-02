function start() {
    $("#inicio").hide();

    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='score'></div>");
    $("#fundoGame").append("<div id='energy'></div>");

    /* Principais variaves do jogo */
    var jogo = {};
    var gameOver = false;
    var pontuacao = 0;
    var aliadoSalvo = 0;
    var aliadoPerdido = 0;
    var playerEnergy = 3;
    var podeAtirar = true;
    var vel_Inimigo1 = 7;
    var posY_Inimigo1 = parseInt(Math.random() * 334);
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }

    jogo.pressionou = [];

    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var somFundo = document.getElementById("somFundo");
    var somGameOver = document.getElementById("somGameOver");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");

    somFundo.addEventListener("ended", function() {somFundo.currentTime = 0;
        somFundo.play();}, false);
    somFundo.play();

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
        scoreUpdate();
        energyUpdate();
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
            somDisparo.play();

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
            playerEnergy--;

            posX_Inimigo1 = parseInt($("#inimigo1").css("left"));
            posY_Inimigo1 = parseInt($("#inimigo1").css("top"));
            explosion1(posX_Inimigo1, posY_Inimigo1);

            posY_Inimigo1 = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posY_Inimigo1);
        }

        if (collision2.length > 0) {
            playerEnergy--;

            posX_Inimigo2 = parseInt($("#inimigo2").css("left"));
            posY_Inimigo2 = parseInt($("#inimigo2").css("top"));
            explosion2(posX_Inimigo2, posY_Inimigo2);

            $("#inimigo2").remove();
            
            respawnInimigo2();
        }

        if (collision3.length > 0) {
            pontuacao += 100;
            //vel_Inimigo1 += 0.3;

            posX_Inimigo1 = parseInt($("#inimigo1").css("left"));
            posY_Inimigo1 = parseInt($("#inimigo1").css("top"));
            explosion1(posX_Inimigo1, posY_Inimigo1);

            $("#disparo").css("left", 950);
            
            posY_Inimigo1 = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posY_Inimigo1);

        }

        if (collision4.length > 0) {
            pontuacao += 50;

            posX_Inimigo2 = parseInt($("#inimigo2").css("left"));
            posY_Inimigo2 = parseInt($("#inimigo2").css("top"));
            explosion2(posX_Inimigo2, posY_Inimigo2);

            $("#disparo").css("left", 950);
            $("#inimigo2").remove();

            respawnInimigo2();
        }

        if (collision5.length > 0) {
            somResgate.play();

            aliadoSalvo++;

            $("#amigo").remove();

            respawnAmigo();
        }

        if (collision6.length > 0) {
            aliadoPerdido++;

            posX_Amigo = parseInt($("#amigo").css("left"));
            posY_Amigo = parseInt($("#amigo").css("top"));
            
            explosion3(posX_Amigo, posY_Amigo);
            $("#amigo").remove();

            respawnAmigo();
        }

    }

    function explosion1(posX, posY) {
        somExplosao.play();

        $("#fundoGame").append("<div id='explosion1'></div>");
        $("#explosion1").css("background-image", "url(../imgs/explosao.png)");

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
        somExplosao.play();

        $("#fundoGame").append("<div id='explosion2'></div>");
        $("#explosion2").css("background-image", "url(../imgs/explosao.png)");

        var div = $("#explosion2");
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

    function explosion3(posX, posY) {
        somPerdido.play();

        $("#fundoGame").append("<div id='explosion3' class='anima4'></div>");
        $("#explosion3").css("left", posX);
        $("#explosion3").css("top", posY);

        var timeExplosion = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            $("#explosion3").remove();
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

    function respawnAmigo() {
        var timeCollision5 = window.setInterval(respawn5, 6000);
        
        function respawn5() {
            window.clearInterval(timeCollision5);
            timeCollision5 = null;

            if (gameOver === false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }

    function scoreUpdate(){
        $("#score").html("<h2> Pontos: " + pontuacao + " Salvos: " +aliadoSalvo + " Perdidos: " +aliadoPerdido + "</h2>");
    }

    function energyUpdate() {
        if (playerEnergy === 3) {
            $("#energy").css("background-image", "url(../imgs/energia3.png)");
        }

        if (playerEnergy === 2) {
            $("#energy").css("background-image", "url(../imgs/energia2.png)");
        }

        if (playerEnergy === 1) {
            $("#energy").css("background-image", "url(../imgs/energia1.png)");
        }

        if (playerEnergy === 0) {
            $("#energy").css("background-image", "url(../imgs/energia0.png)");

            endGame();
        }
    }

    function endGame() {
        gameOver = true;
        somFundo.pause();
        somGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#energy").remove();

        $("#fundoGame").append("<div id='fim'></div>");

        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " +pontuacao
        +"</p>" +"<div id='restart' onClick = restartGame()><h3>Jogar Novamente</h3></div>");

    }

}

function restartGame() {
    somGameOver.pause();
    $("#fim").remove();
    
    start();
}
