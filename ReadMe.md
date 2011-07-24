## hook.io-cron

*emit arbitrary Hook.io events with arbitrary data on specified time intervals*

## Hook.io Events Names

**addJob** *adds a new job to be executed on a set interval*:

```javascript

myHook.emit('*::addJob', {
  "event": "*::foo",
  "data": {
    "myprop": "myval"
  }
});
```