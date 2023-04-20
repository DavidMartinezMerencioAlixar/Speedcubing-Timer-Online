var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartySchema = new Schema({
    user_id: {
        type: Schema.ObjectId,
        ref: "User",
        required: true,
        index: {
            unique: true
        }
    },
    solve_id: {
        type: Schema.ObjectId,
        ref: "Solve",
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