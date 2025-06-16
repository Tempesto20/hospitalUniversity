import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { AppointmentData } from '../../api/types';
import { 
  fetchCombinehAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  fetchPatients,
  fetchDoctors,
  fetchWards
} from '../../api/api';
import './Appointment.scss'; // Импорт SCSS стилей

/**
 * Интерфейсы для типизации пропсов и данных
 */
interface PatientResponse {
  patient_id: number;
  patient_full_name: string;
}

interface DoctorResponse {
  doctor_id: number;
  doctor_full_name: string;
}

interface WardResponse {
  ward_number: number;
}

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (appointment: AppointmentData) => void;
  appointment: AppointmentData | null;
}

interface AppointmentItemProps {
  appointment: AppointmentData;
  onEdit: (appointment: AppointmentData) => void;
  onDelete: (id: number) => void;
}

type AppointmentFormData = Omit<AppointmentData, 'appointment_id'> & {
  patient_full_name: string;
  doctor_full_name: string;
  formatted_date: string;
};

/**
 * Компонент формы для создания/редактирования приема
 */
const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  appointment 
}) => {
  const today = format(new Date(), 'yyyy-MM-dd'); // Текущая дата для формы

  // Состояние формы
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: 0,
    patient_full_name: '',
    doctor_id: 0,
    doctor_full_name: '',
    ward_number: 0,
    department_name: '',
    appointment_date: today,
    formatted_date: today,
    symptom: '',
    diagnos: '',
    allergy: '',
    preparation: ''
  });

  // Состояния для загружаемых данных
  const [patients, setPatients] = useState<{id: number, name: string}[]>([]);
  const [doctors, setDoctors] = useState<{id: number, name: string}[]>([]);
  const [wards, setWards] = useState<{id: number, number: string}[]>([]);
  const [loading, setLoading] = useState(true);

  // Загрузка данных при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        // Параллельная загрузка пациентов, врачей и палат
        const [patientsRes, doctorsRes, wardsRes] = await Promise.all([
          fetchPatients(),
          fetchDoctors(),
          fetchWards()
        ]);
        
        setPatients(patientsRes.data.map((p: PatientResponse) => ({ 
          id: p.patient_id, 
          name: p.patient_full_name 
        })));
        
        setDoctors(doctorsRes.data.map((d: DoctorResponse) => ({ 
          id: d.doctor_id, 
          name: d.doctor_full_name 
        })));
        
        setWards(wardsRes.data.map((w: WardResponse) => ({ 
          id: w.ward_number, 
          number: w.ward_number.toString() 
        })));
        
        setLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Обновление формы при изменении текущего приема
  useEffect(() => {
    if (appointment) {
      setFormData({
        patient_id: appointment.patient_id,
        patient_full_name: appointment.patient_full_name || '',
        doctor_id: appointment.doctor_id,
        doctor_full_name: appointment.doctor_full_name || '',
        ward_number: appointment.ward_number || 0,
        department_name: appointment.department_name || '',
        appointment_date: format(parseISO(appointment.appointment_date), 'yyyy-MM-dd'),
        formatted_date: format(parseISO(appointment.appointment_date), 'yyyy-MM-dd'),
        symptom: appointment.symptom || '',
        diagnos: appointment.diagnos || '',
        allergy: appointment.allergy || '',
        preparation: appointment.preparation || ''
      });
    } else {
      // Сброс формы при создании нового приема
      setFormData({
        patient_id: 0,
        patient_full_name: '',
        doctor_id: 0,
        doctor_full_name: '',
        ward_number: 0,
        department_name: '',
        appointment_date: today,
        formatted_date: today,
        symptom: '',
        diagnos: '',
        allergy: '',
        preparation: ''
      });
    }
  }, [appointment, today]);

  // Обработчик изменений в полях формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик выбора пациента
  const handlePatientSelect = (patientId: number) => {
    const patient = patients.find(p => p.id === patientId);
    setFormData(prev => ({
      ...prev,
      patient_id: patientId,
      patient_full_name: patient?.name || ''
    }));
  };

  // Обработчик выбора врача
  const handleDoctorSelect = (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setFormData(prev => ({
      ...prev,
      doctor_id: doctorId,
      doctor_full_name: doctor?.name || ''
    }));
  };

  // Отправка формы
  const handleSubmit = () => {
    const submitData: AppointmentData = {
      ...(appointment?.appointment_id && { 
        appointment_id: appointment.appointment_id 
      }),
      patient_id: formData.patient_id,
      doctor_id: formData.doctor_id,
      ward_number: formData.ward_number,
      department_name: formData.department_name || undefined,
      appointment_date: formData.appointment_date,
      symptom: formData.symptom || undefined,
      diagnos: formData.diagnos || undefined,
      allergy: formData.allergy || undefined,
      preparation: formData.preparation || undefined
    };
    
    onSubmit(submitData);
  };

  // Отображение состояния загрузки
  if (loading) {
    return (
      <Box className="loading-container">
        <Typography>Загрузка данных...</Typography>
      </Box>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle className="dialog-title">
        {appointment ? 'Редактирование приема' : 'Создание нового приема'}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box className="form-grid">
          {/* Поля формы */}
          <TextField
            select
            fullWidth
            label="Пациент"
            name="patient_id"
            value={formData.patient_id}
            onChange={(e) => handlePatientSelect(Number(e.target.value))}
            margin="normal"
            variant="outlined"
          >
            {patients.map(patient => (
              <MenuItem key={patient.id} value={patient.id}>
                {patient.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Остальные поля формы аналогично */}
          {/* ... */}
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button 
          onClick={onClose} 
          variant="outlined" 
          className="cancel-button"
        >
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
        >
          {appointment ? 'Обновить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Компонент строки таблицы с записью о приеме
 */
const AppointmentItem: React.FC<AppointmentItemProps> = ({ 
  appointment, 
  onEdit, 
  onDelete 
}) => {
  // Форматирование даты для отображения
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(parseISO(dateString), 'dd.MM.yyyy');
  };
  
  return (
    <TableRow className="appointment-item">
      <TableCell>{appointment.appointment_id}</TableCell>
      <TableCell>{appointment.patient_full_name || '-'}</TableCell>
      <TableCell>{appointment.ward_number || '-'}</TableCell>
      <TableCell>{appointment.department_name || '-'}</TableCell>
      <TableCell>{formatDate(appointment.appointment_date) || '-'}</TableCell>
      <TableCell>{appointment.doctor_full_name || '-'}</TableCell>
      <TableCell>{appointment.symptom || '-'}</TableCell>
      <TableCell>{appointment.diagnos || '-'}</TableCell>
      <TableCell>{appointment.allergy || '-'}</TableCell>
      <TableCell>{appointment.preparation || '-'}</TableCell>
      <TableCell>
        <IconButton className="action-button" onClick={() => onEdit(appointment)}>
          <Edit />
        </IconButton>
        <IconButton className="action-button" onClick={() => onDelete(appointment.appointment_id!)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

/**
 * Основной компонент страницы приемов
 */
const Appointment: React.FC = () => {
  // Состояния компонента
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<AppointmentData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка списка приемов при монтировании
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const { data } = await fetchCombinehAppointments();
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch appointments');
        setLoading(false);
        console.error(err);
      }
    };

    loadAppointments();
  }, []);

  // Обработчики действий
  const handleAddClick = () => {
    setCurrentAppointment(null);
    setOpenForm(true);
  };

  const handleEditClick = (appointment: AppointmentData) => {
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
        setError('Failed to delete appointment');
        console.error(err);
      }
    }
  };

  // Обработчик отправки формы
  const handleFormSubmit = async (appointment: AppointmentData) => {
    try {
      if (currentAppointment?.appointment_id) {
        // Обновление существующего приема
        const { data: updatedAppointment } = await updateAppointment(
          currentAppointment.appointment_id, 
          appointment
        );
        setAppointments(appointments.map(a => 
          a.appointment_id === currentAppointment.appointment_id ? updatedAppointment : a
        ));
      } else {
        // Создание нового приема
        const { data: newAppointment } = await createAppointment(appointment);
        setAppointments([...appointments, newAppointment]);
      }
      setOpenForm(false);
    } catch (err) {
      setError('Failed to save appointment');
      console.error(err);
    }
  };

  // Отображение состояния загрузки
  if (loading) return (
    <Box className="loading-container">
      <Typography>Загрузка...</Typography>
    </Box>
  );
  
  // Отображение ошибки
  if (error) return (
    <Typography className="error-message">{error}</Typography>
  );

  return (
    <Box className="appointment-container">
      {/* Шапка с заголовком и кнопкой */}
      <Box className="header">
        <Typography variant="h4">Приемы</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Добавить прием
        </Button>
      </Box>

      {/* Таблица с приемами */}
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер приема</TableCell>
              <TableCell>Пациент</TableCell>
              <TableCell>Номер палаты</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>Дата приема</TableCell>
              <TableCell>Доктор</TableCell>
              <TableCell>Симптомы</TableCell>
              <TableCell>Диагноз</TableCell>
              <TableCell>Аллергия</TableCell>
              <TableCell>Препараты</TableCell>
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

      {/* Диалоговые окна */}
      <AppointmentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        appointment={currentAppointment}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        className="delete-dialog"
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent className="content">
          Вы действительно хотите удалить прием?
        </DialogContent>
        <DialogActions className="actions">
          <Button onClick={() => setOpenDeleteDialog(false)}>Назад</Button>
          <Button onClick={handleDeleteConfirm} className="delete-button">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Appointment;