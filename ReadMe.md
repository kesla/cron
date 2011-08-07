## hook.io-cron

*emit arbitrary Hook.io events with arbitrary data on specified time intervals*

## Hook Events Names

**addJob** *adds a new job to be executed on a set interval*:

## Hook config.json data

``` js
{
  "jobs" : [
    {
      "event": "hello",
      "data": {
        "prop": "val"
      },
      "every": "second" // More shortcuts available: "minute", "hour", "day", "week", "month", "year"
    },
    {
      "event": "test",
      "data": {
        "prop2": "val2"
      },
      "every": "2 weeks" // The event will be executed every 2 weeks
    },
    {
      "event": "foo",
      "data": {
        "prop3": "val3"
      },
      "every": "sunday at 4 am" // any weekday will work, "weekend" or "weekday"
    }
  ]
}

```
