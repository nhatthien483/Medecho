import React, { useState, useEffect } from "react";
import * as api from "./api/patientApi";
import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";

function App() {
  const [patients, setPatients] = useState([]);
  const [editingPatient, setEditingPatient] = useState(null);

  const loadData = async () => {
    try {
      const res = await api.getPatients();
      setPatients(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (data) => {
    try {
      if (editingPatient) await api.updatePatient(editingPatient._id, data);
      else await api.createPatient(data);
      setEditingPatient(null);
      loadData();
    } catch (err) { alert("Có lỗi xảy ra!"); }
  };

  return (
    <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <header className="text-center mb-5">
            <h1 className="display-5 fw-bold text-primary">Hệ Thống Quản Lý Bệnh Nhân</h1>
            <p className="text-muted">FPT University - Software Engineering Project</p>
          </header>

          <PatientForm 
            onSubmit={handleSave} 
            initialData={editingPatient} 
            onCancel={() => setEditingPatient(null)} 
          />

          <h4 className="mb-3 mt-5">Danh sách bệnh nhân hiện tại</h4>
          <PatientList 
            patients={patients} 
            onEdit={setEditingPatient} 
            onDelete={async (id) => { if(window.confirm("Xóa bệnh nhân này?")) { await api.deletePatient(id); loadData(); } }} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;