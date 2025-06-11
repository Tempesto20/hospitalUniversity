import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

const ReportsPage = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AssessmentIcon fontSize="large" />
          Медицинские отчеты
        </Typography>
        <List>
          <ListItem component={Link} to="/reports/complaints" sx={{ borderRadius: 1, mb: 1 }}>
            <ListItemText 
              primary="Среднее количество пациентов по жалобам" 
              secondary="Анализ частоты обращений по симптомам" 
            />
          </ListItem>
          <ListItem component={Link} to="/reports/top-patients" sx={{ borderRadius: 1, mb: 1 }}>
            <ListItemText 
              primary="Топ пациентов по специальностям" 
              secondary="Самые частые посетители по направлениям" 
            />
          </ListItem>
          <ListItem component={Link} to="/reports/wards-stay" sx={{ borderRadius: 1 }}>
            <ListItemText 
              primary="Палаты по длительности пребывания" 
              secondary="Анализ занятости палат" 
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default ReportsPage;