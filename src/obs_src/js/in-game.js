
const socket = io('http://localhost:3005/');

class InGameHUD {
  constructor() {
    this.name = 'In-Game HUD';
  }

  ID() {
    return {
      name: this.name,
    }
  }

  // changes up the state n stuff
  updateState(state) {
    $('#blue-team-name').text(state.blueTeam.name);
    $('#red-team-name').text(state.redTeam.name);
    $('.team-score.blue').text(isNaN(state.blueTeam.score) ? 0 : state.blueTeam.score);
    $('.team-score.red').text(isNaN(state.redTeam.score) ? 0 : state.redTeam.score);

    if (state.match.textOverride && state.match.textOverride !== '') {
      $('#best-of').hide();
      $('.match-tile').hide();
      $('#best-of-override').text(state.match.textOverride);
      $('.best-of-text').show();
    }
    else {
      $('#best-of').show();
      $('.match-tile').show();
      $('.best-of-text').hide();

      if (state.match.bestOf !== 'none') {
        $('#best-of').text(`Bo${state.match.bestOf}`);
      }
      else {
        $('#best-of').text('');
      }
    }

    $('.match-tile').removeClass().addClass('match-tile');

    for (let i = 0; i < state.match.games.length; i++) {
      if (state.match.games[i].map in Maps) {
        $(`#match-${i + 1}-tile`).addClass(Maps[state.match.games[i].map].classname);
      }
    }

    this.setLogo('#blue-team-logo', state.blueTeam.logo);
    this.setLogo('#red-team-logo', state.redTeam.logo);
  }

  setLogo(id, path) {
    setCSSImage(id, path);
  }
}

$(document).ready(() => {
  // just kinda runs on page load huh
  const inGameHUD = new InGameHUD();

  socket.on('requestID', () => { 
    socket.emit('reportID', inGameHUD.ID());
    socket.emit('requestState');
  });

  socket.on('update', (state) => { inGameHUD.updateState.call(inGameHUD, state); });
  socket.on('changeTheme', (themeDir) => { changeTheme(themeDir, 'in-game.css'); });
});