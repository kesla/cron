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

  self.INTERVAL = 2000;

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
  jobs.push(job);
  self.config.set('jobs', jobs);
  self.config.save();
  
};

CronHook.prototype.removeJob = function(options, hook){
  
};

CronHook.prototype._poll = function(){

  var self = this, start = Date.now();
  self.log(self.name, 'firing poll interval');
  
  //
  // We use Date.now() and process.nextTick instead of setInterval as it gives
  // better precision.
  //
  function next() {
    if(Date.now() - start > self.INTERVAL) {
      start = Date.now();
      self._checkJobs();
      process.nextTick(next);
    } else {
      process.nextTick(next);
    }
  }
  next();
};

CronHook.prototype._checkJobs = function(){

  var self = this;
  var jobs = self.config.get('jobs');

  //
  // Iterate through all your jobs and execute them
  //

  //
  // TODO: implement more complex cron logic, instead of just firing them on every interval
  //
  if(jobs){
    jobs.forEach(function(job){
      self.emit(job.event, job.data);
    });
  }

};
