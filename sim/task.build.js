var brain = require('brain');

var build = {
    required_parts: function () {
      return [CARRY, WORK];  
    },
    
    /** @param {Room} room **/
    compute_need: function (room) {
        if (room.find(FIND_MY_CONSTRUCTION_SITES).length != 0) {
            var creeps_in_room = room.find(FIND_MY_CREEPS).length;
            return 100;//creeps_in_room;
        }
        return 0;
    },
    
    /** @param {Creep} creep **/
    perform: function (creep) {
        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }
        if(creep.memory.building) {
            var targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        else {
            brain.acquire_energy(creep);
        }
    }
}

module.exports = build;