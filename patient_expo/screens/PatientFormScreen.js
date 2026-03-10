import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from "react-native";
import { ChevronLeft, Save, User, Phone, MapPin, Activity, Stethoscope } from "lucide-react-native";

const PatientFormScreen = ({ initialData, onSubmit, onCancel }) => {
  // Khởi tạo state với đầy đủ các trường dữ liệu từ Backend
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    address: "",
    disease: "",
    doctor: "",
    status: "Waiting"
  });

  const [errors, setErrors] = useState({});

  // Cập nhật form nếu là chế độ chỉnh sửa (Edit)
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        age: initialData.age.toString() // Đảm bảo tuổi là chuỗi để hiển thị trong TextInput
      });
    }
  }, [initialData]);

  // Danh sách các tùy chọn trạng thái điều trị
  const statusOptions = [
    { label: "Chờ khám", value: "Waiting", color: "#ffc107" },
    { label: "Đang điều trị", value: "Treating", color: "#17a2b8" },
    { label: "Đã khỏi", value: "Recovered", color: "#28a745" }
  ];

  // Hàm kiểm tra dữ liệu đầu vào (Validation)
  const validate = () => {
    let err = {};
    if (!form.name.trim()) err.name = "Họ tên không được để trống";
    if (!form.age || isNaN(form.age) || form.age < 0 || form.age > 120) err.age = "Tuổi không hợp lệ (0-120)";
    if (!/^(0[3|5|7|8|9])([0-9]{8})$/.test(form.phone)) err.phone = "Số điện thoại 10 số không đúng định dạng";
    if (!form.disease.trim()) err.disease = "Vui lòng nhập chẩn đoán bệnh lý";
    if (!form.doctor.trim()) err.doctor = "Vui lòng chỉ định bác sĩ phụ trách";
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSubmit(form);
    } else {
      Alert.alert("Thông báo", "Vui lòng kiểm tra lại các thông tin còn thiếu.");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.flexContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backBtn}>
          <ChevronLeft size={28} color="#333"/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {initialData ? "SỬA HỒ SƠ" : "THÊM BỆNH NHÂN MỚI"}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Save size={24} color="#007bff"/>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Thông tin cơ bản */}
        <InputItem 
          label="Họ và tên" 
          icon={<User size={18} color="#666"/>}
          value={form.name} 
          onChange={(v) => setForm({...form, name: v})} 
          error={errors.name} 
          placeholder="Nguyễn Văn A"
        />

        <View style={styles.row}>
          <InputItem 
            label="Tuổi" 
            value={form.age} 
            onChange={(v) => setForm({...form, age: v})} 
            error={errors.age} 
            style={{ flex: 1 }} 
            keyboardType="numeric"
            placeholder="25"
          />
          <View style={{ width: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Giới tính</Text>
            <View style={styles.genderContainer}>
              {["Male", "Female"].map(g => (
                <TouchableOpacity 
                  key={g} 
                  style={[styles.genderBtn, form.gender === g && styles.genderBtnActive]} 
                  onPress={() => setForm({...form, gender: g})}
                >
                  <Text style={[styles.genderText, form.gender === g && styles.genderTextActive]}>
                    {g === "Male" ? "Nam" : "Nữ"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        <InputItem 
          label="Số điện thoại" 
          icon={<Phone size={18} color="#666"/>}
          value={form.phone} 
          onChange={(v) => setForm({...form, phone: v})} 
          error={errors.phone} 
          keyboardType="phone-pad"
          placeholder="0912345678"
        />

        <InputItem 
          label="Địa chỉ" 
          icon={<MapPin size={18} color="#666"/>}
          value={form.address} 
          onChange={(v) => setForm({...form, address: v})} 
          placeholder="Số 1, đường ABC, TP..."
        />

        {/* Thông tin chuyên môn */}
        <View style={styles.divider} />

        <InputItem 
          label="Chẩn đoán bệnh lý" 
          icon={<Activity size={18} color="#dc3545"/>}
          value={form.disease} 
          onChange={(v) => setForm({...form, disease: v})} 
          error={errors.disease} 
          placeholder="Ví dụ: Viêm họng cấp"
        />

        <InputItem 
          label="Bác sĩ phụ trách" 
          icon={<Stethoscope size={18} color="#17a2b8"/>}
          value={form.doctor} 
          onChange={(v) => setForm({...form, doctor: v})} 
          error={errors.doctor} 
          placeholder="Tên bác sĩ điều trị"
        />

        {/* Lựa chọn trạng thái */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Trạng thái hiện tại</Text>
          <View style={styles.statusRow}>
            {statusOptions.map((opt) => (
              <TouchableOpacity 
                key={opt.value} 
                style={[
                  styles.statusBtn, 
                  form.status === opt.value && { backgroundColor: opt.color, borderColor: opt.color }
                ]} 
                onPress={() => setForm({...form, status: opt.value})}
              >
                <Text style={[styles.statusText, form.status === opt.value && styles.textWhite]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Nút Submit */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
          <Text style={styles.submitBtnText}>LƯU HỒ SƠ BỆNH NHÂN</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Component con cho Input
const InputItem = ({ label, value, onChange, error, style, keyboardType, icon, placeholder }) => (
  <View style={[styles.inputGroup, style]}>
    <View style={styles.labelRow}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
    <TextInput 
      style={[styles.input, error && styles.inputError]} 
      value={value} 
      onChangeText={onChange} 
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor="#ccc"
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  flexContainer: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 12,
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    elevation: 2
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  inputGroup: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 14, color: '#444', fontWeight: '600', marginLeft: 6 },
  input: { 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa'
  },
  inputError: { borderColor: '#dc3545', backgroundColor: '#fff5f5' },
  errorText: { color: '#dc3545', fontSize: 12, marginTop: 4, fontWeight: '500' },
  genderContainer: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 8, padding: 4 },
  genderBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  genderBtnActive: { backgroundColor: '#fff', elevation: 2 },
  genderText: { color: '#888', fontWeight: '500' },
  genderTextActive: { color: '#007bff', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statusBtn: { 
    flex: 1, 
    paddingVertical: 10, 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    alignItems: 'center', 
    marginHorizontal: 3, 
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  statusText: { fontSize: 11, color: '#666', fontWeight: 'bold' },
  textWhite: { color: '#fff' },
  submitBtn: { 
    backgroundColor: '#007bff', 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 4,
    shadowColor: '#007bff',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 4 }
  },
  submitBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});

export default PatientFormScreen;