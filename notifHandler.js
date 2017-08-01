//notifHandler.js
var addNotification = function(date, time, team1, team2){
  chrome.alarms.create(date + ':' + team1 + ':' + team2, {
    when: moment(date + ':' + time, 'YYYY-MM-DD:HHmm').valueOf()
  });
};
var notify = function(){
  var curr = moment().add(1, 'minutes');
  var time = moment(this.date + this.time, 'YYYY-MM-DDh:mm A');
  addNotification(time.format('YYYY-MM-DD'), time.format('HHmm'), this.team1, this.team2);
  var options = {
    type: "basic",
    title: "LCS Schedule",
    message: 'Notification added successfully.',
    iconUrl: "../icon.png",
    eventTime: Date.now() + 50
  };
  chrome.notifications.create('lcsnotifadded', options, function(){});
}

chrome.alarms.onAlarm.addListener(function(alarm){
  var tokens = alarm.name.split(':');
  var alarmMessage = tokens[1] + ' vs. ' + tokens[2] + ' is starting!';
  var options = {
    type: "basic",
    title: "LCS Game Starting!",
    message: alarmMessage,
    iconUrl: "../icon.png",
    eventTime: Date.now() + 50
  };
  chrome.notifications.create('lcsnotif', options, function(){});
});

// COME BACK FOR ADDING LINKS TO NOTIFS, BUT RECALL IT ACTIVATES TWO NEW TABS FOR SOME REASON
// chrome.notifications.onClicked.addListener(function(notifId){
//   if (notifId === 'lcsnotif') {
//     alert('test');
//     window.open('https://www.twitch.tv');
//     event.preventDefault();
//   }
// });
