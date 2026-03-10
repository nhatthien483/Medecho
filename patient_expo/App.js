import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, ActivityIndicator, View } from 'react-native';
// Nhập khẩu từ thư viện mới thay vì 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import * as api from './api';
import PatientListScreen from './screens/PatientListScreen';
import PatientFormScreen from './screens/PatientFormScreen';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list');
  const [editingPatient, setEditingPatient] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getPatients();
      setPatients(res.data);
    } catch (err) {
      Alert.alert("Lỗi kết nối", "Kiểm tra Server Node.js và IP máy tính.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (formData) => {
    try {
      if (editingPatient) {
        await api.updatePatient(editingPatient._id, formData);
      } else {
        await api.createPatient(formData);
      }
      setCurrentView('list');
      loadData();
    } catch (err) {
      Alert.alert("Lỗi", "Không thể lưu dữ liệu.");
    }
  };

  return (
    // SafeAreaProvider phải bao bọc ngoài cùng
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : currentView === 'list' ? (
          <PatientListScreen 
            patients={patients} 
            onDelete={(id) => api.deletePatient(id).then(loadData)}
            onAdd={() => { setEditingPatient(null); setCurrentView('form'); }}
            onEdit={(p) => { setEditingPatient(p); setCurrentView('form'); }}
          />
        ) : (
          <PatientFormScreen 
            initialData={editingPatient}
            onSubmit={handleSave}
            onCancel={() => setCurrentView('list')}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});