const mongoose = require('mongoose');


const assignmentSchema = new mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    assignTo: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    createdAt: { 
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('User', assignmentSchema);