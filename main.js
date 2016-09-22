var tasks = [   require('task.priority_upgrade'), require('task.harvest'),  require('task.defend'), require('task.build'),
                require('task.upgrade'), require('task.harass'), require('task.settle')];
var brain = require('brain')

var worker_switch = 60;

clean_up = function () {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

build_creeps = function () {
    for (var spawn_name in Game.spawns) {
        var spawn = Game.spawns[spawn_name];
        var local_creeps = spawn.room.find(FIND_MY_CREEPS);
        var part_array = [];
        
        if (local_creeps.length < worker_switch) {
            if (spawn.room.energyCapacityAvailable < 400) {
                part_array = [WORK, CARRY, CARRY, MOVE, MOVE];
            }
            else if (spawn.room.energyCapacityAvailable < 500) {
                part_array = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            }
            else if (spawn.room.energyCapacityAvailable < 600) {
                part_array = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE];
            }
            else if (spawn.room.energyCapacityAvailable < 800) {
                part_array = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
            }
            else if (spawn.room.energyCapacityAvailable < 1300) {
                part_array = [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            }
            else if (spawn.room.energyCapacityAvailable >= 1300) {
                part_array = [  WORK, WORK, WORK,
                                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
                                ATTACK];
            }
            
        }
        else {
            part_array = [CLAIM, CLAIM, MOVE, MOVE];
            //part_array = [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK];
        }
        spawn.createCreep(part_array, undefined, {designation: brain.random_int(1, 999)});
    }
}

place_structures = function () {
    for (var room_name in Game.rooms){
        var room = Game.rooms[room_name];
        var spawns = room.find(FIND_MY_SPAWNS);
        var sources = room.find(FIND_SOURCES);
        
        //place a spawn if there aren't any and there is an energy source
        if (spawns.length == 0 && sources.length != 0) {
            var target_source = sources[0];
            var x = target_source.pos.x;
            var y = target_source.pos.y;
            var empty_position = brain.empty_position_near(room, x, y);
            x = empty_position[0];
            y = empty_position[1];
            room.createConstructionSite(x, y, STRUCTURE_SPAWN);
        }
        
        //extend the spawn if we can
        if (spawns.length != 0)
        {
            var spawn = spawns[0];
            var random_source = sources[brain.random_int(0, sources.length-1)];
            var x = random_source.pos.x;
            var y = random_source.pos.y;
            var empty_position = brain.empty_position_near(room, x, y);
            x = empty_position[0];
            y = empty_position[1];
            room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
        }
        
        //place a tower if we can
        if (spawns.length != 0) {
            var x = spawns[0].pos.x;
            var y = spawns[0].pos.y;
            var empty_position = brain.empty_position_near(room, x, y);
            x = empty_position[0];
            y = empty_position[1];
            room.createConstructionSite(x, y, STRUCTURE_TOWER);
        }
    }
}

id_tasks = function () {
    var needs = [];
    
    for (var room_name in Game.rooms) {
        var room = Game.rooms[room_name];
        var room_needs = {room: room, needs: []};
        for (var task in tasks) {
            room_needs.needs.push(tasks[task].compute_need(room));
        }
        needs.push(room_needs);
    }
    return needs;
}


dispatch_creeps = function (needs) {
    for (var i = 0; i<needs.length; i++) {
        var room_needs = needs[i];
        var available_creeps = room_needs.room.find(FIND_MY_CREEPS);
        
        for (var j = 0; j < room_needs.needs.length; j++) {
            var need = room_needs.needs[j];
            var skipped_creeps = [];
            
            for (var k = 0; k<need; k++) {
                if (available_creeps.length != 0)
                {
                    var task = tasks[j];
                    var candidate_creep = available_creeps[0];
                    if (brain.creep_can_perform_task(candidate_creep, task)){
                        task.perform(candidate_creep);
                    }
                    else {
                        skipped_creeps.push(candidate_creep);
                        k--;
                    }
                    available_creeps.shift();
                }
            }
            available_creeps = available_creeps.concat(skipped_creeps);
        }
        if (available_creeps.length > 0) {
            console.log("There are " + available_creeps.length.toString() + " idle creeps in room " + room_needs.room.name + ":"); 
            console.log(available_creeps);
        }
    }
}

fire_towers = function () {
    
    for (var roomName in Game.rooms) {
        var room = Game.rooms[roomName];
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        
        
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            var towers = room.find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
            towers.forEach(tower => tower.attack(tower.pos.findClosestByRange(hostiles)));
        }
    }
}

module.exports.loop = function () {
    clean_up();
    
    build_creeps();
    
    place_structures();
    
    var needs = id_tasks();
    
    dispatch_creeps(needs);
    
    fire_towers();
}