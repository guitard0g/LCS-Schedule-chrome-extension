
function Database(){
  var config = {
    apiKey: "AIzaSyA1UzOxSBnrWcRAZbz542O3UTr_E5dT5kQ",
    authDomain: "lcs-schedule-extension.firebaseapp.com",
    databaseURL: "https://lcs-schedule-extension.firebaseio.com",
    projectId: "lcs-schedule-extension",
    storageBucket: "",
    messagingSenderId: "68674409085"
  };
  firebase.initializeApp(config);
  // connection to the firebase
  this.dbConnection = firebase.database()

  this.moment = moment();

	this.region = 'NA';

	this.setRegion = function(reg){
		this.region = reg;
	}

	this.getRegion = function(){
		return this.region;
	}

  this.setMoment = function(newTime){
    this.moment = moment(newTime, 'YYYY-MM-DD');
  }

  // function to get todays gameday or the next gameday relative to a moment
  // returns a Promise
  this.getTodaysGameday = function(){
    var date = this.moment.format('YYYY-MM-DD');
		// console.log(date);
    var ref = this.dbConnection.ref('/' + this.region + '/matches');
    return ref.orderByKey().startAt(date).limitToFirst(1).once('child_added');
  };

  // function to get the next gameday relative to a moment
  // returns a Promise
  this.getNextGameday = function(){

		// a little hack to make a copy of our moment and add 1 day
		var date = moment(this.moment.format('YYYY-MM-DD'), 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');


		// console.log(date);
    var ref = this.dbConnection.ref('/' + this.region + '/matches');
    return ref.orderByKey().startAt(date).limitToFirst(1).once('child_added');
  };

  // function to get the previous gameday relative to a moment
  // returns a Promise
  this.getPreviousGameday = function(){
		var date = moment(this.moment.format('YYYY-MM-DD'), 'YYYY-MM-DD').subtract(1, 'days').format('YYYY-MM-DD');
		// console.log(date);
    var ref = this.dbConnection.ref('/' + this.region + '/matches');
    return ref.orderByKey().endAt(date).limitToLast(1).once('child_added');
  };
}
