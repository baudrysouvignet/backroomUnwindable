import { Game } from './game.js';

const game = (new Game(window.innerWidth, window.innerHeight));
game.addScene();

game.start();
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        game.start();
    }
});

window.addEventListener('resize', () => {
    game.resizeWindow();
})