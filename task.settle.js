var brain = require('brain');

var settle = {
    required_parts: function () {
      return [CLAIM];  
    },
    
    /** @param {Room} room **/
    compute_need: function (room) {
        return 4;
    },
    
    /** @param {Creep} creep **/
    perform: function (creep) {

        if (creep.room.controller.my || creep.room.controller.owner != undefined) {
            creep.say("Is this it");
            var exits = creep.room.find(FIND_EXIT);
            var random_exit = exits[creep.memory.designation%exits.length];
            creep.moveTo(random_exit);
        }
        else {
            creep.say("Boldly go");
            
            
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            else if(creep.claimController(creep.room.controller) == ERR_GCL_NOT_ENOUGH  && 
                    creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

module.exports = settle;