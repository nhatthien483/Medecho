const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const patientController = require("../controllers/patientController");
const validate = require("../middleware/validateMiddleware");

router.post(
    "/",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("age").isNumeric().withMessage("Age must be number")
    ],
    validate,
    patientController.createPatient
);

router.get("/", patientController.getPatients);

router.get("/:id", patientController.getPatientById);

router.put("/:id", patientController.updatePatient);

router.delete("/:id", patientController.deletePatient);

module.exports = router;