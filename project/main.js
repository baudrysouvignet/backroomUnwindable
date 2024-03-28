import { Game } from './game.js';

let game;

function init() {
    game = (new Game(window.innerWidth, window.innerHeight))
    game.addScene();

    document.addEventListener('keydown', function (event) {
        if (event.key === 'z') {
            document.querySelector('.home').style.display = 'none !important';
            game.movePlayer('forward');
            game.start();
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