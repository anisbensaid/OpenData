'use strict';

var q = require('q');

function AwesomeModuleDependency(type, name, alias, optional) {
  if (type !== this.TYPE_NAME && type !== this.TYPE_ABILITY) {
    throw new Error('AwesomeModuleDependency: type "' + type + '" is an unknown type');
  }
  this.type = type;

  if (!name || !name.length) {
    throw new Error('AwesomeModuleDependency: name "' + name + '" is invalid');
  }
  this.name = name;

  if (!alias || !alias.length) {
    throw new Error('AwesomeModuleDependency: alias "' + alias + '" is invalid');
  }
  this.alias = alias;

  this.optional = optional ? true : false;

  this.stateCallbacks = {};
}

AwesomeModuleDependency.prototype.TYPE_NAME = AwesomeModuleDependency.TYPE_NAME = 'NAME';
AwesomeModuleDependency.prototype.TYPE_ABILITY = AwesomeModuleDependency.TYPE_ABILITY = 'ABILITY';

AwesomeModuleDependency.prototype.on = function(state, callback) {
  this.stateCallbacks[state] = this.stateCallbacks[state] || [];
  this.stateCallbacks[state].push(callback);
  return this;
};

AwesomeModuleDependency.prototype.fireCallbacks = function(state, module, iface) {
  if (! this.stateCallbacks[state]) {
    return q(true);
  }
  var stateCallbacks = this.stateCallbacks[state];
  delete this.stateCallbacks[state];
  return q.all(
    stateCallbacks.map(function(callback) {
      return q.nfcall(callback.bind(module.getLib()), iface);
    }.bind(this))
  );
};

module.exports = AwesomeModuleDependency;
