import { Game } from './game.js';

const game = (new Game(window.innerWidth, window.innerHeight));
game.addScene();


document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        game.start();
    }
});

window.addEventListener('resize', () => {
    game.resizeWindow();
})