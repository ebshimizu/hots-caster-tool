// this file manages callbacks required for the team data entry page
const { dialog } = require('electron').remote;
const path = require('path');
const fs = require('fs-extra');
const { heroMenu } = require('./util');
let appState;

function registerDragHandle(elem, fileHandler) {
  $(elem).on('dragenter', function(event) {
    event.preventDefault();
    event.stopPropagation();
  });
  $(elem).on('dragleave', function(event) {
    event.preventDefault();
    event.stopPropagation();
  });
  $(elem).on('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();
    fileHandler(elem, event.originalEvent.dataTransfer.files);
  });
}

// assumes this was called on an input element
function dropTeamLogo(elem, files) {
  let rootFolder = path.join(__dirname, '../obs_src');

  if (!fs.existsSync(rootFolder)) {
    rootFolder = path.join(process.resourcesPath, 'app', 'src', 'obs_src');
  }

  // needs relative path from the files. they're all here.
  $(elem).val(path.relative(rootFolder, files[0].path));
}

function initTeamData() {
  $('#team-data .find-logo .browse.button').click(findTeamLogo);

  // this might want to move? it's technically not tema data but uses the same functions
  $('#event-logo .browse.button').click(findTeamLogo);

  $('#team-data .find-logo .clear-field.button').click(clearField);
  $('#popup-display-mode').dropdown();
  $('.player-entry').dropdown({
    allowAdditions: true,
    onChange: function(value, text, $choice) {
      if ($choice) {
        const id = $choice.parents('.player-entry').attr('id');
        $(`input[name="${id}"]`).val(value);
      }
    },
  });

  for (const i of [1, 2, 3, 4, 5]) {
    $(`#blue-p${i}-hero`).html(heroMenu(heroesTalents, 'player-hero-menu'));
    $(`#red-p${i}-hero`).html(heroMenu(heroesTalents, 'player-hero-menu'));
  }

  $('#team-names-clear').click(() => {
    for (const i of [1, 2, 3, 4, 5]) {
      $(`input[name="blue-p${i}-name"]`).val('');
      $(`input[name="red-p${i}-name"]`).val('');
    } 

    $('.player-hero-menu').dropdown('clear');
  });

  $('#team-data .player-hero-menu').dropdown({
    fullTextSearch: true,
  });
  registerDragHandle('#team-red-logo input', dropTeamLogo);
  registerDragHandle('#team-blue-logo input', dropTeamLogo);
  registerDragHandle('#event-logo input', dropTeamLogo);
}

function initWithState(state) {
  appState = state;

  $('#team-data-swap').click(() => state.swapTeamData());
  $('#team-data-clear').click(() => state.resetTeamData());
  $('#player-popup-show').click(() => {
    showMessage('Running Player Name Popups', 'positive');
    state.updateAndBroadcast();
    state.sendAll('runPopups', {});
  });
  $('#player-pool').focusout(updatePlayerPoolMenus);
  updatePlayerPoolMenus();
}

// this context: clicked element
function findTeamLogo() {
  let input = $(this).parent().siblings('input');

  dialog.showOpenDialog({
    title: 'Locate Image',
    filters: [
      {name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg' ]}
    ],
    properties: ['openFile'],
  }, function(files) {
    if (files) {
      let rootFolder = path.join(__dirname, '../obs_src');

      if (!fs.existsSync(rootFolder)) {
        rootFolder = path.join(process.resourcesPath, 'app', 'src', 'obs_src');
      }

      // needs relative path from the files. they're all here.
      input.val(path.relative(rootFolder, files[0]));
    }
  });
}

function clearField() {
  $(this).parent().siblings('input').val('');
}

function updatePlayerPoolMenus() {
  const pool = $('#player-pool').val();

  if (pool) {
    const values = [];
    const names = pool.split('\n');
    for (let n of names) {
      if (n !== '') {
        values.push({
          value: n,
          text: n,
          name: n,
        });
      }
    }

    $('.player-entry').dropdown('change values', values);
    $('.pp-player-name').dropdown('change values', values);
  }
  else {
    $('.player-entry').dropdown('change values', []);
    $('.pp-player-name').dropdown('change values', []);
  }
}

exports.Init = initTeamData;
exports.InitWithState = initWithState;
exports.updatePlayerPoolMenus = updatePlayerPoolMenus;