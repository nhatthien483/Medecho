const Patient = require("../models/patientModel");


// CREATE
exports.createPatient = async (req, res) => {
    try {
        const patient = new Patient(req.body);
        const saved = await patient.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json(error);
    }
};


// READ ALL
exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json(error);
    }
};


// READ ONE
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        res.json(patient);
    } catch (error) {
        res.status(500).json(error);
    }
};


// UPDATE
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(patient);
    } catch (error) {
        res.status(500).json(error);
    }
};


// DELETE
exports.deletePatient = async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
};