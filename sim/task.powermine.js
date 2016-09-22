var brain = require('brain');

var powermine = {
    required_parts: function () {
      return [WORK, WORK, WORK, WORK, WORK];  
    },
    
    /** @param {Room} room **/
    compute_need: function (room) {
        if (room.find(FIND_MY_SPAWNS).length == 0) {
            return 0;
        }
        return room.find(FIND_SOURCES).length;
    },
    
    /** @param {Creep} creep **/
    perform: function (creep) {
        var source = brain.find_energy_source(creep);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
}

module.exports = powermine;