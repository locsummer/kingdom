// Kingdom Rush Application Entrypoint

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const engine = new GameEngine(canvas);
  const ui = new UIManager();
  
  ui.setEngine(engine);
  window.gameEngine = engine;
  window.uiManager = ui;

  // Start continuous engine loop
  engine.startLoop();

  // Show Main Menu by default
  ui.showTitleScreen();

  // Audio unlock on first user gesture
  const unlockAudio = () => {
    window.soundEngine.init();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio);
  window.addEventListener('touchstart', unlockAudio);
});
