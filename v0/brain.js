

var brain = {
    find_energy_source: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var target_source_i = creep.memory.designation%sources.length;
        return sources[target_source_i];
    },
    
    reserve_object: function (object) {
        if (object.room.memory.reserved_objects == undefined) {
            object.room.memory.reserved_objects = [];
        }
        object.room.memory.reserved_objects.push(object.id);
        console.log(object.id + " reserved");
        //console.log(object.room.memory.reserved_objects);
    },
    
    acquire_energy: function (creep) {
        var source = brain.find_energy_source(creep);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    },
    
    random_int: function (min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    },
    
    empty_position_near: function (room, x, y) {
        //return [0, 1];
        
        var frontier = [];
        var explored = [];
        
        frontier.push([x, y], [x-2, y], [x-2, y-2], [x-2, y+2], [x, y-2], [x+2, y], [x+2, y-2], [x+2, y+2], [x, y+2]);
        
        while (frontier.length != 0) {
            var current = frontier.shift();
            var x = current[0];
            var y = current[1];
            if (explored.includes(current)) {
                continue;
            }
            //console.log([x, y]);
            explored.push();
            var is_wall = room.lookForAt(LOOK_TERRAIN, x, y) == "wall";
            var is_empty = (x >= 0 && x <= 49 && y >= 0 && y <= 49 && !is_wall &&
                            room.lookForAt(LOOK_STRUCTURES, x, y).length == 0 &&
                            room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y).length == 0);
            
            if (is_empty) {
                return [x, y];
            }
            else if (!is_wall) {
                frontier.push ([x-2, y]);
                frontier.push ([x-2, y-2]);
                frontier.push ([x-2, y+2]);
                frontier.push ([x, y-2]);
                frontier.push ([x+2, y]);
                frontier.push ([x+2, y-2]);
                frontier.push ([x+2, y+2]);
                frontier.push ([x, y+2]);
            }
        }
        return "fail";
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