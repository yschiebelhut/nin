angular.module('nin').directive('keybinding', function(commands) {

  var keybindings = {
    '32': function(e) {
      // 'space'
      commands.playPause();
      e.preventDefault();
    },
    '46': function() {
      // '.'
      commands.jog(60);
    },
    '44': function() {
      // ','
      commands.jog(-60);
    },
    '106': function() {
      // j
      commands.toggleMusic();
    },
    '75': function() {
      // K
      commands.jog(-60 * 10);
    },
    '76': function() {
      // L
      commands.jog(60 * 10);
    },
    '109': function() {
      // 'm'
      commands.toggleFullscreen();
    },
    '13': function(e) {
      // 'return'
      commands.jumpToFrame(0);
    },
    '62': function() {
      // '>'
      commands.jog(1);
    },
    '60': function() {
      // '<'
      commands.jog(-1);
    },
    '58': function() {
      // '>'
      commands.jog(1);
    },
    '59': function() {
      // '<'
      commands.jog(-1);
    },
    '112': function(e) {
      // 'p'
      commands.getCameraPosition();
    },
    '108': function(e) {
      // 'l'
      commands.getCameraLookat();
    },
    '120': function(e) {
      // 'x'
      commands.resetFlyFlightDynamics();
    },
    '99': function(e) {
      // 'c'
      commands.toggleFlyAroundMode();
    },
    '122': function() {
      // 'z'
      commands.decreaseCameraZoom();
    },
    '90': function() {
      // 'Z'
      commands.increaseCameraZoom();
    },
    '103': function(e) {
      // 'g'
      commands.setCuePoint();
    }
  };

  return {
    type: 'A',
    link: function() {
      document.addEventListener('keypress', function(event) {
        keybindings[event.which] && keybindings[event.which](event);
      });
    }
  };
});