import React, { useState, useEffect } from "react";

// Đặt mặc định ra ngoài để tránh lỗi dependency trong useEffect
const defaultState = {
  name: "",
  age: "",
  gender: "Male",
  phone: "",
  address: "",
  disease: "",
  doctor: "",
  status: "Waiting"
};

const PatientForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState(defaultState);
  const [errors, setErrors] = useState({}); // Trạng thái lưu trữ lỗi

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultState);
    }
    setErrors({}); // Xóa sạch thông báo lỗi khi đổi chế độ
  }, [initialData]);

  // --- BẪY LỖI NGHIỆP VỤ (VALIDATION) ---
  const validate = () => {
    let newErrors = {};

    // 1. Kiểm tra Họ tên
    if (!formData.name.trim()) {
      newErrors.name = "Họ tên không được để trống";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    // 2. Kiểm tra Tuổi
    if (!formData.age) {
      newErrors.age = "Vui lòng nhập tuổi";
    } else if (formData.age < 0 || formData.age > 120) {
      newErrors.age = "Tuổi phải từ 0 đến 120";
    }

    // 3. Kiểm tra Số điện thoại (Định dạng VN: 10 số, bắt đầu bằng 03, 05, 07, 08, 09)
    const phoneRegex = /^(0[3|5|7|8|9])([0-9]{8})$/;
    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "SĐT không hợp lệ (Phải có 10 số, đầu 03, 05, 07, 08, 09)";
    }

    // 4. Kiểm tra Địa chỉ
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    // 5. Kiểm tra Bệnh lý (Bẫy lỗi nghiệp vụ mới)
    if (!formData.disease.trim()) {
      newErrors.disease = "Chẩn đoán bệnh lý không được để trống";
    } else if (formData.disease.trim().length < 3) {
      newErrors.disease = "Thông tin bệnh lý quá ngắn";
    }

    // 6. Kiểm tra Bác sĩ điều trị (Bẫy lỗi nghiệp vụ mới)
    if (!formData.doctor.trim()) {
      newErrors.doctor = "Vui lòng phân công bác sĩ phụ trách";
    } else if (formData.doctor.trim().length < 5) {
      newErrors.doctor = "Tên bác sĩ phải đầy đủ (VD: BS. Nguyễn Văn A)";
    }

    setErrors(newErrors);
    // Nếu object newErrors trống (không có lỗi), hàm trả về true
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className={`card-header ${initialData ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
        <h5 className="mb-0">
          {initialData ? "📋 Cập Nhật Thông Tin" : "➕ Thêm Bệnh Nhân Mới"}
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          
          {/* Họ tên */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Họ tên</label>
            <input 
              type="text" 
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nguyễn Văn A"
            />
            <div className="invalid-feedback">{errors.name}</div>
          </div>

          {/* Tuổi */}
          <div className="col-md-3">
            <label className="form-label fw-bold">Tuổi</label>
            <input 
              type="number" 
              className={`form-control ${errors.age ? 'is-invalid' : ''}`}
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
            <div className="invalid-feedback">{errors.age}</div>
          </div>

          {/* Giới tính */}
          <div className="col-md-3">
            <label className="form-label fw-bold">Giới tính</label>
            <select 
              className="form-select" 
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
            >
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
          </div>

          {/* Số điện thoại */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Số điện thoại</label>
            <input 
              type="text" 
              className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="0912345678"
            />
            <div className="invalid-feedback">{errors.phone}</div>
          </div>

          {/* Địa chỉ */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Địa chỉ</label>
            <input 
              type="text" 
              className={`form-control ${errors.address ? 'is-invalid' : ''}`}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Số nhà, Tên đường, Quận/Huyện"
            />
            <div className="invalid-feedback">{errors.address}</div>
          </div>

          {/* Bệnh lý */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Bệnh lý</label>
            <input 
              type="text" 
              className={`form-control ${errors.disease ? 'is-invalid' : ''}`}
              value={formData.disease}
              onChange={(e) => setFormData({...formData, disease: e.target.value})}
              placeholder="Ví dụ: Sốt xuất huyết"
            />
            <div className="invalid-feedback">{errors.disease}</div>
          </div>

          {/* Bác sĩ điều trị */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Bác sĩ điều trị</label>
            <input 
              type="text" 
              className={`form-control ${errors.doctor ? 'is-invalid' : ''}`}
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              placeholder="BS. Nguyễn Văn B"
            />
            <div className="invalid-feedback">{errors.doctor}</div>
          </div>

          {/* Trạng thái */}
          <div className="col-md-12">
            <label className="form-label fw-bold">Trạng thái điều trị</label>
            <select 
              className="form-select" 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Waiting">Chờ khám</option>
              <option value="Treating">Đang điều trị</option>
              <option value="Recovered">Đã khỏi</option>
            </select>
          </div>

          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-success px-4 me-2 shadow-sm">
              {initialData ? "Cập Nhật" : "Lưu Thông Tin"}
            </button>
            {initialData && (
              <button type="button" className="btn btn-secondary px-4 shadow-sm" onClick={onCancel}>
                Hủy bỏ
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;