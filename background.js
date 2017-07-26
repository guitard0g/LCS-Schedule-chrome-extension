//background.js
var addNotification = function(date, time, team1, team2){
  console.log(moment(date + ':' + time, 'YYYY-MM-DD:HHmm').valueOf());
  console.log(Date.now() + 300000);
  chrome.alarms.create("test alarm", {
      when: moment(date + ':' + time, 'YYYY-MM-DD:HHmm').valueOf()
  });
  chrome.alarms.onAlarm.addListener(function(){
    var options = {
      type: "basic",
      title: "LCS Game Starting!",
      message: team1 + ' vs. ' + team2 + ' is starting now!',
      iconUrl: "../icon.png",
      eventTime: Date.now() + 50
    };
    chrome.notifications.create('1', options, function(){console.log('clicked')});

  });
};


var curr = moment().add(1, 'minutes');
addNotification(curr.format('YYYY-MM-DD'), curr.format('HHmm'), 'TSM', 'CLG');
