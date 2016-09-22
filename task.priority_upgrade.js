var brain = require('brain');
var upgrade = require('task.upgrade');

var priority_upgrade = upgrade;
priority_upgrade.compute_need = function (room) {
    if (!room.controller == undefined && room.controller.my) {
        return 0
    }
    return 1;
}

module.exports = priority_upgrade;