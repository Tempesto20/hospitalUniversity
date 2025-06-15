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
  LinearProgress
} from '@mui/material';
import { ArrowBack, Refresh, Search, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ComplaintStatistic {
  patient_count: number;
  complaint_text: string;
  specialty_name: string;
  doctor_name: string;
  month_year: string;
}

const ComplaintsReport = () => {
  const [data, setData] = useState<ComplaintStatistic[]>([]);
  const [filteredData, setFilteredData] = useState<ComplaintStatistic[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async (searchKeyword?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/complaints`, {
        params: { keyword: searchKeyword }
      });
      if (Array.isArray(response.data)) {
        setData(response.data);
        console.log(response.data);
        setFilteredData(response.data);
      } else {
        setData([]);
        setFilteredData([]);
      }
    } catch (err) {
      console.error('Error fetching complaints statistics:', err);
      setError('Не удалось загрузить данные');
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    fetchData(keyword);
  };

  const handleClearClick = () => {
    setKeyword('');
    fetchData('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
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
        <Typography variant="h4">Статистика жалоб пациентов</Typography>
        <Tooltip title="Обновить данные">
          <IconButton onClick={() => fetchData(keyword)} color="primary">
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
          label="Ключевое слово в жалобе"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          sx={{ width: 350 }}
          placeholder="Введите текст для поиска"
          InputProps={{
            endAdornment: keyword && (
              <IconButton
                size="small"
                onClick={() => setKeyword('')}
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
          disabled={loading}
        >
          Очистить
        </Button>
        <Typography variant="body2" color="text.secondary">
          {filteredData.length} записей найдено
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Специальность врача</TableCell>
              <TableCell>ФИО врача</TableCell>
              <TableCell>Месяц и год</TableCell>
              <TableCell>Текст жалобы</TableCell>
              <TableCell>Количество жалоб</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {filteredData.map((stat, index) => (
                <TableRow key={index} hover>
                  <TableCell>{stat.specialty_name}</TableCell>
                  <TableCell>{stat.doctor_name}</TableCell>
                  <TableCell>{stat.month_year}</TableCell>
                  <TableCell>{stat.complaint_text || '-'}</TableCell>
                  <TableCell>{stat.patient_count}</TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              ))
              }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ComplaintsReport;