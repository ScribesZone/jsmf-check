var JSMF  = require('jsmf');
var nav   = require('jsmf-magellan');
var check = require('../index.js');
var _ = require('lodash');

Class = JSMF.Class;
Model = JSMF.Model;

var FSM = new Model('FSM');
var State = Class.newInstance('State');
State.setAttribute('name', String);
var StartState = Class.newInstance('StartState');
StartState.setSuperType(State);
var EndState = Class.newInstance('EndState');
EndState.setSuperType(State);

var Transition = Class.newInstance('Transition');
Transition.setAttribute('name', String);
Transition.setReference('next', State, 1);
State.setReference('transition', Transition, -1);

FSM.setModellingElements([StartState, State, EndState, Transition]);

var sample = new Model('sample');

var s0 = StartState.newInstance('start');
s0.setName('start');
var s1 = State.newInstance('test1');
s1.setName('test1');
var s2 = State.newInstance('test2');
s2.setName('test2');
var s3 = EndState.newInstance('finish');
s3.setName('finish');

var t0 = Transition.newInstance('launchTest');
t0.setName('launchTest');
t0.setNext(s1);
var t10 = Transition.newInstance('test1Succeeds');
t10.setName('test1Succeeds');
t10.setNext(s2);
var t11 = Transition.newInstance('test1Fails');
t11.setName('test1Fails');
t11.setNext(s0);
var t20 = Transition.newInstance('test2Succeeds');
t20.setName('test2Succeeds');
t20.setNext(s3);
var t21 = Transition.newInstance('test2Fails');
t21.setName('test2Fails');
t21.setNext(s0);

s0.setTransition(t0);
s1.setTransition([t10, t11]);
s2.setTransition([t20, t21]);

sample.setReferenceModel(FSM);
sample.setModellingElements([s0, s1, s2, s3, t0, t10, t11, t20, t21]);

function states (model) {
    return nav.allInstancesFromModel(State, model);
}

function reachEnd (e) {
    return !(_.isEmpty(nav.allInstancesFromObject(EndState, e)))
}

var cs = check.Constraints.newInstance();
var r0 = check.rule(states, reachEnd);
cs.addRule("end can be reach", r0);

console.log(cs.check(sample));

module.exports = {
  's0': s0,
  's1': s1,
  's2': s2,
  's3': s3,
  'State': State,
  'EndState': EndState,
  't0': t0,
  't11': t11,
  't20': t20,
  't21': t21,
  'Transition': Transition,
  'FSM': FSM,
  'sample': sample,
  'states': states,
  'reachEnd': reachEnd
}