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
      }
    },
    {
      "event": "test",
      "data": {
        "prop2": "val2"
      }
    },
    {
      "event": "foo",
      "data": {
        "prop3": "val3"
      }
    }
  ]
}

```