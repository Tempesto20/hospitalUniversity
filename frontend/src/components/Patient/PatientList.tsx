import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { PatientData } from '../../api/types';
import { 
  fetchCombinePatients,
  createPatient, 
  updatePatient, 
  deletePatient 
} from '../../api/api';

// PatientForm component
type PatientFormData = Omit<PatientData, 'patient_id'> & {
  discharge_date?: string;
};

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (patient: PatientData) => void;
  patient: PatientData | null;
}

const PatientForm: React.FC<PatientFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  patient 
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [formData, setFormData] = useState<PatientFormData>({
    patient_full_name: '',
    birth_date: today,
    insurance_policy: '',
    passport: '',
    admission_date: today,
    discharge_date: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (patient) {
      setFormData({
        patient_full_name: patient.patient_full_name,
        birth_date: format(parseISO(patient.birth_date), 'yyyy-MM-dd'),
        insurance_policy: patient.insurance_policy,
        passport: patient.passport,
        admission_date: format(parseISO(patient.admission_date), 'yyyy-MM-dd'),
        discharge_date: patient.discharge_date 
          ? format(parseISO(patient.discharge_date), 'yyyy-MM-dd')
          : ''
      });
    } else {
      setFormData({
        patient_full_name: '',
        birth_date: today,
        insurance_policy: '',
        passport: '',
        admission_date: today,
        discharge_date: ''
      });
    }
  }, [patient, today]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patient_full_name?.trim()) {
      newErrors.patient_full_name = 'Full name is required';
    }
    
    if (!formData.insurance_policy?.match(/^[А-Я]{2}[0-9]{4}[А-Я]$/)) {
      newErrors.insurance_policy = 'Invalid insurance policy format (XX9999X)';
    }
    
    if (!formData.passport?.match(/^[0-9]{2} [0-9]{2} [0-9]{6}$/)) {
      newErrors.passport = 'Invalid passport format (00 00 000000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const submitData: PatientData = {
        ...(patient?.patient_id ? { patient_id: patient.patient_id } : {}),
        ...formData,
        discharge_date: formData.discharge_date || null
      } as PatientData;
      
      onSubmit(submitData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {patient ? 'Редактировать данные' : 'Добавить пациента'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 2, display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
          <TextField
            fullWidth
            label="ФИО пациента"
            name="patient_full_name"
            value={formData.patient_full_name}
            onChange={handleChange}
            error={!!errors.patient_full_name}
            helperText={errors.patient_full_name}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Дата рождения"
            type="date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Полис"
            name="insurance_policy"
            value={formData.insurance_policy}
            onChange={handleChange}
            error={!!errors.insurance_policy}
            helperText={errors.insurance_policy}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Пасспорт"
            name="passport"
            value={formData.passport}
            onChange={handleChange}
            error={!!errors.passport}
            helperText={errors.passport}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Дата поступления"
            type="date"
            name="admission_date"
            value={formData.admission_date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Дата выписки"
            type="date"
            name="discharge_date"
            value={formData.discharge_date}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Назад</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {patient ? 'Редактировать' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// PatientItem component
interface PatientItemProps {
  patient: PatientData;
  onEdit: (patient: PatientData) => void;
  onDelete: (id: number) => void;
}

const PatientItem: React.FC<PatientItemProps> = ({ 
  patient, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return format(parseISO(dateString), 'dd.MM.yyyy');
  };

  return (
    <TableRow>
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
      <TableCell>
        <IconButton onClick={() => onEdit(patient)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(patient.patient_id!)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// PatientList component
const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const { data } = await fetchCombinePatients();
        setPatients(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patients');
        setLoading(false);
        console.error(err);
      }
    };

    loadPatients();
  }, []);

  const handleAddClick = () => {
    setCurrentPatient(null);
    setOpenForm(true);
  };

  const handleEditClick = (patient: PatientData) => {
    setCurrentPatient(patient);
    setOpenForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setPatientToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (patientToDelete) {
      try {
        await deletePatient(patientToDelete);
        setPatients(patients.filter(p => p.patient_id !== patientToDelete));
        setOpenDeleteDialog(false);
      } catch (err) {
        setError('Failed to delete patient');
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (patient: PatientData) => {
    try {
      if (currentPatient?.patient_id) {
        const { data: updatedPatient } = await updatePatient(
          currentPatient.patient_id, 
          patient
        );
        setPatients(patients.map(p => 
          p.patient_id === currentPatient.patient_id ? updatedPatient : p
        ));
      } else {
        const { data: newPatient } = await createPatient(patient);
        setPatients([...patients, newPatient]);
      }
      setOpenForm(false);
    } catch (err) {
      setError('Failed to save patient');
      console.error(err);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h4">Пациенты</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Добавить Пациента
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер пациента</TableCell>
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
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map(patient => (
              <PatientItem 
                key={patient.patient_id}
                patient={patient}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <PatientForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        patient={currentPatient}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить пациента?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Назад</Button>
          <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientList;