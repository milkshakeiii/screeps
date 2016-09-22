var brain = require('brain');

var defend = {
    required_parts: function () {
      return [ATTACK];  
    },
    
    /** @param {Room} room **/
    compute_need: function (room) {
        if (!room.controller.my || room.find(FIND_HOSTILE_CREEPS).length == 0) {
            return 0;
        }
        return 40;
    },
    
    /** @param {Creep} creep **/
    perform: function (creep) {

        creep.say("stahp", true);
        var defendees = creep.room.find(FIND_HOSTILE_CREEPS);
        var defendee = creep.pos.findClosestByPath(defendees);
            
        var attack_result = creep.attack(defendee);
        //console.log(attack_result)
        if (attack_result == ERR_NOT_IN_RANGE || attack_result == ERR_NO_BODYPART) {
                creep.moveTo(defendee);
        }
    }
}

module.exports = defend;