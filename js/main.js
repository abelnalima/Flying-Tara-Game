var bestScore = 0;

function start() {
    /* --- HIDING DIVs ---  */
    $("#nameLogo").hide();
    $("#howToPlay").hide();
    $("#start").hide();

    /* --- INVOKE DIVs --- */
    $("#gameBackground").append("<div id='interface'></div>");
    $("#gameBackground").append("<div id='flyingTara'></div>");
    $("#gameBackground").append("<div id='miniUfo' class='animaMiniUfo'></div>");
    $("#gameBackground").append("<div id='rebelTruck' class='animaRebelTruck'></div>");
    $("#gameBackground").append("<div id='marsMecha' class='animaMarsMecha'></div>");
    $("#gameBackground").append("<div id='prisionerOfWar' class='animaPow'></div>");
    $("#gameBackground").append("<div id='energyBar'></div>");
    $("#gameBackground").append("<div id='savedPow'></div>");
    $("#gameBackground").append("<div id='lostPow'></div>");
    $("#gameBackground").append("<div id='playerScore'></div>");
    $("#gameBackground").append("<div id='bestScore'></div>");

    /* --- GLOBAL DECLARATIONS --- */
    var jogo = {};
    var gameOver = false;
    var score = 0;
    var RescuedPow = 0;
    var lostPow = 0;
    var playerEnergy = 3;
    var Firing = false;
    var speedMiniUfo = 7;
    var posY_miniUfo = parseInt(Math.random() * 334);
    var KEY = {
        MISSILE: 68, //KEY D
        SPACE: 32,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39
    }

    jogo.pressionou = [];

    /* --- SOUNDS --- */
    var soundFiring = document.getElementById("somDisparo");
    var soundExplosion = document.getElementById("somExplosao");
    var soundBackground = document.getElementById("somFundo");
    var soundGameOver = document.getElementById("somGameOver");
    var soundLostPow = document.getElementById("somPerdido");
    var soundRescuedPow = document.getElementById("somResgate");

    soundBackground.addEventListener("ended", function() {
        soundBackground.currentTime = 0;
        soundBackground.play();}, false);
    
    soundGameOver.pause(); //Pausa a execução ao dar RESTART GAME
    soundGameOver.currentTime = 0; //Reinicia o som
    soundBackground.play();

    /* --- KEY PRESSED VERIFICATION --- */
    $(document).keydown(function(e) {
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function(e) {
        jogo.pressionou[e.which] = false;
    });

    /* --- GAME LOOPER --- */
    jogo.timer = setInterval(loop, 30);

    function loop() {
        moveBackground();
        moveFlyingTara();
        moveMiniUfo();
        moveRebelTruck();
        moveMarsMecha();
        movePrisionerOfWar();
        divCollision();
        scoreUpdate();
        energyUpdate();
    }

    /* --- MOVEMENTS --- */

    function moveBackground() { //MOVE THE BACKGROUND
        let moveLeft = parseInt($("#gameBackground").css("background-position")); //Pega o valor da posição atual do background
        $("#gameBackground").css("background-position", (moveLeft - 2)); //atualiza a posição 1 pixel para a esquerda
    }

    function moveFlyingTara() { //MOVE THE PLAYER AVATAR
        if (jogo.pressionou != KEY.UP && jogo.pressionou != KEY.DOWN) { //Quando Arrow UP/DOWN não estiverem pressionados, utilizar o sprite idle
            $("#flyingTara").css("background-image", "url(../imgs/flyingTara_idle.png)");
        };

        if (jogo.pressionou[KEY.UP]) {
            $("#flyingTara").css("background-image", "url(../imgs/flyingTara_up.png)"); //Altera o sprite sempre que presionar Arrow UP

            let top = parseInt($("#flyingTara").css("top"));
            $("#flyingTara").css("top", (top - 10));

            if (top <= 60) {
                $("#flyingTara").css("top", (top + 10));
            }
        }

        if (jogo.pressionou[KEY.DOWN]) {
            $("#flyingTara").css("background-image", "url(../imgs/flyingTara_down.png)"); //Altera o sprite sempre que presionar Arrow DOWN

            let top = parseInt($("#flyingTara").css("top"));
            $("#flyingTara").css("top", (top + 10));

            if (top >= 520) {
                $("#flyingTara").css("top", (top - 10));
            }
        }

        if (jogo.pressionou[KEY.RIGHT]) {
            let left = parseInt($("#flyingTara").css("left"));
            $("#flyingTara").css("left", (left + 10));

            if (left >= 875) {
                $("#flyingTara").css("left", (left - 10));
            }
        }

        if (jogo.pressionou[KEY.LEFT]) {
            let left = parseInt($("#flyingTara").css("left"));
            $("#flyingTara").css("left", (left - 10));

            if (left <= 0) {
                $("#flyingTara").css("left", (left + 10));
            }
        }

        if (jogo.pressionou[KEY.MISSILE]) {
            fireMissile();
        }
    }

    function moveMiniUfo() { //MOVE THE MINIUFO
        let posX_miniUfo =  parseInt($("#miniUfo").css("left"));

        $("#miniUfo").css("left", (posX_miniUfo - speedMiniUfo));
        $("#miniUfo").css("top", posY_miniUfo);

        if (posX_miniUfo <= 0) {
            posY_miniUfo = parseInt(Math.random() * 334);
            $("#miniUfo").css("left", 860);
            $("#miniUfo").css("top", posY_miniUfo);
        }
    }

    function moveRebelTruck() { //MOVE THE REBELTRUCK
        let posX_rebelTruck = parseInt($("#rebelTruck").css("left"));

        $("#rebelTruck").css("left", (posX_rebelTruck - 3));

        if (posX_rebelTruck <= 0) {
            $("#rebelTruck").css("left", 820);
        }
    }

    function moveMarsMecha() { //MOVE THE MARSMECHA
        let posX_marsMecha = parseInt($("#marsMecha").css("left"));

        $("#marsMecha").css("left", (posX_marsMecha - 3));

        if (posX_marsMecha <= 0) {
            $("#marsMecha").css("left", 775);
        }
    }

    function movePrisionerOfWar() { //MOVE THE POW
        let posX_pow = parseInt($("#prisionerOfWar").css("left"));

        $("#prisionerOfWar").css("left", (posX_pow + 1));

        if (posX_pow >= 906) {
            $("#prisionerOfWar").css("left", 0);
        }
    }

    function fireMissile() { //MOVE THE MISSILE && CHECK IF FIRING
        if (Firing == false) {
            soundFiring.play();
            Firing = true;
            
            let posY_flyingTara = parseInt($("#flyingTara").css("top"));
            let posX_flyingTara = parseInt($("#flyingTara").css("left"));
            let posX_missile = posX_flyingTara + 85;
            let posY_missile = posY_flyingTara + 37;

            $("#gameBackground").append("<div id='missile' class='animaMissile'></div>");
            $("#missile").css("left", posX_missile);
            $("#missile").css("top", posY_missile);

            var timedMissile = window.setInterval(firing, 30);
        }

        function firing() {
            let posX_missile = parseInt($("#missile").css("left"));

            $("#missile").css("left", posX_missile + 15);

            if (posX_missile >= 900) {
                window.clearInterval(timedMissile);
                timedMissile = null;

                $("#missile").remove();

                Firing = false;
            }

            if (posX_missile === -999) {
                window.clearInterval(timedMissile);
                timedMissile = null;

                $("#missile").remove();

                Firing = false;
            }
        }
    }

    /* --- COLLISION DETECTIONS --- */
    function divCollision() {
        let collision_flyingTara_miniUfo = ($("#flyingTara").collision($("#miniUfo")));
        let collision_flyingTara_rebelTruck = ($("#flyingTara").collision($("#rebelTruck")));
        let collision_flyingTara_marsMecha = ($("#flyingTara").collision($("#marsMecha")));
        let collision_flyingTara_pow = ($("#flyingTara").collision($("#prisionerOfWar")));
        let collision_missile_miniUfo = ($("#missile").collision($("#miniUfo")));
        let collision_missile_rebelTruck = ($("#missile").collision($("#rebelTruck")));
        let collision_missile_marsMecha = ($("#missile").collision($("#marsMecha")));
        let collision_pow_rebelTruck = ($("#prisionerOfWar").collision($("#rebelTruck")));
        
        
        if (collision_flyingTara_miniUfo.length > 0) { //Collision FlyingTara x MiniUfo
            playerEnergy--;

            let posX_miniUfo = parseInt($("#miniUfo").css("left"));
            posY_miniUfo = parseInt($("#miniUfo").css("top"));
            let posX_flyingTara = parseInt($("#flyingTara").css("left"));
            let posY_flyingTara = parseInt($("#flyingTara").css("top"));
            
            miniUfoExplosion(posX_miniUfo, posY_miniUfo);
            flyingTaraExplosion(posX_flyingTara, (posY_flyingTara - 30));
            $("#flyingTara").remove();

            posY_miniUfo = parseInt(Math.random() * 334);

            $("#miniUfo").css("left", 860);
            $("#miniUfo").css("top", posY_miniUfo);

            respawnFlyingTara();
        }

        if (collision_flyingTara_rebelTruck.length > 0) { //Collision FlyingTara x RebelTruck
            playerEnergy--;

            let posX_rebelTruck = parseInt($("#rebelTruck").css("left"));
            let posY_rebelTruck = parseInt($("#rebelTruck").css("top"));
            let posX_flyingTara = parseInt($("#flyingTara").css("left"));
            let posY_flyingTara = parseInt($("#flyingTara").css("top"));

            rebelTruckExplosion(posX_rebelTruck, posY_rebelTruck);
            flyingTaraExplosion(posX_flyingTara, (posY_flyingTara - 40));

            $("#flyingTara").remove();
            $("#rebelTruck").remove();
            
            respawnFlyingTara();
            respawnRebelTruck();
        }

        if (collision_flyingTara_marsMecha.length > 0) { //Collision FlyingTara x MarsMecha
            playerEnergy--;

            let posX_marsMecha = parseInt($("#marsMecha").css("left"));
            let posY_marsMecha = parseInt($("#marsMecha").css("top"));
            let posX_flyingTara = parseInt($("#flyingTara").css("left"));
            let posY_flyingTara = parseInt($("#flyingTara").css("top"));

            marsMechaExplosion(posX_marsMecha, (posY_marsMecha + 60));
            flyingTaraExplosion(posX_flyingTara, (posY_flyingTara - 40));

            $("#flyingTara").remove();
            $("#marsMecha").remove();

            respawnFlyingTara();
            respawnMarsMecha();
        }

        if (collision_flyingTara_pow.length > 0) { //Colisão entre FlyingTara e PrisionerOfWar
            soundRescuedPow.play();
            RescuedPow++;

            $("#prisionerOfWar").remove();

            respawnPow();
        }

        if (collision_missile_miniUfo.length > 0) { //Collison Missile x MiniUfo
            score += 100;
            //vel_Inimigo1 += 0.3;

            let posX_miniUfo = parseInt($("#miniUfo").css("left"));
            posY_miniUfo = parseInt($("#miniUfo").css("top"));
            miniUfoExplosion(posX_miniUfo, posY_miniUfo);

            $("#missile").css("left", -999);
            
            posY_miniUfo = parseInt(Math.random() * 334);
            $("#miniUfo").css("left", 860);
            $("#miniUfo").css("top", posY_miniUfo);
        }

        if (collision_missile_rebelTruck.length > 0) { //Collision Missile x RebelTruck
            score += 50;

            let posX_rebelTruck = parseInt($("#rebelTruck").css("left"));
            let posY_rebelTruck = parseInt($("#rebelTruck").css("top"));
            rebelTruckExplosion(posX_rebelTruck, posY_rebelTruck);

            $("#missile").css("left", -999);
            $("#rebelTruck").remove();

            respawnRebelTruck();
        }

        if (collision_missile_marsMecha.length > 0) { //Collision Missile x MarsMecha
            score += 50;

            let posX_marsMecha = parseInt($("#marsMecha").css("left"));
            let posY_marsMecha = parseInt($("#marsMecha").css("top"));
            marsMechaExplosion(posX_marsMecha, (posY_marsMecha + 60));

            $("#missile").css("left", -999);
            $("#marsMecha").remove();

            respawnMarsMecha();
        }

        if (collision_pow_rebelTruck.length > 0) { //Collision PrisionerOfWar x RebelTruck
            lostPow++;

            let posX_pow = parseInt($("#prisionerOfWar").css("left"));
            let posY_pow = parseInt($("#prisionerOfWar").css("top"));
            powDeath(posX_pow, posY_pow);

            $("#prisionerOfWar").remove();

            respawnPow();
        }
    }

    /* --- EXPLOSIONS/DEATH ANIMATIONS --- */
    function flyingTaraExplosion(posX, posY) { //EXPLOSION FOR THE PLAYER AVATAR
        soundExplosion.play();

        $("#gameBackground").append("<div id='flyingTaraExplosion' class='animaFlyingTaraExplosion'></div>");

        $("#flyingTaraExplosion").css("background-image", "url(../imgs/flyingTaraExplosion.png)");
        $("#flyingTaraExplosion").css("left", posX);
        $("#flyingTaraExplosion").css("top", posY);

        var timedFlyingTaraExplosion = setInterval(removeFlyingTaraExplosion, 900);

        function removeFlyingTaraExplosion() {
            $("#flyingTaraExplosion").remove();
            window.clearInterval(timedFlyingTaraExplosion);
            timedFlyingTaraExplosion = null;
        }
    }

    function miniUfoExplosion(posX, posY) { //EXPLOSION FOR THE MINIUFO
        soundExplosion.play();

        $("#gameBackground").append("<div id='miniUfoExplosion' class='animaMiniUfoExplosion'></div>");

        $("#miniUfoExplosion").css("background-image", "url(../imgs/miniUfoExplosion.png)");
        $("#miniUfoExplosion").css("left", posX);
        $("#miniUfoExplosion").css("top", posY);

        var timedMiniUfoExplosion = window.setInterval(removeMiniUfoExplosion, 910);

        function removeMiniUfoExplosion() {
            $("#miniUfoExplosion").remove();
            window.clearInterval(timedMiniUfoExplosion);
            timedMiniUfoExplosion = null;
        }
    }

    function rebelTruckExplosion(posX, posY) { //EXPLOSION FOR THE REBELTRUCK
        soundExplosion.play();

        $("#gameBackground").append("<div id='rebelTruckExplosion' class='animaRebelTruckExplosion'></div>");
        $("#rebelTruckExplosion").css("background-image", "url(../imgs/rebelTruckExplosion2.png)");
        $("#rebelTruckExplosion").css("left", posX);
        $("#rebelTruckExplosion").css("top", posY);

        var timedRebelTruckExplosion = setInterval(removeRebelTruckExplosion, 910);

        function removeRebelTruckExplosion() {
            $("#rebelTruckExplosion").remove();
            window.clearInterval(timedRebelTruckExplosion);
            timedRebelTruckExplosion = null;
        }
    }

    function marsMechaExplosion(posX, posY) { //EXPLOSION FOR THE MARSMECHA
        soundExplosion.play();

        $("#gameBackground").append("<div id='marsMechaExplosion' class='animaMarsMechaExplosion'></div>");

        $("#marsMechaExplosion").css("background-image", "url(../imgs/marsMechaExplosion.png)");
        $("#marsMechaExplosion").css("left", posX);
        $("#marsMechaExplosion").css("top", posY);

        var timedMarsMechaExplosion = window.setInterval(removeMarsMechaExplosion, 910);

        function removeMarsMechaExplosion() {
            $("#marsMechaExplosion").remove();
            window.clearInterval(timedMarsMechaExplosion);
            timedMarsMechaExplosion = null;
        }
    }

    function powDeath(posX, posY) { //DEATH OF P.O.W.
        soundLostPow.play();

        $("#gameBackground").append("<div id='powDeath' class='animaPowDeath'></div>");

        $("#powDeath").css("background-image", "url(../imgs/powDeath.png)");
        $("#powDeath").css("left", posX);
        $("#powDeath").css("top", posY);

        var timedPowDeath = window.setInterval(removePowDeath, 900);

        function removePowDeath() {
            $("#powDeath").remove();
            window.clearInterval(timedPowDeath);
            timedPowDeath = null;
        }
    }

    /* --- RESPAWNS --- */
    function respawnFlyingTara() { //RESPAWN FOR THE PLAYER AVATAR
        var timedRespawnFlyingTara = window.setInterval(respawn, 1500);

        function respawn() {
            window.clearInterval(timedRespawnFlyingTara);
            timedRespawnFlyingTara = null;

            if (gameOver === false) {
                $("#gameBackground").append("<div id='flyingTara'></div>")
            }
        }
    }

    function respawnRebelTruck() { //RESPAWN FOR THE REBELTRUCK
        var timedRespawnRebelTruck = window.setInterval(respawn, 3000);

        function respawn() {
            window.clearInterval(timedRespawnRebelTruck);
            timedRespawnRebelTruck = null;

            if (gameOver === false) {
                $("#gameBackground").append("<div id='rebelTruck' class='animaRebelTruck'></div>");
            }
        }
    }

    function respawnMarsMecha() { //RESPAWN FOR THE MARSMECHA
        var timedRespawnMarsMecha = window.setInterval(respawn, 5000);

        function respawn() {
            window.clearInterval(timedRespawnMarsMecha);
            timedRespawnMarsMecha = null;

            if (gameOver === false) {
                $("#gameBackground").append("<div id='marsMecha' class='animaMarsMecha'></div>")
            }
        }
    }

    function respawnPow() { //RESPAWN FOR THE P.O.W.
        var timedRespawnPow = window.setInterval(respawn, 6000);
        
        function respawn() {
            window.clearInterval(timedRespawnPow);
            timedRespawnPow = null;

            if (gameOver === false) {
                $("#gameBackground").append("<div id='prisionerOfWar' class='animaPow'></div>");
            }
        }
    }

    /* --- SCORE TABLE --- */
    function scoreUpdate() {
        $("#playerScore").html("<p> Score </p>" +"<p>" +score +"</p>");
        $("#savedPow").html("<p> Saved </p>" +"<p>" +RescuedPow +"</p>");
        $("#lostPow").html("<p> Lost </p>" +"<p>" +lostPow +"</p>");
        $("#bestScore").html("<p> Best </p>" +"<p>" +bestScore +"</p>");
    }   

    /* --- PLAYER ENERGY VERIFICATION --- */
    function energyUpdate() {
        if (playerEnergy === 3) {
            $("#energyBar").css("background-image", "url(../imgs/newEnergyBar.png)");
        }

        if (playerEnergy === 2) {
            $("#energyBar").css("background-image", "url(../imgs/newEnergyBar2.png)");
        }

        if (playerEnergy === 1) {
            $("#energyBar").css("background-image", "url(../imgs/newEnergyBar1.png)");
        }

        if (playerEnergy === 0) {
            $("#energyBar").css("background-image", "url(../imgs/newEnergyBar0.png)");

            if (score > bestScore) {
                bestScore = score;
            }

            endGame();
        }
    }

    /* --- END GAME --- */
    function endGame() {
        gameOver = true;
        soundBackground.pause();
        soundGameOver.play();

        window.clearInterval(jogo.timer);
        jogo.timer = null;

        $("#flyingTara").remove();
        $("#miniUfo").remove();
        $("#rebelTruck").remove();
        $("#marsMecha").remove();
        $("#prisionerOfWar").remove();
        $("#energyBar").remove();
        $("#interface").remove();
        $("#savedPow").remove();
        $("#lostPow").remove();
        $("#playerScore").remove();
        $("#bestScore").remove();

        $("#gameBackground").append("<div id='endScreen'></div>");

        $("#endScreen").html("<h1> Game Over </h1><p>SCORE</p>" +"<p>" +score
        +"</p>" +"<div id='restartButton' onClick='restartGame()'> RESTART GAME </div>");
    }

}

/* --- RESTART GAME --- */
function restartGame() {
    $("#endScreen").remove();
    
    start();
}