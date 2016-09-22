

var brain = {
    find_energy_source: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var target_source_i = creep.memory.designation%sources.length;
        return sources[target_source_i];
    },
    
    random_int: function (min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    
    empty_position_near: function (room, x, y) {
        while (room.lookForAt(LOOK_TERRAIN, x, y) == "wall" ||
               room.lookForAt(LOOK_STRUCTURES, x, y).length != 0 ||
               room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y).length != 0) {
            x += Math.abs(brain.random_int(-5, 5)%50);
            y += Math.abs(brain.random_int(-5, 5)%50);
            //onsole.log([x, y]);
        }
        return [x, y];
    },
    
    creep_can_perform_task: function (creep, task) {
        var required_parts = task.required_parts();
        var available_parts = creep.body.map(function(obj){return obj.type});
        
        for (var i = 0; i < required_parts.length; i++) {
            var part = required_parts[i];
            if (!available_parts.includes(part)) {
                return false;
            }
            available_parts.splice(available_parts.indexOf(part), 1);
        }
        return true;
    }
}

module.exports = brain;