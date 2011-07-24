//
// hook.io-cron hook - adds and removes jobs that emit Hook events on customizable time intervals 
//

var Hook = require('hook.io').Hook,
    http = require('http'),
    util = require('util');

var CronHook = exports.CronHook = function(options){

  //
  // Hook setup
  //
  Hook.call(this);

  var self = this;

  self.config.use('file', { file: './config.json'});

  for (var o in options) {
    self[o] = options[o];
  }

  // 
  // Cron constructor
  //
  self.INTERVAL = 5000;

  // on ready, start up the httpServer
  self.on('hook::ready', function(){
    
    //
    // Add some startup commands here
    //

    // begin _poll to check if there are any jobs
    //self._poll();

    self.on('*::addJob', function(source, event, data){
      self.addJob(data);
    });

    self._poll();

  });

};

// CronHook inherits from Hook
util.inherits(CronHook, Hook);

CronHook.prototype._start = function(){

  self._poll();

};


CronHook.prototype.addJob = function(job){

  var self = this;

  var jobs = self.config.get('jobs') || [];
  
  job.name = job.name || 'default job name';
  jobs.push(job);
  self.set('jobs', jobs);
  
};

CronHook.prototype.removeJob = function(options, hook){
  
};

CronHook.prototype._poll = function(){

  var self = this;

  self.log(self.name, 'firing poll interval');

  // setInterval is not ideal here,
  // we should implement something with better precision,
  // such as JSONloops approach with new Date().getTime() and process.nextTick()
  setInterval(function(){
    self._checkJobs();
  }, self.INTERVAL)
  
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
      self.log(self.name, job.event, job.data);
    });
  }
  
};
