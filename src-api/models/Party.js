var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartySchema = new Schema({
    data: {
        type: {
            user_id: {
                type: Schema.ObjectId,
                ref: "User",
                required: true
            },
            solve_id: { //Idea: en vez de haer muchos Party con estos dos atributos, crear un solo party en el que el solve_id sea un Array de los ids de los solves que hace esa persona en esa room. Que el id principal sea la mezcla entre room y user
                type: Schema.ObjectId,
                ref: "Solve",
                required: true
            }
        },
        required: true,
        index: {
            unique: true
        }
    },
    room_id: {
        type: Schema.ObjectId,
        ref: "Room",
        required: true
    }
});

module.exports = mongoose.model('Party', PartySchema);