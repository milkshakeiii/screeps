var brain = require('brain');

var upgrade = {
    required_parts: function () {
      return [CARRY, WORK];  
    },
    
     /** @param {Room} room **/
    compute_need: function (room) {
        if (!room.controller == undefined && room.controller.my) {
            return 0
        }
        return 100;
    },
    
    /** @param {Creep} creep **/
    perform: function (creep) {
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }



        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            brain.acquire_energy(creep);
        }
    }
}

var priority_upgrade = upgrade;
priority_upgrade.compute_need = function (room) {
    if (!room.controller == undefined && room.controller.my) {
        return 0
    }
    return 1;
}

module.exports = upgrade;