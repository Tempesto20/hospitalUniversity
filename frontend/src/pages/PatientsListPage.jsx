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
        const response = await axios.get('/appointments/with-appointments');
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

  // const formatDate = (dateString) => {
  //   if (!dateString) return '-';
  //   try {
  //     return new Date(dateString).toLocaleDateString('ru-RU');
  //   } catch {
  //     return dateString;
  //   }
  // };

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
        ТЕСТ приемы
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер приема</TableCell>
              <TableCell>Пациен</TableCell>
              <TableCell>Номер палаты</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>Дата приема</TableCell>
              <TableCell>Доктор</TableCell>
              <TableCell>Сиптомы</TableCell>
              <TableCell>Диагноз</TableCell>
              <TableCell>Аллергия</TableCell>
              <TableCell>Препараты</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((appointment) => (
              <TableRow key={appointment.appointment_id}>
                <TableCell>{appointment.appointment_id}</TableCell>
                <TableCell>{appointment.patient_full_name || '-'}</TableCell>
                <TableCell>{appointment.ward_number || '-'}</TableCell>
                <TableCell>{appointment.department_name || '-'}</TableCell>
                <TableCell>{appointment.appointment_date || '-'}</TableCell>
                <TableCell>{appointment.doctor_full_name || '-'}</TableCell>
                <TableCell>{appointment.symptom || '-'}</TableCell>
                <TableCell>{appointment.diagnos || '-'}</TableCell>
                <TableCell>{appointment.allergy || '-'}</TableCell>
                <TableCell>{appointment.preparation || '-' }</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PatientsListPage;