// content.js

var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var getCurrentTime = function(){
	return {
      year: moment().format('YYYY'),
      month: moment().format('MM'),
      day: moment().format('D'),
      hour: moment().format('HH'),
      minute: moment().format('mm'),
			dayOfWeek: moment().day()
  };
};

var NaHandler = function(currentTime){

};
