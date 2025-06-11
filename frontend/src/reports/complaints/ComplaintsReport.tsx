import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, TextField, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper,
  IconButton, Tooltip, LinearProgress
} from '@mui/material';
import { Refresh, ArrowBack } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';

interface ComplaintData {
  doctor_name: string;
  specialty_name: string;
  month_year: string;
  patient_name: string;
  complaint: string;
  appointment_date: string;
}

const ComplaintsReport = () => {
  const [data, setData] = useState<ComplaintData[]>([]);
  const [keyword, setKeyword] = useState('');
  const [month, setMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (month) params.append('month', month);
      
      const response = await axios.get(`http://localhost:3000/reports/complaints?${params.toString()}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching complaints report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Tooltip title="Вернуться к списку отчетов">
          <IconButton onClick={() => navigate('/reports')}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">Отчет по жалобам пациентов</Typography>
        <Tooltip title="Обновить данные">
          <IconButton onClick={fetchData} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <TextField
            fullWidth
            label="Поиск по жалобе"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            size="small"
          />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <TextField
            fullWidth
            label="Фильтр по месяцу"
            type="month"
            InputLabelProps={{ shrink: true }}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            size="small"
          />
        </div>
        <div style={{ flex: 1, maxWidth: '200px' }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={fetchData}
            sx={{ height: '40px' }}
          >
            Применить
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Врач</TableCell>
              <TableCell>Специальность</TableCell>
              <TableCell>Месяц</TableCell>
              <TableCell>Пациент</TableCell>
              <TableCell>Жалоба</TableCell>
              <TableCell>Дата приема</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.doctor_name}</TableCell>
                <TableCell>{row.specialty_name}</TableCell>
                <TableCell>{row.month_year}</TableCell>
                <TableCell>{row.patient_name}</TableCell>
                <TableCell>{row.complaint}</TableCell>
                <TableCell>{dayjs(row.appointment_date).format('DD.MM.YYYY')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {data.length === 0 && !loading && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          Нет данных для отображения
        </Typography>
      )}
    </Box>
  );
};

export default ComplaintsReport;