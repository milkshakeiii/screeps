var brain = require('brain');

var harvest = {
    required_parts: function () {
      return [CARRY, WORK];  
    },
    
    /** @param {Room} room **/
    compute_need: function (room) {
        if (room.find(FIND_MY_SPAWNS).length == 0) {
            return 0;
        }
        return 7;
    },
    
    /** @param {Creep} creep **/
    perform: function (creep) {
        if (creep.memory.delivering == undefined) {
            creep.memory.delivering = false;
        }
        
        if (creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
            creep.say("that's it");
        }
        if (!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.delivering = true;
            creep.say("all full")
        }
        
        if (!creep.memory.delivering) {
            brain.acquire_energy(creep);
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            var towers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            var target = creep.pos.findClosestByPath(targets)
            if (towers.length > 0) {
                target = creep.pos.findClosestByPath(towers);
            }
            if(targets.length > 0) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    }
}

module.exports = harvest;