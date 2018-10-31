let appState;

function heroesLoungeGetTeamFull(type) {
  let matchId = $('#heroes-lounge-id').val();

  // series of asyncs
  $.get(`http://heroeslounge.gg/api/v1/matches/${matchId}/teams`, '', function(teams) {
    // ok now the other teams
    if (teams.length === 2) {
      $('#team-blue-name').val(teams[0][type]);
      $('#team-red-name').val(teams[1][type]);
      showMessage(`Heroes Lounge Grabber: Loaded ${matchId}. Blue: ${teams[0][type]}, Red: ${teams[1][type]}.`, 'positive');

      $.get(`http://heroeslounge.gg/api/v1/teams/${teams[0].id}/logo`, '', function(logo1) {
        if (logo1.path) {
          $('#team-blue-logo input').val(logo1.path);
          showMessage(`Heroes Lounge Grabber: Loaded ${teams[0][type]}'s logo.`, 'positive');
        }
        else {
          showMessage(`Heroes Lounge Grabber: Failed to load ${teams[0][type]}'s logo`, 'negative');
        }
      });
      $.get(`http://heroeslounge.gg/api/v1/teams/${teams[1].id}/logo`, '', function(logo2) {
        if (logo2.path) {
          $('#team-red-logo input').val(logo2.path);
          showMessage(`Heroes Lounge Grabber: Loaded ${teams[1][type]}'s logo.`, 'positive');
        }
        else {
          showMessage(`Heroes Lounge Grabber: Failed to load ${teams[1][type]}'s logo`, 'negative');
        }
      });
    }
    else {
      showMessage(`Heroes Lounge Grabber: Failed to get data for ${matchId}.`, 'negative')
    }
  });
}

function updateInfo(key) {
  if (key === 'none') {
    $('#data-grabber-info').html(`
      <div class="content">
        <p>
          Data Grabbers will help automatically populate some of your team and match data from
          the given source. You may need to configure your source once selected.
        </p>
      </div>
    `);
  }
  else if (key === 'heroes-lounge') {
    $('#data-grabber-info').html(`
    <div class="header">Heroes Lounge</div
    <div class="content">
      Grabs data from the Heroes Lounge website. You can grab full team names or slugs.
    </div>
  `);
  }
}

function changeDataGrabber(val) {
  $('.data-grab-option').hide();
  
  $(`.data-grab-option[data-source="${val}"]`).show();

  updateInfo(val);

  appState.updateDataSource();
  appState.save();
}

function initDataFetch(state) {
  $('#heroes-lounge-get').click(() => heroesLoungeGetTeamFull('title'));
  $('#heroes-lounge-get-slug').click(() => heroesLoungeGetTeamFull('slug'));

  appState = state;
  $('.data-grab-option').hide();

  $('#data-grabber-menu').dropdown({
    onChange: changeDataGrabber,
  });
  $('#data-grabber-menu').dropdown('set exactly', appState.dataSource.dataGrabber);
}


exports.InitWithState = initDataFetch;