const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from the dist folder
app.use(express.static(path.join(__dirname, '/dist/frontend')));

// ==========================================
// MONGODB ATLAS CONNECTION
// ==========================================
const MONGO_URI = 'mongodb+srv://fahim225925_db_user:fahim123@cluster0.ca4r4v.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully!');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Define Employee Schema and Model
const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number }
});

const Employee = mongoose.model('Employee', employeeSchema);

// ==========================================
// API ENDPOINTS (Supporting both route variations)
// ==========================================

// GET: Retrieve all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

app.get('/api/employees', getAllEmployees);
app.get('/api/employeelist', getAllEmployees);

// POST: Add new employee
const addEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee({
            name: req.body.name,
            location: req.body.location,
            position: req.body.position,
            salary: req.body.salary
        });
        const savedEmployee = await newEmployee.save();
        res.status(201).json({ message: 'Employee added successfully', employee: savedEmployee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

app.post('/api/employees', addEmployee);
app.post('/api/employeelist', addEmployee);

// PUT: Update employee
const updateEmployee = async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

app.put('/api/employees/:id', updateEmployee);
app.put('/api/employeelist/:id', updateEmployee);

// DELETE: Delete employee
const deleteEmployee = async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

app.delete('/api/employees/:id', deleteEmployee);
app.delete('/api/employeelist/:id', deleteEmployee);

// ==========================================
// START SERVER
// ==========================================
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});