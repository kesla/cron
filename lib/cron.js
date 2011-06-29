var Hook = require('hook.io').Hook,
    http = require('http'),
    util = require('util');

var CronHook = exports.CronHook = function(options){

  //
  // Hook setup
  //
  
  for (var o in options) {
    this[o] = options[o];
  }

  Hook.call(this);

  var self = this;


  // 
  // Cron constructor
  //
  self.INTERVAL = 1000;



  // on ready, start up the httpServer
  self.on('ready', function(){
    
    //
    // Add some startup commands here
    //
    console.log('I am ready');
    
    // begin _poll to check if there are any jobs
    self._poll();
    
    
  });
  
};

// CronHook inherits from Hook
util.inherits(CronHook, Hook);


CronHook.prototype.addJob = function(options, hook){

  var job = {};
  
  job.name = options.name || 'default job name';
  
  
  
};

CronHook.prototype.removeJob = function(options, hook){
  
};

CronHook.prototype._poll = function(){

  var self = this;

  // setInterval is not ideal here,
  // we should implement something with better precision,
  // such as JSONloops approach with new Date().getTime() and process.nextTick()
  setInterval(function(){
    self._checkJobs();
  }, self.INTERVAL)
  
};

CronHook.prototype._checkJobs = function(){
  
  var self = this;
  
  var jobs = self.get('jobs');
  
  //
  // Iterate through all your jobs and execute them
  //

  //
  // TODO: implement more complex cron logic, instead of just firing them on every interval
  //
  
  jobs.forEach(function(job){

    console.log(job);
    
    self.emit(job.event, job.data);
    
  });
  
};
