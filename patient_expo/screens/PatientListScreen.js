import React, { useState } from "react";
import { 
  View, Text, FlatList, TextInput, TouchableOpacity, 
  StyleSheet, Modal, ScrollView, Dimensions 
} from "react-native";
import { 
  Search, User, Phone, Activity, Plus, 
  Edit3, Trash2, X, MapPin, Stethoscope, Filter 
} from "lucide-react-native";

const { height } = Dimensions.get('window');

const PatientListScreen = ({ patients, onDelete, onEdit, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm)
  );

  const getStatusTheme = (status) => {
    switch (status) {
      case 'Recovered': return { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' };
      case 'Treating': return { bg: '#E3F2FD', text: '#1565C0', border: '#BBDEFB' };
      default: return { bg: '#FFF8E1', text: '#F57F17', border: '#FFECB3' };
    }
  };

  const renderItem = ({ item }) => {
    const theme = getStatusTheme(item.status);
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        style={styles.card} 
        onPress={() => setSelectedPatient(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.nameSection}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientId}>ID: {item._id.slice(-6).toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: theme.bg, borderColor: theme.border }]}>
            <Text style={[styles.statusText, { color: theme.text }]}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRowSmall}>
            <Activity size={14} color="#747d8c" />
            <Text style={styles.infoTextSmall}>{item.disease}</Text>
          </View>
          <View style={styles.infoRowSmall}>
            <Phone size={14} color="#747d8c" />
            <Text style={styles.infoTextSmall}>{item.phone}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.doctorInfo}>
            <Stethoscope size={14} color="#007bff" />
            <Text style={styles.doctorName}>BS. {item.doctor}</Text>
          </View>
          <View style={styles.actionGroup}>
            <TouchableOpacity onPress={() => onEdit(item)} style={styles.actionBtn}>
              <Edit3 size={18} color="#007bff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(item._id)} style={styles.actionBtn}>
              <Trash2 size={18} color="#eb4d4b" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.headerSection}>
        <View style={styles.searchWrapper}>
          <Search size={20} color="#a4b0be" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bệnh nhân..."
            placeholderTextColor="#a4b0be"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color="#007bff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <User size={60} color="#dfe4ea" />
            <Text style={styles.emptyText}>Chưa có bệnh nhân nào</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={onAdd}>
        <Plus size={30} color="#fff" />
      </TouchableOpacity>

      {/* Detail Modal (Bottom Sheet Style) */}
      <Modal visible={!!selectedPatient} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIndicator} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chi tiết hồ sơ</Text>
              <TouchableOpacity onPress={() => setSelectedPatient(null)}>
                <X size={24} color="#2f3542" />
              </TouchableOpacity>
            </View>

            {selectedPatient && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailCard}>
                  <DetailItem icon={<User size={20} color="#007bff"/>} label="Họ tên" value={selectedPatient.name} isTitle />
                  <DetailItem icon={<Activity size={20} color="#ffa502"/>} label="Tuổi/Giới tính" value={`${selectedPatient.age} tuổi - ${selectedPatient.gender}`} />
                  <DetailItem icon={<Phone size={20} color="#2ed573"/>} label="Liên hệ" value={selectedPatient.phone} />
                  <DetailItem icon={<MapPin size={20} color="#ff4757"/>} label="Địa chỉ" value={selectedPatient.address} />
                  
                  <View style={styles.diagnosisBox}>
                    <Text style={styles.diagnosisLabel}>Chẩn đoán chuyên môn</Text>
                    <Text style={styles.diagnosisValue}>{selectedPatient.disease}</Text>
                    <View style={styles.doctorBadge}>
                      <Text style={styles.doctorLabel}>BS. Phụ trách: {selectedPatient.doctor}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.closeBtnLarge} 
                  onPress={() => setSelectedPatient(null)}
                >
                  <Text style={styles.closeBtnText}>Đóng</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const DetailItem = ({ icon, label, value, isTitle }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailIconBox}>{icon}</View>
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, isTitle && styles.titleText]}>{value || "---"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f2f6" },
  headerSection: { padding: 20, backgroundColor: '#fff', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
  searchWrapper: { flexDirection: 'row', backgroundColor: '#f1f2f6', borderRadius: 15, alignItems: 'center', paddingHorizontal: 15 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#2f3542' },
  filterBtn: { padding: 5 },
  listContent: { padding: 20, paddingBottom: 100 },
  card: { 
    backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 15,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#2f3542' },
  patientId: { fontSize: 12, color: '#a4b0be', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  cardBody: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f2f6' },
  infoRowSmall: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoTextSmall: { marginLeft: 8, color: '#57606f', fontSize: 14 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  doctorInfo: { flexDirection: 'row', alignItems: 'center' },
  doctorName: { marginLeft: 6, fontSize: 13, color: '#007bff', fontWeight: '600' },
  actionGroup: { flexDirection: 'row' },
  actionBtn: { marginLeft: 15, padding: 5 },
  fab: { 
    position: 'absolute', right: 25, bottom: 25, backgroundColor: '#007bff', 
    width: 65, height: 65, borderRadius: 20, justifyContent: 'center', alignItems: 'center', 
    elevation: 8, shadowColor: '#007bff', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 4 }
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, 
    maxHeight: height * 0.85, padding: 25 
  },
  modalIndicator: { width: 40, height: 5, backgroundColor: '#dfe4ea', borderRadius: 3, alignSelf: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#2f3542' },
  detailCard: { marginTop: 10 },
  detailRow: { flexDirection: 'row', marginBottom: 18, alignItems: 'center' },
  detailIconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#f1f2f6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  detailLabel: { fontSize: 12, color: '#a4b0be', textTransform: 'uppercase', letterSpacing: 1 },
  detailValue: { fontSize: 16, color: '#2f3542', marginTop: 2 },
  titleText: { fontWeight: 'bold', fontSize: 18 },
  diagnosisBox: { 
    backgroundColor: '#fff5f5', padding: 20, borderRadius: 20, marginTop: 10,
    borderWidth: 1, borderColor: '#ffcfcf' 
  },
  diagnosisLabel: { fontSize: 12, color: '#ff4757', fontWeight: 'bold', marginBottom: 5 },
  diagnosisValue: { fontSize: 18, fontWeight: 'bold', color: '#2f3542' },
  doctorBadge: { backgroundColor: '#fff', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 12 },
  doctorLabel: { fontSize: 13, color: '#007bff', fontWeight: 'bold' },
  closeBtnLarge: { backgroundColor: '#2f3542', padding: 16, borderRadius: 15, alignItems: 'center', marginTop: 25 },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyBox: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 10, color: '#a4b0be', fontSize: 16 }
});

export default PatientListScreen;