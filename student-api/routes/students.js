const express = require('express');
const router = express.Router();

const Student = require('../models/Student');

//Create
router.post('/', async (req,res)=> {
    const {name, firstname, lastname, course, year_level, section, gender} = req.body;
    const student = new Student({name, firstname, lastname, course, year_level, section, gender});
    await student.save();
    res.status(201).json(student);
});

// Enhanced GET
router.get('/', async (req,res) => {
    const filter = {};

    if (req.query.course) {
        filter.course = new RegExp(`^${req.query.course.trim()}$`, 'i');
    }

    if (req.query.year_level !== undefined && req.query.year_level !== '') {
        const yearLevel = Number(req.query.year_level);

        if (!Number.isNaN(yearLevel)) {
            filter.year_level = yearLevel;
        }
    }

    if (req.query.gender) {
        filter.gender = new RegExp(`^${req.query.gender.trim()}$`, 'i');
    }

    if (req.query.section) {
        filter.section = new RegExp(`^${req.query.section.trim()}$`, 'i');
    }

    const students = await Student.find(filter);
    res.json(students);
});

// Delete
router.delete('/:id', async (req, res, next)=>{
    try{
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if(!deletedStudent) {
            return res.status(404).json({message: "Student not found"});
        }
        res.json({message: "Student deleted successfully"});
    } catch (error){
        next(error);
    } 
});

// Update
router.put('/:id', async (req, res, next) => {
    try {
        const { firstname, lastname, course, year_level, section, gender } = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { firstname, lastname, course, year_level, section, gender },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            message: 'Student updated successfully',
            student: updatedStudent
        });
    } catch (error) {
        next(error);
    }
});



module.exports = router;