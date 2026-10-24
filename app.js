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
// API ENDPOINTS (Assignment Requirements)
// ==========================================

// 1. GET: Retrieve all employee information from the database
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET: Retrieve a single employee information by ID[cite: 1]
app.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. POST: Add new employee to database[cite: 1]
app.post('/api/employees', async (req, res) => {
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
});

// 4. PUT: Update information of the employee[cite: 1]
app.put('/api/employees/:id', async (req, res) => {
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
});

// 5. DELETE: Delete a single employee from database[cite: 1]
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// START SERVER
// ==========================================
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});