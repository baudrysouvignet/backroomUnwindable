<?php

$mapSize = isset($_GET['size']) ? $_GET['size'] : 101; ?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unwindable</title>

    <script src="https://cdn.jsdelivr.net/gh/kripken/ammo.js@HEAD/builds/ammo.wasm.js"></script>
    <script type="module" src="./project/player.js" defer></script>
    <script type="module" src="./project/main.js" defer></script>

    <link rel="stylesheet" href="assets/style/home.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
        }

        .die,
        .dieMonster,
        .finish {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 3;
            display: none;
        }

        canvas {
            z-index: -1;
            position: absolute;
            top: 0;
            left: 0;
        }
    </style>
</head>

<body>
    <section class="home die">
        <img src="assets/img/mort.svg" alt="Logo" srcset="">
        <span>Generer les backroom <img src="assets/img/esc.png" alt="Entrer pour joeur" srcset=""></span>
    </section>
    <section class="home finish">
        <img src="assets/img/victoire.svg" alt="Logo" srcset="">
        <span id="timeGame"></span>
        <span>Rejouer <img src="assets/img/esc.png" alt="Entrer pour joeur" srcset=""></span>
    </section>
    <section class="home dieMonster">
        <img src="assets/img/deadMonster.svg" alt="Logo" srcset="">
        <span>Rejouer <img src="assets/img/esc.png" alt="Entrer pour joeur" srcset=""></span>
    </section>
    <section class="home homePage">
        <img src="assets/img/logo.svg" alt="Logo" srcset="">
        <select name="size" id="sizeMap">
            <option value="101" <?= $mapSize == 101 ? "selected" : "" ?>>Dificile</option>
            <option value="76" <?= $mapSize == 76 ? "selected" : "" ?>>Facile</option>
            <option value="10" <?= $mapSize == 10 ? "selected" : "" ?>>Ultra Facile</option>
        </select>
        <span>Jouer <img src="assets/img/enter.svg" alt="Entrer pour joeur" srcset=""></span>
    </section>
</body>

</html>