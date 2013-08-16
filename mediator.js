/*global define*/

/**
  * Attached pub/sub to any object
  */
define(function () {

  var channels = {};
  var sRegex = /\s/g;
  var sep = ',';

  /**
  * @constructor
  */
  function Mediator() {

    /** publish a message w/ variable no of parameters */
    this.publish = function() {

      var args = [].slice.call(arguments)
        , message = args.shift()
        , messages = message.split(sep)
        , subscribers
        , subscriber
        , j
        , jlen
        , i
        , len;

      for (j = 0, jlen = messages.length; j < jlen; j++) {
        subscribers = channels[messages[j]] || [];

        for (i = 0, len = subscribers.length; i < len; i++) {
          subscriber = subscribers[i];
          if (subscriber) {
            subscriber.method.apply(subscriber.object, args);
          }
        }
      }
    };

    /** subscribe a method to a message */
    this.subscribe = function(message, method) {

      var messages
        , i
        , len
        , subscribers;

      // recursion
      if (message.indexOf(sep) > -1) {
        messages = message.split(sep);
        for (i = 0, len = messages.length; i < len; i++) {
          this.subscribe(messages[i].replace(sRegex, ''), method);
        }
      }

      if (channels[message] === undefined) {
        channels[message] = [];
      }

      channels[message].push({
        object: this,
        method: method
      });

    };

    /** remove subscription */
    this.unsubscribe = function(message, method) {

      var subscribers = channels[message]
        , subscriber
        , i;

      for (i = 0; i < subscribers.length; i++) {

        subscriber = subscribers[i];

        if (subscriber.object === this && subscriber.method === method) {
          subscribers.splice(i--, 1);
        }
      }
    };

    /** remove all subscriptions */
    this.unsubscribeall = function(){

      var each
        , subscribers
        , subscriber
        , i;

      for (each in channels) {

        if(channels.hasOwnProperty(each)){

          subscribers = channels[each];

          for (i = 0; i < subscribers.length; i++) {

            subscriber = subscribers[i];

            if (subscriber.object === this) {
              subscribers.splice(i--, 1);
            }
          }
        }
      }
    };

  }

  return Mediator;

});
