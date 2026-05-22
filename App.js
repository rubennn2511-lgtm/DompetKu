import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';

export default function App() {
  // 1. STATE MANAGEMENT (Input Handling)
  const [inputDeskripsi, setInputDeskripsi] = useState('');
  const [inputNominal, setInputNominal] = useState('');

  // 2. STATE MANAGEMENT (Array Object dibuat KOSONG agar saldo awal otomatis 0)
  const [transaksi, setTransaksi] = useState([]);

  // 3. LOGIKA HITUNG TOTAL SALDO (Menggunakan reduce sesuai Clue)
  const totalSaldo = transaksi.reduce((sum, item) => {
    if (item.tipe === 'masuk') {
      return sum + item.nominal;
    } else {
      return sum - item.nominal;
    }
  }, 0); // Nilai awal akumulator adalah 0

  // 4. FUNGSI UNTUK MENAMBAH TRANSAKSI BARU
  const tambahTransaksi = (tipeTransaksi) => {
    // Validasi input wajib diisi
    if (inputDeskripsi.trim() === '' || inputNominal.trim() === '') {
      Alert.alert('Error', 'Deskripsi dan Nominal wajib diisi!');
      return;
    }

    const nominalAngka = parseInt(inputNominal, 10);
    // Validasi nominal harus angka positif
    if (isNaN(nominalAngka) || nominalAngka <= 0) {
      Alert.alert('Error', 'Nominal harus berupa angka yang valid!');
      return;
    }

    // Membuat object data baru berdasarkan input user
    const dataBaru = {
      id: Date.now().toString(), // ID unik berbasis timestamp string
      ket: inputDeskripsi,
      nominal: nominalAngka,
      tipe: tipeTransaksi // 'masuk' or 'keluar'
    };

    // Memasukkan data baru ke baris paling atas list state array
    setTransaksi([dataBaru, ...transaksi]);

    // Mengosongkan form input setelah disubmit
    setInputDeskripsi('');
    setInputNominal('');
  };

  return (
    <View style={styles.container}>
      {/* 1. HEADER SALDO (Otomatis Rp 0 saat awal karena state transaksi kosong) */}
      <View style={styles.headerBox}>
        <Text style={styles.headerLabel}>Total Saldo Saat Ini</Text>
        <Text style={[styles.headerValue, totalSaldo < 0 && styles.textMerah]}>
          Rp {totalSaldo.toLocaleString('id-ID')}
        </Text>
      </View>

      {/* 2. FORM INPUT TRANSAKSI */}
      <View style={styles.formBox}>
        <Text style={styles.formTitle}>Catat Transaksi Baru</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Deskripsi (Contoh: Uang Bulanan)"
          value={inputDeskripsi}
          onChangeText={(teks) => setInputDeskripsi(teks)}
        />

        <TextInput
          style={styles.input}
          placeholder="Nominal (Contoh: 50000)"
          value={inputNominal}
          onChangeText={(teks) => setInputNominal(teks)}
          keyboardType="numeric" // Membantu memunculkan numpad keyboard pada HP
        />

        {/* Baris Tombol Aksi Pemasukan & Pengeluaran */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.btn, styles.btnMasuk]} 
            onPress={() => tambahTransaksi('masuk')}
          >
            <Text style={styles.btnText}>Pemasukan</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, styles.btnKeluar]} 
            onPress={() => tambahTransaksi('keluar')}
          >
            <Text style={styles.btnText}>Pengeluaran</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. LIST HISTORY (RIWAYAT) */}
      <Text style={styles.historyTitle}>List History (Riwayat)</Text>
      
      <FlatList
        data={transaksi}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemKet}>{item.ket}</Text>
            {/* 4. STYLING & LOGIKA WARNA */}
            <Text style={[
              styles.itemNominal, 
              item.tipe === 'masuk' ? styles.textHijau : styles.textMerah
            ]}>
              {item.tipe === 'masuk' ? '+' : '-'} Rp {item.nominal.toLocaleString('id-ID')}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
        // Muncul otomatis karena data transaksi di-set [] di awal
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada riwayat transaksi.</Text>
        }
      />
    </View>
  );
}

// STYLING & FLEXBOX LAYOUT
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 60,
  },
  headerBox: {
    backgroundColor: '#0F172A',
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  headerLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  headerValue: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 6,
  },
  formBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
    color: '#334155',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnMasuk: {
    backgroundColor: '#22C55E', // Warna Hijau Pemasukan
    marginRight: 6,
  },
  btnKeluar: {
    backgroundColor: '#EF4444', // Warna Merah Pengeluaran
    marginLeft: 6,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemKet: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  itemNominal: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 20,
  },
  textHijau: {
    color: '#22C55E',
  },
  textMerah: {
    color: '#EF4444',
  },
});