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
            //if (creep.memory.target_exit_x == creep.pos.x && creep.memory.target_exit_y == creep.pos.y) {
            if (creep.room.name != creep.memory.last_room_name) {
                //console.log("new exit");
                var exits = creep.room.find(FIND_EXIT);
                var random_exit = exits[brain.random_int(0, exits.length-1)];
                creep.memory.target_exit_x = random_exit.x;
                creep.memory.target_exit_y = random_exit.y;
                creep.memory.last_room_name = creep.room.name;
            }
            random_exit = creep.room.getPositionAt(creep.memory.target_exit_x, creep.memory.target_exit_y);
            
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