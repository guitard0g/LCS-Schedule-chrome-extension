// main controller

var convertTime = function(time){
  return moment(time, 'HHmm').format('h:mm A');
};

var nonEmpty = function(item){
  return item !== '';
}

var processGame = function(game){
    var values = game.split('-');
    return {
      team1: values[0].toUpperCase(),
      team2: values[1].toUpperCase(),
      time: convertTime(values[2]),
      victor: values[3],
      hasVictor: values[3] !== 'na'
    };
};

var timeComparison = function(a, b) {
    return parseInt(a.time) > parseInt(b.time);
};

var parseGame = function(game){
    var games = game.split(';');
    return games.filter(nonEmpty).map(processGame).sort(timeComparison);
};


var render = function(games, todays_date){
  var date_source = $("#current-date-template").html();
  var date_template = Handlebars.compile(date_source);
  var todays_moment = moment(todays_date, 'YYYY-MM-DD');
  $('#todays-date').innerHTML = "";
  $('#todays-date').style = "";
  $('#todays-date').html(date_template(
    {
      day: todays_moment.format('dddd'),
      date: todays_moment.format('MMMM Do'),
    }
  ));

  document.getElementById('game-table').innerHTML = "";
  var source   = $("#game-table-template").html();
  var template = Handlebars.compile(source);
  for (var i = 0; i < games.length; i++) {
    var newRow = '<tr class="game' + i + ' game-row"></tr>'
    var newRowButtons = '<tr class="game-subinfo"><td><button class="btn btn-xs notify-me-btn" id="game' + i + '-notif">Notify me</button></td></tr>';
    $('#game-table').append(newRow);
    $('#game-table').append(newRowButtons);
    $('.game' + i).html(template(games[i]));
    $('.game' + i).css('height', 65);
    document.getElementById('game' + i + '-notif').addEventListener('click', notify.bind(
      {
        team1: games[i].team1,
        team2: games[i].team2,
        date: todays_date,
        time: games[i].time
      }
    ));
  }
  document.body.style.height = '0px';
  document.body.style.minHeight = '0px';
  document.documentElement.style.height = '0px';
  document.documentElement.style.minHeight = '0px';
};

var nextGame = function(){
  db.getNextGameday().then(function(snapshot){
    var context = parseGame(snapshot.val().matches);
    render(context, snapshot.key);
    db.setMoment(snapshot.key);
  });
}

var previousGame = function() {
  db.getPreviousGameday().then(function(snapshot){
    var context = parseGame(snapshot.val().matches);
    render(context, snapshot.key);
    db.setMoment(snapshot.key);
  });
}

// This is an intermediary method, its used to call the databases setRegion method
// this is because we cant use bind on the databases method or else we get a big
// issue with contexts, this could be solved in ES6 with arrow functions.... but
// I don't want to use browserify
var callSetRegion = function(){
  db.setRegion(this.newRegion);
  // re render the view
  db.setMoment(moment().format('YYYY-MM-DD'));
  db.getTodaysGameday().then(function(snapshot){
    var context = parseGame(snapshot.val().matches);
    render(context, snapshot.key);
    console.log(db.getRegion());
  }, function(){
    console.log('rejected');
  });
};

var addListeners = function(){
  document.getElementById('next_game').addEventListener('click', nextGame);
  document.getElementById('previous_game').addEventListener('click', previousGame);
  document.getElementById('select_na').addEventListener('click', callSetRegion.bind({ newRegion: 'NA' }));
  document.getElementById('select_eu').addEventListener('click', callSetRegion.bind({ newRegion: 'EU' }));
};


Handlebars.registerHelper("checkIfWon", function(team, victor) {
  team = team.toString().toLowerCase();
  victor = victor.toString().toLowerCase();
  if (team === victor) {
      return new Handlebars.SafeString("<span style='color:gold;' class='victor-text'>WIN</span>");
  }
  else {
      return new Handlebars.SafeString("<span style='color:red;' class='victor-text'>LOSS</span>");
  }
});

// -------------------------------- APP STATE INITIALIZATON --------------------------------
db.getPreviousGameday().then(function(snapshot){
  var context = parseGame(snapshot.val().matches);
  render(context, snapshot.key);
  db.setMoment(snapshot.key);
  addListeners();
}, function(){
  console.log('rejected');
});
