const Maps = require('../data/maps');

let syncMatchScore = false;

// looks at the current visible match elements and computes a score
function syncScoreFromMatchData() {
  const elems = $('.game-data');
  let blueScore = 0;
  let redScore = 0;

  for (let i = 0; i < elems.length; i++) {
    const win = $(elems[i])
      .find('.team-winner-menu')
      .dropdown('get value');
    if (win === 'red') {
      redScore += 1;
    }
    else if (win === 'blue') {
      blueScore += 1;
    }
  }

  $('#team-blue-score').val(blueScore);
  $('#team-red-score').val(redScore);
}

function trySyncMatchScore() {
  if (syncMatchScore === true) {
    syncScoreFromMatchData();
  }
}

function populateMapDropdown(elem, useNone, labels = false) {
  // get map list
  const menus = $(elem).find('.menu');
  const keys = Object.keys(Maps.Maps);

  if (useNone === true) {
    // none option (with left beef)
    menus.append('<div class="item" data-value="0">No Map</div>');
  }

  for (const map of keys) {
    menus.append(`<div class="item" data-value="${map}">${Maps.Maps[map].name}</div>`);
  }

  // init the dropdown as well, none of these require callbacks since it's all snapshot on Update
  $(elem).dropdown({
    fullTextSearch: true,
    useLabels: labels,
  });
}

function populateMapPoolPresetDropdown(elem) {
  const menu = $(elem).find('.menu');

  const keys = Object.keys(Maps.MapPools);
  for (const pool of keys) {
    menu.append(`<div class="item" data-value="${pool}">${Maps.MapPools[pool].name}</div>`);
  }

  $(elem).dropdown({
    action: 'hide',
    onChange: setMapPool,
  });
}

function setMapPool(value, text, $choice) {
  if (value in Maps.MapPools) {
    $('#map-pool').dropdown('set exactly', Maps.MapPools[value].maps);
  }
}

// deletes the ui elements for entering data for individual games
function deleteGameData() {
  $('.game-data').remove();
}

function addGameData(gameNumber) {
  const elem = `
    <div class="ui segment game-data" game-number="${gameNumber}">
      <h3 class="ui dividing header">Game ${gameNumber}</h3>
      <form class="ui form">
        <div class="fields">
          <div class="ten wide field">
            <label>Map</label>
            <div class="ui fluid search selection dropdown map-menu">
              <i class="dropdown icon"></i>
              <div class="default text">No Map</div>
              <div class="menu">
              </div>
            </div>
          </div>
          <div class="three wide field">
            <label>Picked By</label>
            <div class="ui fluid selection dropdown team-pick-menu">
              <i class="dropdown icon"></i>
              <span class="default text">None</span>
              <div class="menu">
                <div class="item" data-value="none">None</div>
                <div class="item" data-value="blue"><div class="ui blue empty circular label"></div>Blue</div>
                <div class="item" data-value="red"><div class="ui red empty circular label"></div>Red</div>
              </div>
            </div>
          </div>
          <div class="three wide field">
            <label>Winner</label>
            <div class="ui fluid selection dropdown team-winner-menu">
              <i class="dropdown icon"></i>
              <span class="default text">None</span>
              <div class="menu">
                <div class="item" data-value="none">None</div>
                <div class="item" data-value="blue"><div class="ui blue empty circular label"></div>Blue</div>
                <div class="item" data-value="red"><div class="ui red empty circular label"></div>Red</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  `;

  $('#map-data').append(elem);
  $(`.game-data[game-number="${gameNumber}"] .team-pick-menu`).dropdown();
  $(`.game-data[game-number="${gameNumber}"] .team-winner-menu`).dropdown();
  populateMapDropdown(`.game-data[game-number="${gameNumber}"] .map-menu`, true);
}

function populateMapDropdowns() {
  populateMapDropdown('.map-menu', false, true);
  populateMapDropdown('.multi-map-menu', false);
}

function initMapData() {
  populateMapDropdowns();
  populateMapPoolPresetDropdown('#map-pool-presets');

  $('#match-score-data-sync').checkbox({
    onChecked: () => {
      syncMatchScore = true;
      trySyncMatchScore();
    },
    onUnchecked: () => {
      syncMatchScore = false;
    },
  });
}

function initWithState(appState) {
  $('#best-of').dropdown({
    onChange: (value) => {
      appState.displayGameData.call(appState, parseInt(value));
    },
  });

  $('#match-data-clear').click(() => appState.resetMatchData());
  $('#match-swap-button').click(() => appState.swapMatchData());
}

exports.Init = initMapData;
exports.InitWithState = initWithState;
exports.addGameData = addGameData;
exports.deleteGameData = deleteGameData;
exports.trySyncMatchScore = trySyncMatchScore;
