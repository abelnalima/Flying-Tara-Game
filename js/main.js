var bestScore = 0;

function start() {
    /* HIDE DIVs */
    $("#nameLogo").remove();
    $("#howToPlay").remove();
    $("#startButton").remove();

    /* APPEND DIVs */
    $("#gameBackground").append("<div id='interface'></div>");
    $("#gameBackground").append("<div id='energyBar'></div>");
    $("#gameBackground").append("<div id='savedPow' class='scoreWindow'></div>");
    $("#gameBackground").append("<div id='lostPow' class='scoreWindow'></div>");
    $("#gameBackground").append("<div id='playerScore' class='scoreWindow'></div>");
    $("#gameBackground").append("<div id='bestScore' class='scoreWindow'></div>");
    $("#gameBackground").append("<div id='flyingTara'></div>");
    $("#gameBackground").append("<div id='miniUfo' class='animaMiniUfo'></div>");
    $("#gameBackground").append("<div id='marsMecha' class='animaMarsMecha'></div>");
    $("#gameBackground").append("<div id='prisionerOfWar' class='animaPow'></div>");

    /* === GLOBAL DECLARATIONS === */
    var game = {};

    var gameOver = false;
    var playerEnergy = 3;
    var isFiring = false;
    var isBigEyes = false;
    var damageMarsMecha = 0;
    var posY_miniUfo = parseInt(Math.floor(Math.random() * (380 - 80 + 1)) + 80);
    var posY_bigEyes = parseInt(Math.floor(Math.random() * (380 - 80 + 1)) + 80);
    var score = {player: 0, savedPow: 0, lostPow: 0};
    var charSpeed = {miniUfo: 7, bigEyes: 7, marsMecha: 3, pow: 1, missile: 15};
    var key = {D: 68, UP: 38, DOWN: 40, LEFT: 37, RIGTH: 39};
    
    game.pressed = [];

    /* === SOUND === */
    var sound = {
        gameOver: document.getElementById("soundGameOver"),
        lostPow: document.getElementById("soundLostPow"),
        savedPow: document.getElementById("soundSavedPow"),
        stage: document.getElementById("soundStage"),
        missile: document.getElementById("soundMissile"),
        explosion: document.getElementById("soundExplosion"),
        explosionBig: document.getElementById("soundExplosionBig")};

    sound.stage.addEventListener("ended", function() {
        sound.stage.currentTime = 0;
        sound.stage.play();
    }, false);

    sound.gameOver.pause();
    sound.gameOver.currentTime = 0;
    sound.stage.play();

    /* === KEY PRESSED VERIFICATION === */
    $(document).keydown(function(e) {
        game.pressed[e.which] = true;
    });

    $(document).keyup(function(e) {
        game.pressed[e.which] = false;
    });

    /* === GAME LOOPER === */
    game.timer = setInterval(loop, 30);

    function loop() {
        moveBackground();
        moveFlyingTara();
        moveMiniUfo();
        moveBigEyes();
        moveMarsMecha();
        movePow();
        spawnBigEyes();
        divColiision();
        scoreUpdate();
        energyUpdate();
    }

    /* === BACKGROUND MOVEMENT === */
    function moveBackground() {
        let moveBG = parseInt($("#gameBackground").css("background-position")); //pega a posição atual do BG
        $("#gameBackground").css("background-position", (moveBG - 2)); //move para a direita
    }

    /* === PLAYER/ENEMY MOVEMENT */
    function moveFlyingTara() {
        if (game.pressed != key.UP && game.pressed != key.DOWN) {
            $("#flyingTara").css("background", "url(../imgs/flyingTaraIdle.png)");
        }

        if (game.pressed[key.UP]) {
            $("#flyingTara").css("background", "url(../imgs/flyingTaraUp.png) transparent");

            let posY_flyingTara = parseInt($("#flyingTara").css("top"));
            $("#flyingTara").css("top", (posY_flyingTara - 10));

            if (posY_flyingTara <= 60) {
                $("#flyingTara").css("top", (posY_flyingTara + 10));
            }
        }

        if (game.pressed[key.DOWN]) {
            $("#flyingTara").css("background", "url(../imgs/flyingTaraDown.png)");

            let posY_flyingTara = parseInt($("#flyingTara").css("top"));
            $("#flyingTara").css("top", (posY_flyingTara + 10));

            if (posY_flyingTara >= 520) {
                $("#flyingTara").css("top", (posY_flyingTara - 10));
            }
        }

        if (game.pressed[key.RIGTH]) {
            let posX_flyingTara = parseInt($("#flyingTara").css("left"));
            $("#flyingTara").css("left", (posX_flyingTara + 10));

            if (posX_flyingTara >= 875) {
                $("#flyingTara").css("left", (posX_flyingTara - 10));
            }
        }

        if (game.pressed[key.LEFT]) {
            let posX_flyingTara = parseInt($("#flyingTara").css("left"));
            $("#flyingTara").css("left", (posX_flyingTara - 10));

            if (posX_flyingTara <= 0) {
                $("#flyingTara").css("left", (posX_flyingTara + 10));
            }
        }

        if (game.pressed[key.D]) {
            fireMissile();
        }
    }

    function moveMiniUfo() {
        let posX_miniUfo = parseInt($("#miniUfo").css("left"));

        $("#miniUfo").css("left", (posX_miniUfo - charSpeed.miniUfo));
        $("#miniUfo").css("top", posY_miniUfo);

        if (posX_miniUfo <= 0) {
            posY_miniUfo = parseInt(Math.floor(Math.random() * (380 - 80 + 1)) + 80);

            $("#miniUfo").css("left", 860);
            $("#miniUfo").css("top", posY_miniUfo);
        }
    }

    function moveBigEyes() {
        let posX_bigEyes = parseInt($("#bigEyes").css("left"));

        $("#bigEyes").css("left", (posX_bigEyes - charSpeed.bigEyes));
        $("#bigEyes").css("top", posY_bigEyes);

        if (posX_bigEyes <= 0) {
            posY_bigEyes = parseInt(Math.floor(Math.random() * (400 - 90 + 1)) + 90);

            $("#bigEyes").css("left", 860);
            $("#bigeyes").css("top", posY_bigEyes);
        }
    }

    function moveMarsMecha() {
        let posX_marsMecha = parseInt($("#marsMecha").css("left"));

        $("#marsMecha").css("left", (posX_marsMecha - charSpeed.marsMecha));

        if (posX_marsMecha <= 0) {
            $("#marsMecha").css("left", 775);
        }
    }

    function movePow() {
        let posX_pow = parseInt($("#prisionerOfWar").css("left"));

        $("#prisionerOfWar").css("left", (posX_pow + charSpeed.pow));

        if (posX_pow >= 906) {
            $("#prisionerOfWar").css("left", 0);
        }
    }

    function fireMissile() {
        if (isFiring === false) {
            sound.missile.play();
            isFiring = true;

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

            $("#missile").css("left", (posX_missile + charSpeed.missile));

            if (posX_missile >= 900) {
                window.clearInterval(timedMissile);
                timedMissile = null;

                $("#missile").remove();

                isFiring = false;
            }

            if (posX_missile === -999) {
                window.clearInterval(timedMissile);
                timedMissile = null;

                $("#missile").remove();

                isFiring = false;
            }
        }
    }

    /* === COLLISIONS DETECTONS === */
    function divColiision() {
        let collision = {
            flyingTara_miniUfo: ($("#flyingTara").collision($("#miniUfo"))),
            flyingTara_marsMecha: ($("#flyingTara").collision($("#marsMecha"))),
            flyingTara_bigEyes: ($("#flyingTara").collision($("#bigEyes"))),
            flyingTara_pow: ($("#flyingTara").collision($("#prisionerOfWar"))),
            missile_miniUfo: ($("#missile").collision($("#miniUfo"))),
            missile_marsMecha: ($("#missile").collision($("#marsMecha"))),
            missile_bigEyes: ($("#missile").collision($("#bigEyes"))),
            pow_marsMecha: ($("#prisionerOfWar").collision($("#marsMecha")))
        }

        if (collision.flyingTara_miniUfo.length > 0) {
            playerEnergy--;

            let posX_miniUfo = parseInt($("#miniUfo").css("left"));
            posY_miniUfo = parseInt($("#miniUfo").css("top"));
            let posX_flyingTara = parseInt($("#flyingTara").css("left"));
            let posY_flyingTara = parseInt($("#flyingTara").css("top"));

            miniUfoExplosion(posX_miniUfo, posY_miniUfo);
            flyingTaraExplosion(posX_flyingTara, posY_flyingTara);

            $("#flyingTara").remove();
            $("#miniUfo").remove();

            respawnFlyingTara();
            respawnMiniUfo();
        }

        if (collision.flyingTara_bigEyes.length > 0) { //Collision FlyingTara x BigEyes
            playerEnergy--;

            let posX_bigEyes = parseInt($("#bigEyes").css("left"));
            let posY_bigEyes = parseInt($("#bigEyes").css("top"));
            let posX_flyingTara = parseInt($("#flyingTara").css("left"));
            let posY_flyingTara = parseInt($("#flyingTara").css("top"));

            bigEyesExplosion(posX_bigEyes, posY_bigEyes);
            flyingTaraExplosion(posX_flyingTara, posY_flyingTara);

            $("#flyingTara").remove();
            $("#bigEyes").remove();

            respawnFlyingTara();
            respawnBigEyes();
        }

        if (collision.flyingTara_marsMecha.length > 0) { //Collision FlyingTara x MarsMecha
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

        if (collision.flyingTara_pow.length > 0) { //Colisão entre FlyingTara e PrisionerOfWar
            sound.savedPow.play();
            score.savedPow++;

            if ((savedPow % 10) === 0) {
                if (playerEnergy <= 2 && playerEnergy > 0) {
                    playerEnergy++;
                }
            }

            $("#prisionerOfWar").remove();

            respawnPow();
        }

        if (collision.missile_miniUfo.length > 0) { //Collison Missile x MiniUfo
            score.player += 100;
            charSpeed.miniUfo += 0.3;

            let posX_miniUfo = parseInt($("#miniUfo").css("left"));
            posY_miniUfo = parseInt($("#miniUfo").css("top"));

            miniUfoExplosion(posX_miniUfo, posY_miniUfo);

            $("#missile").css("left", -999);
            $("#miniUfo").remove();

            respawnMiniUfo();
        }

        if (collision.missile_bigEyes.length > 0) {
            score.player += 50;
            charSpeed.bigEyes += 0.3;

            let posX_bigEyes = parseInt($("#bigEyes").css("left"));
            let posY_bigEyes = parseInt($("#bigEyes").css("top"));

            bigEyesExplosion(posX_bigEyes, posY_bigEyes);

            $("#missile").css("left", -999);
            $("#bigEyes").remove();

            respawnBigEyes();
        }

        if (collision.missile_marsMecha.length > 0) { //Collision Missile x MarsMecha
            damageMarsMecha++;

            $("#missile").css("left", -999);

            if (damageMarsMecha >= 2) {
                score.player += 50;
                damageMarsMecha = 0;
    
                let posX_marsMecha = parseInt($("#marsMecha").css("left"));
                let posY_marsMecha = parseInt($("#marsMecha").css("top"));

                marsMechaExplosion(posX_marsMecha, (posY_marsMecha + 60));
    
                $("#marsMecha").remove();
    
                respawnMarsMecha();
            }
        }

        if (collision.pow_marsMecha.length > 0) { //Collision PrisionerOfWar x MarsMecha
            score.lostPow++;

            let posX_pow = parseInt($("#prisionerOfWar").css("left"));
            let posY_pow = parseInt($("#prisionerOfWar").css("top"));

            powDeath(posX_pow, posY_pow);

            $("#prisionerOfWar").remove();

            respawnPow();
        }

    }

    /* === EXPLOSIONS && DEATH === */
    function flyingTaraExplosion(posX, posY) { //EXPLOSION FOR THE PLAYER AVATAR
        sound.explosion.play();

        $("#gameBackground").append("<div id='flyingTaraExplosion' class='animaFlyingTaraExplosion'></div>");
        $("#flyingTaraExplosion").css("background", "url(../imgs/flyingTaraExplosion.png)");
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
        sound.explosion.play();

        $("#gameBackground").append("<div id='miniUfoExplosion' class='animaMiniUfoExplosion'></div>");
        $("#miniUfoExplosion").css("background", "url(../imgs/miniUfoExplosion.png)");
        $("#miniUfoExplosion").css("left", posX);
        $("#miniUfoExplosion").css("top", posY);

        var timedMiniUfoExplosion = window.setInterval(removeMiniUfoExplosion, 910);

        function removeMiniUfoExplosion() {
            $("#miniUfoExplosion").remove();

            window.clearInterval(timedMiniUfoExplosion);
            timedMiniUfoExplosion = null;
        }
    }

    function bigEyesExplosion(posX, posY) {
        sounds.explosion.play();

        $("#gameBackground").append("<div id='bigEyesExplosion' class='animaBigEyesExplosion'></div>");
        $("#bigEyesExplosion").css("background", "url(../imgs/bigEyesExplosion.png)");
        $("#bigEyesExplosion").css("left", posX);
        $("#bigEyesExplosion").css("top", posY);

        var timedBigEyesExplosion = window.setInterval(removeBigEyesExplosion, 900);

        function removeBigEyesExplosion() {
            $("#bigEyesExplosion").remove();

            window.clearInterval(timedBigEyesExplosion);
            timedBigEyesExplosion = null
        }
    }

    function marsMechaExplosion(posX, posY) { //EXPLOSION FOR THE MARSMECHA
        sound.explosionBig.play();

        $("#gameBackground").append("<div id='marsMechaExplosion' class='animaMarsMechaExplosion'></div>");
        $("#marsMechaExplosion").css("background", "url(../imgs/marsMechaExplosion.png)");
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
        sound.lostPow.play();

        $("#gameBackground").append("<div id='powDeath' class='animaPowDeath'></div>");
        $("#powDeath").css("background", "url(../imgs/powDeath.png)");
        $("#powDeath").css("left", posX);
        $("#powDeath").css("top", posY);

        var timedPowDeath = window.setInterval(removePowDeath, 900);

        function removePowDeath() {
            $("#powDeath").remove();

            window.clearInterval(timedPowDeath);
            timedPowDeath = null;
        }
    }

    /* --- SPAWNS && RESPAWNS --- */
    function spawnBigEyes() {
        var timedBigEyes = window.setInterval(spawn, 1000);

        function spawn() {
           window.clearInterval(timedBigEyes);
           timedBigEyes = null;

            if (score.player >= 3000) {
                if (isBigEyes === false) {
                    $("#gameBackground").append("<div id='bigEyes' class='animaBigEyes'></div>");
                    $("#bigEyes").css("left", 860);
                    $("#bigEyes").css("top", posY_bigEyes);

                    isBigEyes = true;
                }
            }
        }
    }

    function respawnFlyingTara() { //RESPAWN FOR THE PLAYER AVATAR
        var timedRespawnFlyingTara = window.setInterval(respawn, 1500);

        function respawn() {
            window.clearInterval(timedRespawnFlyingTara);
            timedRespawnFlyingTara = null;

            if (gameOver === false) {
                $("#gameBackground").append("<div id='flyingTara'></div>");
            }
        }
    }

    function respawnMiniUfo() { //RESPAWN FOR THE MINIUFO
        var timedRespawnMiniUfo = window.setInterval(respawn, 500);

        function respawn() {
            window.clearInterval(timedRespawnMiniUfo);
            timedRespawnMiniUfo = null;

            if (gameOver === false) {
                posY_miniUfo = parseInt(Math.floor(Math.random() * (380 - 80 + 1)) + 80);

                $("#gameBackground").append("<div id='miniUfo' class='animaMiniUfo'></div>");
                $("#miniUfo").css("left", 860);
                $("#miniUfo").css("top", posY_miniUfo);
            }
        }
    }

    function respawnBigEyes() {
        var timedRespawnBigEyes = window.setInterval(respawn, 1000);

        function respawn() {
            window.clearInterval(timedRespawnBigEyes);
            timedRespawnBigEyes = null;

            if (gameOver === false) {
                posY_bigEyes = parseInt(Math.floor(Math.random() * (400 - 90 + 1)) + 90);

                $("#gameBackground").append("<div id='bigEyes' class='animaBigEyes'></div>");
                $("#bigEyes").css("left", 860);
                $("#bigEyes").css("top", posY_bigEyes);
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
        $("#playerScore").html("<p> Score </p>" +"<p>" +score.player +"</p>");
        $("#savedPow").html("<p> Saved </p>" +"<p>" +score.savedPow +"</p>");
        $("#lostPow").html("<p> Lost </p>" +"<p>" +score.lostPow +"</p>");
        $("#bestScore").html("<p> Best </p>" +"<p>" +bestScore +"</p>");
    }

    /* --- PLAYER ENERGY VERIFICATION --- */
    function energyUpdate() {
        if (playerEnergy === 3) {
            $("#energyBar").css("background", "url(../imgs/EnergyBar3.png)");
        }

        if (playerEnergy === 2) {
            $("#energyBar").css("background", "url(../imgs/EnergyBar2.png)");
        }

        if (playerEnergy === 1) {
            $("#energyBar").css("background", "url(../imgs/EnergyBar1.png)");
        }

        if (playerEnergy === 0) {
            $("#energyBar").css("background", "url(../imgs/EnergyBar0.png)");

            if (score.player > bestScore) {
                bestScore = score.player;
            }

            endGame();
        }
    }

    /* --- END GAME --- */
    function endGame() {
        gameOver = true;
        sound.stage.pause();
        sound.gameOver.play();

        window.clearInterval(game.timer);
        game.timer = null;

        $("#flyingTara").remove();
        $("#miniUfo").remove();
        $("#bigEyes").remove();
        $("#marsMecha").remove();
        $("#prisionerOfWar").remove();

        $("#gameBackground").append("<div id='endScreen'></div>");
        $("#endScreen").html("<h1> Game Over </h1>" + "<div id='restartButton' onClick='restartGame()'> RESTART GAME </div>");
    }

}

/* --- RESTART GAME --- */
function restartGame() {
    $("#endScreen").remove();
    $("#energyBar").remove();
    $("#interface").remove();
    $("#savedPow").remove();
    $("#lostPow").remove();
    $("#playerScore").remove();
    $("#bestScore").remove();
    
    start();
}