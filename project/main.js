import { Game } from './game.js';

let game;

let gameSize = document.querySelector('#sizeMap');

gameSize.addEventListener('change', function () {
    window.location.href = `?size=${gameSize.value}`;
});

function init() {

    game = (new Game(window.innerWidth, window.innerHeight, gameSize.value))
    game.addScene();

    document.addEventListener('keydown', function (event) {
        if (event.key === 'z') {
            if (game.isStarted) {
                game.movePlayer('forward');
            } else {
                document.querySelector('.home').style.display = 'none !important';
                game.start();
                document.querySelector('canvas').style.zIndex = 1;
            }
        } else if (event.key === 's') {
            game.movePlayer('backward');
        } else if (event.key === 'd') {
            game.movePlayer('leftward');
        } else if (event.key === 'q') {
            game.movePlayer('rightward');
        }
    });

    document.addEventListener('keyup', function (event) {
        if (event.key === 'z') {
            game.stopPlayer('forward');
        } else if (event.key === 's') {
            game.stopPlayer('backward');
        } else if (event.key === 'd') {
            game.stopPlayer('leftward');
        } else if (event.key === 'q') {
            game.stopPlayer('rightward');
        }
    });
}

init();



window.addEventListener('resize', () => {
    game.resizeWindow();
})

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        window.location.reload();
    }
});