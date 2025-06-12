import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Tooltip,
  IconButton,
  LinearProgress,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

interface TopPatient {
  patient_id: number;
  patient_name: string;
  birth_date: string;
  insurance_policy: string;
  appointment_count: number;
}

const TopPatientsReport = () => {
  const [patients, setPatients] = useState<TopPatient[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:3000/top-patients/specialties');
      setSpecialties(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Error fetching specialties:', err);
      setError('Не удалось загрузить список специальностей');
    }
  };

  const fetchTopPatients = async () => {
    if (!selectedSpecialty) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/top-patients?specialty=${selectedSpecialty}`);
      setPatients(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Error fetching top patients:', err);
      setError('Не удалось загрузить данные о пациентах');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) {
      fetchTopPatients();
    } else {
      setPatients([]);
    }
  }, [selectedSpecialty]);

  const handleSpecialtyChange = (event: any) => {
    setSelectedSpecialty(event.target.value);
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD.MM.YYYY');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Tooltip title="Вернуться к списку отчетов">
          <IconButton onClick={() => navigate('/reports')}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">Топ пациентов по специальностям</Typography>
        <Tooltip title="Обновить данные">
          <IconButton onClick={fetchTopPatients} color="primary" disabled={!selectedSpecialty || loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel id="specialty-select-label">Специальность</InputLabel>
          <Select
            labelId="specialty-select-label"
            value={selectedSpecialty}
            label="Специальность"
            onChange={handleSpecialtyChange}
            disabled={loading}
          >
            <MenuItem value="">
              <em>Выберите специальность</em>
            </MenuItem>
            {specialties.map((specialty) => (
              <MenuItem key={specialty} value={specialty}>
                {specialty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary">
          {patients.length} пациентов в топе
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>ФИО пациента</TableCell>
              <TableCell>Дата рождения</TableCell>
              <TableCell>Страховой полис</TableCell>
              <TableCell>Количество посещений</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && !selectedSpecialty ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : patients.length > 0 ? (
              patients.map((patient, index) => (
                <TableRow key={patient.patient_id} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{patient.patient_name}</TableCell>
                  <TableCell>{formatDate(patient.birth_date)}</TableCell>
                  <TableCell>{patient.insurance_policy}</TableCell>
                  <TableCell>{patient.appointment_count}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {selectedSpecialty 
                    ? 'Нет данных для выбранной специальности' 
                    : 'Выберите специальность для просмотра топа пациентов'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TopPatientsReport;



















