var brain = require('brain');

var harass = {
    required_parts: function () {
      return [TOUGH, ATTACK];  
    },
    
    /** @param {Room} room **/
    compute_need: function (room) {
        return 30;
    },
    
    /** @param {Creep} creep **/
    perform: function (creep) {
        
        if (creep.room.find(FIND_HOSTILE_CREEPS).length == 0) {
            creep.say("Grr...");
            
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
            creep.say("rwar", true);
            var harassee = creep.room.find(FIND_HOSTILE_CREEPS)[0];
            
            var attack_result = creep.attack(harassee);
            if (attack_result == ERR_NOT_IN_RANGE || attack_result == ERR_NO_BODYPART) {
                creep.moveTo(harassee);
            }
        }
    }
}

module.exports = harass;