import React, { useState } from "react";

const PatientList = ({ patients, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 1. Hàm định dạng Badge trạng thái (Giữ nguyên logic cũ)
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Recovered': return 'bg-success';
      case 'Treating': return 'bg-info text-dark';
      default: return 'bg-warning text-dark';
    }
  };

  // 2. Logic Lọc và Tìm kiếm
  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.phone.includes(searchTerm);
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="patient-list-container">
      {/* --- THANH TÌM KIẾM VÀ BỘ LỌC --- */}
      <div className="row mb-3 g-2">
        <div className="col-md-8">
          <input 
            type="text" 
            className="form-control shadow-sm" 
            placeholder="Tìm theo tên hoặc số điện thoại..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select 
            className="form-select shadow-sm" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Waiting">Chờ khám</option>
            <option value="Treating">Đang điều trị</option>
            <option value="Recovered">Đã khỏi</option>
          </select>
        </div>
      </div>

      {/* --- BẢNG DỮ LIỆU (GIỮ NGUYÊN CẤU TRÚC CŨ) --- */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle bg-white">
          <thead className="table-dark">
            <tr>
              <th>Họ Tên</th>
              <th>Tuổi</th>
              <th>Giới Tính</th>
              <th>Số Điện Thoại</th>
              <th>Địa Chỉ</th>
              <th>Bệnh Lý</th>
              <th>Bác Sĩ</th>
              <th>Trạng Thái</th>
              <th className="text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr 
                key={p._id} 
                style={{ cursor: "pointer" }} 
                onClick={() => setSelectedPatient(p)}
              >
                <td className="fw-bold text-primary">{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.phone}</td>
                <td>{p.address}</td>
                <td><span className="text-muted">{p.disease}</span></td>
                <td>{p.doctor || "---"}</td>
                <td>
                  <span className={`badge ${getStatusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="d-flex justify-content-center">
                    <button 
                      className="btn btn-sm btn-outline-primary me-2" 
                      onClick={() => onEdit(p)}
                    >
                      Sửa
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => onDelete(p._id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPatients.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-muted">
                  Không tìm thấy bệnh nhân phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL XEM CHI TIẾT HỒ SƠ --- */}
      {selectedPatient && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">📄 CHI TIẾT HỒ SƠ BỆNH NHÂN</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedPatient(null)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <small className="text-muted d-block">Họ và tên</small>
                    <span className="fw-bold fs-5">{selectedPatient.name}</span>
                  </div>
                  <div className="col-md-3 mb-3">
                    <small className="text-muted d-block">Tuổi</small>
                    <span className="fw-bold">{selectedPatient.age}</span>
                  </div>
                  <div className="col-md-3 mb-3">
                    <small className="text-muted d-block">Giới tính</small>
                    <span className="fw-bold">{selectedPatient.gender}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <small className="text-muted d-block">Số điện thoại</small>
                    <span className="fw-bold text-primary">{selectedPatient.phone}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <small className="text-muted d-block">Bác sĩ phụ trách</small>
                    <span className="fw-bold">{selectedPatient.doctor || "Chưa phân công"}</span>
                  </div>
                  <div className="col-12 mb-3">
                    <small className="text-muted d-block">Địa chỉ thường trú</small>
                    <span className="fw-bold">{selectedPatient.address}</span>
                  </div>
                  <div className="col-12">
                    <div className="p-3 rounded bg-light border-start border-4 border-danger">
                      <small className="text-muted d-block">Chẩn đoán bệnh lý</small>
                      <span className="fw-bold text-danger">{selectedPatient.disease}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedPatient(null)}>Đóng</button>
                <button className="btn btn-primary" onClick={() => { onEdit(selectedPatient); setSelectedPatient(null); }}>Sửa hồ sơ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;