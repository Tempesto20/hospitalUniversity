import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Box, Typography
} from '@mui/material';
import { Add } from '@mui/icons-material';
import AppointmentForm from './AppointmentForm';
import AppointmentItem from './AppointmentItem';
import { fetchAppointments, createAppointment, updateAppointment, deleteAppointment } from '../../api/api';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const { data } = await fetchAppointments();
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить данные о приемах');
        setLoading(false);
        console.error(err);
      }
    };

    loadAppointments();
  }, []);

  const handleAddClick = () => {
    setCurrentAppointment(null);
    setOpenForm(true);
  };

  const handleEditClick = (appointment: any) => {
    setCurrentAppointment(appointment);
    setOpenForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setAppointmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (appointmentToDelete) {
      try {
        await deleteAppointment(appointmentToDelete);
        setAppointments(appointments.filter(a => a.appointment_id !== appointmentToDelete));
        setOpenDeleteDialog(false);
      } catch (err) {
        setError('Не удалось удалить прием');
        console.error(err);
      }
    }
  };

const handleFormSubmit = async (appointmentData: any) => {
  try {
    const payload = {
      ...appointmentData,
      patient_id: Number(appointmentData.patient_id),
      doctor_id: Number(appointmentData.doctor_id),
      ward_id: appointmentData.ward_id ? Number(appointmentData.ward_id) : null
    };

    if (currentAppointment?.appointment_id) {
      await updateAppointment(currentAppointment.appointment_id, payload);
    } else {
      await createAppointment(payload);
    }
    
    // Обновляем список
    const { data } = await fetchAppointments();
    setAppointments(data);
    setOpenForm(false);
  } catch (err) {
    setError('Не удалось сохранить прием');
    console.error('Ошибка при сохранении:', err);
  }
};

  if (loading) return <Typography>Загрузка данных...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h4">Приемы пациентов</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Новый прием
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Пациент</TableCell>
              <TableCell>Палата</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Врач</TableCell>
              <TableCell>Симптомы</TableCell>
              <TableCell>Диагноз</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map(appointment => (
              <AppointmentItem 
                key={appointment.appointment_id}
                appointment={appointment}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AppointmentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        appointment={currentAppointment}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить этот прием? Это действие нельзя отменить.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentList;