import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';

const PatientsListPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/patients/with-combines');
        console.log(response.data); 
        setPatients(response.data);
        setLoading(false);
      } catch (error) {
        setError('Ошибка при загрузке данных');
        setLoading(false);
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Список пациентов
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ФИО пациента</TableCell>
              <TableCell>Дата рождения</TableCell>
              <TableCell>Страховой полис</TableCell>
              <TableCell>Паспорт</TableCell>
              <TableCell>Палата</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>Лечащий врач</TableCell>
              <TableCell>Диагноз</TableCell>
              <TableCell>Симптомы</TableCell>
              <TableCell>Дата поступления</TableCell>
              <TableCell>Дата выписки</TableCell>
              <TableCell>Аллергия к препаратам</TableCell>
              <TableCell>Препараты</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.patient_id}>
                <TableCell>{patient.patient_id}</TableCell>
                <TableCell>{patient.patient_full_name || '-'}</TableCell>
                <TableCell>{formatDate(patient.birth_date)}</TableCell>
                <TableCell>{patient.insurance_policy || '-'}</TableCell>
                <TableCell>{patient.passport || '-'}</TableCell>
                <TableCell>{patient.ward_number || '-'}</TableCell>
                <TableCell>{patient.department_name || '-'}</TableCell>
                <TableCell>{patient.doctor_full_name || '-'}</TableCell>
                <TableCell>{patient.diagnos || '-'}</TableCell>
                <TableCell>{patient.symptom || '-'}</TableCell>
                <TableCell>{formatDate(patient.admission_date)}</TableCell>
                <TableCell>{formatDate(patient.discharge_date)}</TableCell>
                <TableCell>{patient.allergy || '-'}</TableCell>
                <TableCell>{patient.preparation || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PatientsListPage;