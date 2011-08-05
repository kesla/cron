//
// hook.io-cron hook - adds and removes jobs that emit Hook events on customizable time intervals 
//
var Hook = require('hook.io').Hook,
    http = require('http'),
    util = require('util');

var CronHook = exports.CronHook = function(options){


  var self = this;

  Hook.call(self, options);

  self.config.use('file', { file: './config.json'});

  self.on('*::addJob', function(data){
    self.addJob(data);
  });

  self.on('hook::ready', function(){
    self._start();
  });

};

// CronHook inherits from Hook
util.inherits(CronHook, Hook);

CronHook.prototype._start = function(){
  this._poll();
};


CronHook.prototype.addJob = function(job){

  var self = this;

  var jobs = self.config.get('jobs') || [];
  job.name = job.name || 'default job name';
  self._initializeJob(job, Date.now());
  jobs.push(job);
  self.config.set('jobs', jobs);
  self.config.save();
  
};

CronHook.prototype.removeJob = function(options, hook){
  
};

CronHook.prototype._poll = function(){

  var self = this;

  var jobs = self.config.get('jobs');

  // Date.now() is slow, so initialize it once for all jobs.
  var now = Date.now();

  //
  // Iterate through all jobs and initialize 
  //
  jobs.forEach(function(job) {
    self._initializeJob(job, now);
  });

  self.log(self.name, 'firing poll interval');

  //
  // We use Date.now() and process.nextTick instead of setInterval as it gives
  // better precision.
  //
  function next() {
    //
    // Iterate through all your jobs and execute the once whos time it is
    //
    jobs.forEach(function(job) {
      var now = Date.now();
      if(now > job.nextStop) {
        job.nextStop += job.interval;
        self.emit(job.event, job.data);
      }
    });
    process.nextTick(next);
  }
  next();
};

CronHook.prototype._initializeJob = function(job, now){
  var every = job.every.split(" ");
  var val, unit;
  if (every.length == 1){
    val = 1;
    unit = every[0];
  } else {
    val = parseInt(every[0]);
    unit = every[1];
  }
  
  // job.interval is the interval (in ms) when each job is executed.
  switch(unit) {
    case "seconds":
    case "second":
      job.interval = val * 1000;
      break;
    case "minutes":
    case "minute":
      job.interval = val * 60 * 1000;
      break;
    case "hours":
    case "hour":
      job.interval = val * 60 * 60 * 1000;
      break;
    case "days":
    case "day":
      job.interval = val * 24 * 60 * 60 * 1000;
      break;
    case "weeks":
    case "week":
      job.interval = val * 7 * 24 * 60 * 60 * 1000;
    default:
      // TODO: Error handling?
  }
  this.log(this.name, 'event ' + job.event + ' initialized to be executed each ' + val + " " + unit + "("+job.interval+"ms)");    
  // job.nextStop is the next time the job will be executed.
  job.nextStop = now + job.interval;
}
