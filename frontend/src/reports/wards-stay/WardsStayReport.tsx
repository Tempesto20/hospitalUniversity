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
  CircularProgress
} from '@mui/material';
import { ArrowBack, Refresh, Search, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

interface PatientWardInfo {
  ward_number: number;
  department_name: string;
  patient_name: string;
  admission_date: string;
  discharge_date: string | null;
  days_in_ward: number;
  doctor_name: string;
  specialty_name: string;
  patient_id: number;
}

const WardsStayReport = () => {
  const [data, setData] = useState<PatientWardInfo[]>([]);
  const [filteredData, setFilteredData] = useState<PatientWardInfo[]>([]);
  const [inputDays, setInputDays] = useState<string>('');
  const [appliedDays, setAppliedDays] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/wards-stay`);
      console.log(response.data);
      if (Array.isArray(response.data)) {
        setData(response.data);
        applyFilter(response.data, appliedDays);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (err) {
      console.error('Error fetching patients ward info:', err);
      setError('Не удалось загрузить данные');
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data: PatientWardInfo[], days: number | null) => {
    if (days === null) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(patient => patient.days_in_ward <= days);
      setFilteredData(filtered);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDays(e.target.value);
  };

  const handleSearchClick = () => {
    if (inputDays === '') {
      setAppliedDays(null);
      applyFilter(data, null);
    } else {
      const numValue = parseInt(inputDays);
      if (!isNaN(numValue) && numValue > 0) {
        setAppliedDays(numValue);
        applyFilter(data, numValue);
      }
    }
  };

  const handleClearClick = () => {
    setInputDays('');
    setAppliedDays(null);
    applyFilter(data, null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string | null) => {
    return dateString ? dayjs(dateString).format('DD.MM.YYYY') : 'Не выписан';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Tooltip title="Вернуться к списку отчетов">
          <IconButton onClick={() => navigate('/reports')}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">Информация о пациентах в палатах</Typography>
        <Tooltip title="Обновить данные">
          <IconButton onClick={fetchData} color="primary">
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
        <TextField
          label="Максимальное количество дней"
          type="number"
          value={inputDays}
          onChange={handleInputChange}
          size="small"
          inputProps={{ min: 1 }}
          sx={{ width: 250 }}
          placeholder="Все пациенты"
          InputProps={{
            endAdornment: inputDays && (
              <IconButton
                size="small"
                onClick={() => setInputDays('')}
                edge="end"
              >
                <Clear fontSize="small" />
              </IconButton>
            )
          }}
        />
        <Button
          variant="contained"
          startIcon={<Search />}
          onClick={handleSearchClick}
          disabled={loading}
        >
          Поиск
        </Button>
        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={handleClearClick}
          disabled={loading || (!inputDays && appliedDays === null)}
        >
          Очистить
        </Button>
        <Typography variant="body2" color="text.secondary">
          {filteredData.length} пациентов соответствуют критериям
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Номер палаты</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>ФИО пациента</TableCell>
              <TableCell>Дата поступления</TableCell>
              <TableCell>Дата выписки</TableCell>
              <TableCell>Дней в палате</TableCell>
              <TableCell>ФИО врача</TableCell>
              <TableCell>Специализация</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((patient) => (
                <TableRow key={patient.patient_id} hover>
                  <TableCell>{patient.ward_number}</TableCell>
                  <TableCell>{patient.department_name}</TableCell>
                  <TableCell>{patient.patient_name}</TableCell>
                  <TableCell>{formatDate(patient.admission_date)}</TableCell>
                  <TableCell>{formatDate(patient.discharge_date)}</TableCell>
                  <TableCell>{patient.days_in_ward}</TableCell>
                  <TableCell>{patient.doctor_name}</TableCell>
                  <TableCell>{patient.specialty_name}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  {data.length === 0 ? 'Нет данных для отображения' : 'Нет пациентов, соответствующих критериям'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WardsStayReport;