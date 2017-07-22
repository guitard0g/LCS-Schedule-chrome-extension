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
    var newRow = '<tr class="game' + i + '"></tr>'
    $('#game-table').append(newRow);
    $('.game' + i).html(template(games[i]));
  }
  // $('#test-content').html(template(context));
};

var nextGame = function(){
  db.getNextGameday('NA').then(function(snapshot){
    var context = parseGame(snapshot.val().matches);
    render(context, snapshot.key);
    console.log('next day: ' + snapshot.key);
    db.setMoment(snapshot.key);
  });
}

var previousGame = function() {
  console.log('PREVIOUS GAME')
  db.getPreviousGameday('NA').then(function(snapshot){
    var context = parseGame(snapshot.val().matches);
    render(context, snapshot.key);
    console.log('previous day: ' + snapshot.key);
    db.setMoment(snapshot.key);
  });
}

var addListeners = function(){
  document.getElementById('next_game').addEventListener('click', nextGame);
  document.getElementById('previous_game').addEventListener('click', previousGame);
};

var getFirstGame = function(db){
  db.getNextGameday('NA').then(function(snapshot){
    var context = parseGame(snapshot.val().matches);
    render(context);
    db.setMoment(snapshot.key);
    addListeners();
  });
};


// document.addEventListener('DOMContentLoaded', function () {

db = new Database();
  // console.log(getNextGames('NA', moment(), db));
  // getAllGames('NA', db);
db.getTodaysGameday('NA').then(function(snapshot){
  var context = parseGame(snapshot.val().matches);
  render(context, snapshot.key);
  db.setMoment(snapshot.key);
  addListeners();
});
  // var initialContext = parseGame(getTodaysGames('NA', moment(), db));
  // render(initialContext);
  // console.log(moment().format('MMMM Do YYYY, h:mm:ss a'));
	// console.log( getCurrentTime().dayOfWeek );
  // var context = {
  //   title: "lul will this actually work"
  // };
  // var source   = $("#header-template").html();
  // var template = Handlebars.compile(source);
  //
  // $('#test-content').html(template(context));

// });
