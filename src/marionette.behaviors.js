Marionette.Behaviors = (function(Marionette, _){
  function Behaviors(view){
    // lookup view behaviors from behaviors array
    this.behaviors = Behaviors.parseBehaviors(view, view.behaviors);

    var bindUIElements    = view.bindUIElements;
    var unbindUIElements  = view.unbindUIElements;

    var triggerMethod     = view.triggerMethod;
    var undelegateEvents  = view.undelegateEvents;
    var delegateEvents    = view.delegateEvents;

    var _this = this;

    _.each(this.behaviors, function(b){
      // create a helper proxy for listenTo
      b.listenTo = view.listenTo;

      // proxy behavior $ method to the view
      b.$ = function() {
        return view.$.apply(view, arguments);
      };
    });

    view.bindUIElements = function(){
      bindUIElements.apply(view);

      _.each(_this.behaviors, function(b) {
        bindUIElements.call(b);
      });
    };

    view.unbindUIElements = function(){
      unbindUIElements.apply(view);

      _.each(_this.behaviors, function(b) {
        unbindUIElements.apply(b);
      });
    };

    view.triggerMethod = function(){
      var args = arguments;
      // call the views trigger method
      triggerMethod.apply(view, args);

      // loop through each behavior and trigger methods
      _.each(_this.behaviors, function(b){
        // call triggerMethod on each behavior
        // to proxy through any triggerMethod
        triggerMethod.apply(b, args);
      });
    };

    view.delegateEvents = function() {
      delegateEvents.apply(view, arguments);

      _.each(_this.behaviors, function(b){
        Marionette.bindEntityEvents(view, view.model, Marionette.getOption(b, "modelEvents"));
        Marionette.bindEntityEvents(view, view.collection, Marionette.getOption(b, "collectionEvents"));
      });
    };

    view.undelegateEvents = function(){
      undelegateEvents.apply(view, arguments);

      _.each(_this.behaviors, function(b){
        Marionette.unbindEntityEvents(view, view.model, Marionette.getOption(b, "modelEvents"));
        Marionette.unbindEntityEvents(view, view.collection, Marionette.getOption(b, "collectionEvents"));
      });
    };
  }

  // Behavior class level method definitions
  _.extend(Behaviors, {
    // placeholder method to be extended by the user
    // should define the object that stores the behaviors
    // i.e.
    //
    // Marionette.Behaviors.behaviorsLookup: function() {
    //   return App.Behaviors
    // }
    behaviorsLookup: function(){
      throw new Error("You must define where your behaviors are stored. See http://www.marionette.com/using-behaviors");
    },

    parseBehaviors: function(view, behaviors){
      return _.map(behaviors, function(v){
        var key     = _.keys(v)[0];
        var options = _.values(v)[0];
        return new (_.result(Behaviors, "behaviorsLookup")[key])(options, view);
      });
    }
  });

  return Behaviors;

})(Marionette, _);
