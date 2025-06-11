import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper,
  IconButton, Tooltip, LinearProgress, 
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Refresh, ArrowBack } from '@mui/icons-material';
import axios from 'axios';

interface TopPatientData {
  patient_name: string;
  visit_count: number;
  specialty_name: string;
}

const TopPatientsReport = () => {
  const [data, setData] = useState<TopPatientData[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSpecialty) params.append('specialty', selectedSpecialty);
      
      const response = await axios.get(`http://localhost:3000/reports/top-patients?${params.toString()}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching top patients report:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:3000/reports/top-patients/specialties');
      setSpecialties(response.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  useEffect(() => {
    fetchSpecialties();
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) {
      fetchData();
    }
  }, [selectedSpecialty]);

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
          <IconButton onClick={fetchData} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <div style={{ flex: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Специальность</InputLabel>
            <Select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value as string)}
              label="Специальность"
            >
              <MenuItem value="">Все специальности</MenuItem>
              {specialties.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Пациент</TableCell>
              <TableCell>Количество посещений</TableCell>
              <TableCell>Специальность</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.patient_name}</TableCell>
                <TableCell>{row.visit_count}</TableCell>
                <TableCell>{row.specialty_name}</TableCell>
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

export default TopPatientsReport;