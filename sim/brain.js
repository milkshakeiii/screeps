

var brain = {
    find_energy_source: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        function more_than_one_spot(source) {
            return brain.count_mining_positions(source) > 1;
        }
        sources = sources.filter(more_than_one_spot);
        sources = sources.filter(brain.is_unguarded);
        var original_length = sources.length;
        for (var j = 0; j < original_length; j++) {
            var source = sources[j];
            var mining_spots = brain.count_mining_positions(source);
            for (var i = 0; i < mining_spots; i++) {
                sources.push(source);
            }
        }
        var target_source_i = creep.memory.designation%sources.length;
        return sources[target_source_i];
    },
    
    
    is_unguarded: function (source) {
        function is_keeper_lair(structure) {
            return structure.structureType == STRUCTURE_KEEPER_LAIR;
        }
        var nearby_structures = source.pos.findInRange(FIND_STRUCTURES, 5);
        var guards = nearby_structures.filter(is_keeper_lair);
        //console.log(guards);
        return !(guards.length > 0);
    },
    
    clear_on_all_sides: function (room, x, y) {
        var spaces = [[x+1, y], [x-1, y], [x-1, y-1], [x-1, y+1], [x+1, y+1], [x+1, y-1], [x, y+1], [x, y-1]];
        function space_empty(space) {
            return brain.is_empty(room, space[0], space[1]);
        }
        var empty_spaces = spaces.filter(space_empty);
        return empty_spaces.length == 8;
    },
    
    count_mining_positions: function (source) {
        var x = source.pos.x;
        var y = source.pos.y;
        var spaces = [[x+1, y], [x-1, y], [x-1, y-1], [x-1, y+1], [x+1, y+1], [x+1, y-1], [x, y+1], [x, y-1]];
        function space_empty(space) {
            return brain.is_empty(source.room, space[0], space[1]);
        }
        var empty_spaces = spaces.filter(space_empty);
        return empty_spaces.length;
    },
    
    is_empty: function(room, x, y) {
        return (x >= 0 && x <= 49 && y >= 0 && y <= 49 && !(room.lookForAt(LOOK_TERRAIN, x, y) == "wall") &&
                room.lookForAt(LOOK_STRUCTURES, x, y).length == 0 &&
                room.lookForAt(LOOK_CONSTRUCTION_SITES, x, y).length == 0);
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
            //console.log(current);
            //console.log(explored);
            var includes = false;
            for (var i = 0; i < explored.length; i++) {
                var point = explored[i];
                //console.log (point[0], x, point[1], y)
                if (point[0] == x && point[1] == y) {
                    //console.log("skip");
                    includes = true;
                    break;
                }
            }
            if (includes) {
                //console.log("skip");
                continue;
            }
            //console.log([x, y]);
            explored.push([x, y]);
            var is_wall = room.lookForAt(LOOK_TERRAIN, x, y) == "wall";
            var clear = brain.clear_on_all_sides(room, x, y);
            var empty = brain.is_empty(room, x, y);
            //console.log(is_wall);
            //console.log(clear);
            //console.log(empty);
            if (clear && empty) {
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