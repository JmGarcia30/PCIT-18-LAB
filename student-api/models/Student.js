const mongoose = require('mongoose');

// SCHEMA
const studentSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    course: String,
    year_level: Number,
    section: String,
    gender: String
});

// MODEL
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;