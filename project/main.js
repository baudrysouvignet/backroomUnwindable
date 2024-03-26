import { Game } from './game.js';

const game = (new Game(window.innerWidth, window.innerHeight));
game.addScene();

game.start();