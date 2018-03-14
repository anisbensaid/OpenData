'use strict';

var q = require('q');
var extend = require('extend');
var AwesomeModuleDependency = require('./module-dependency');

function asyncPassthrough(moduleLibs, callback) { callback(); }

function validateOptions(options) {
  if (options.dependencies) {
    if (!Array.isArray(options.dependencies)) {
      throw new Error('AwesomeModule: options.dependencies should be an array');
    }
    for (var i = 0; i < options.dependencies.length; i++) {
      var dep = options.dependencies[i];
      if (! (dep instanceof AwesomeModuleDependency)) {
        throw new Error('AwesomeModule: options.dependencies index ' + i + ' should be an instance of AwesomeModuleDependency');
      }
    }
  }

  if (options.abilities) {
    if (!Array.isArray(options.abilities)) {
      throw new Error('AwesomeModule: options.abilities should be an array');
    }
  }

  if (options.proxy && typeof options.proxy !== 'function') {
    throw new Error('AwesomeModule: options.proxy should be a function');
  }
}

function AwesomeModule(name, options) {
  this.name = name;
  this.settings = {
    states: {
      lib: function(moduleLibs, callback) {
        return callback(null, {});
      }
    },
    dependencies: [],
    abilities: [],
    proxy: null
  };
  this.promises = {};

  validateOptions(options);
  extend(this.settings, options);
}

AwesomeModule.prototype.getDependencies = function() {
  return this.settings.dependencies.slice();
};

AwesomeModule.prototype.getRequiredDependencies = function() {
  return this.settings.dependencies.filter(function(dep) {
    return dep.optional === false;
  });
};

AwesomeModule.prototype.getOptionalDependencies = function() {
  return this.settings.dependencies.filter(function(dep) {
    return dep.optional === true;
  });
};

AwesomeModule.prototype.findDependencyByAlias = function(alias) {
  var result = this.settings.dependencies.filter(function(dep) {
    return dep.alias === alias;
  });
  return result.length ? result[0] : null;
};

AwesomeModule.prototype.hasAbility = function(name) {
  return this.settings.abilities.indexOf(name) >= 0;
};

AwesomeModule.prototype.getStateResult = function(state) {
  if (!(state in this.promises) || !this.promises[state].isFulfilled()) {
    return null;
  }
  return this.promises[state].inspect().value;
};

AwesomeModule.prototype.getLib = function() {
  return this.getStateResult('lib');
};

AwesomeModule.prototype.getProxy = function(name, trusted) {
  if (this.settings.proxy) {
    return this.settings.proxy.call(this.getLib(), name, trusted);
  }
  return this.getLib();
};

AwesomeModule.prototype.isStateFulfilled = function(state) {
  return (! (state in this.promises)) ? false : this.promises[state].isFulfilled();
};

AwesomeModule.prototype.isStateRejected = function(state) {
  return (! (state in this.promises)) ? false : this.promises[state].isRejected();
};

AwesomeModule.prototype.isStatePending = function(state) {
  return (! (state in this.promises)) ? false : this.promises[state].isPending();
};

AwesomeModule.prototype.playState = function(state, iface) {
  if (this.promises[state]) { return this.promises[state]; }
  if (!this.settings.states[state]) { this.settings.states[state] = asyncPassthrough; }

  this.promises[state] = q.nfcall(this.settings.states[state].bind(this.getLib()), iface);
  return this.promises[state];
};

// expose AwesomeModuleDependency
AwesomeModule.AwesomeModuleDependency = AwesomeModuleDependency;

module.exports = AwesomeModule;
