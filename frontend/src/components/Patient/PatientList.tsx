import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Box, Typography, Snackbar, Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import PatientForm from './PatientForm';
import PatientItem from './PatientItem';
import { PatientData } from '../../api/types';
import { 
  fetchCombinePatients,
  createPatient, 
  updatePatient, 
  deletePatient 
} from '../../api/api';
import { format, parseISO } from 'date-fns';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatDateForServer = (dateString: string) => {
    return format(parseISO(dateString), "yyyy-MM-dd");
  };

  const loadPatients = async () => {
    try {
      const { data } = await fetchCombinePatients();
      setPatients(data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка загрузки пациентов');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
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
        await loadPatients();
        setOpenDeleteDialog(false);
        setSuccessMessage('Пациент успешно удалён');
      } catch (err) {
        setError('Ошибка удаления пациента');
        console.error(err);
      }
    }
  };


  

// const handleFormSubmit = async (patient: PatientData) => {
//   try {
//     const patientPayload = {
//       patient_full_name: patient.patient_full_name,
//       full_name: patient.patient_full_name, // Добавляем поле для бэкенда
//       birth_date: patient.birth_date,
//       insurance_policy: patient.insurance_policy,
//       passport: patient.passport,
//       admission_date: patient.admission_date,
//       discharge_date: patient.discharge_date || null,
//       doctor_id: patient.doctor_id || null,
//       ward_number: patient.ward_number || null,
//       diagnos: patient.diagnos || '',
//       symptom: patient.symptom || '',
//       allergy: patient.allergy || '',
//       preparation: patient.preparation || ''
//     };

//     if (currentPatient?.patient_id) {
//       await updatePatient(currentPatient.patient_id, patientPayload);
//       setSuccessMessage('Данные пациента успешно обновлены');
//     } else {
//       await createPatient(patientPayload);
//       setSuccessMessage('Пациент успешно создан');
//     }
//     setOpenForm(false);
//     await loadPatients();
//   } catch (err) {
//     setError('Ошибка сохранения пациента: ' + (err as Error).message);
//     console.error('Ошибка сохранения:', err);
//   }
// };





const handleFormSubmit = async (patient: PatientData) => {
  try {
    const apiPayload = {
      full_name: patient.patient_full_name,
      birth_date: patient.birth_date,
      insurance_policy: patient.insurance_policy,
      passport: patient.passport,
      admission_date: patient.admission_date,
      discharge_date: patient.discharge_date || null,
      doctor_id: patient.doctor_id || null,
      ward_number: patient.ward_number || null,
      diagnos: patient.diagnos || '',
      symptom: patient.symptom || '',
      allergy: patient.allergy || '',
      preparation: patient.preparation || ''
    };

    if (currentPatient?.patient_id) {
      await updatePatient(currentPatient.patient_id, apiPayload);
      setSuccessMessage('Данные пациента успешно обновлены');
    } else {
      await createPatient(apiPayload);
      setSuccessMessage('Пациент успешно создан');
    }
    setOpenForm(false);
    await loadPatients();
  } catch (err) {
    setError('Ошибка сохранения пациента: ' + (err as Error).message);
    console.error('Ошибка сохранения:', err);
  }
};



  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  if (loading) return <Typography>Загрузка...</Typography>;

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
          Добавить пациента
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>ФИО</TableCell>
              <TableCell>Дата рождения</TableCell>
              <TableCell>Полис</TableCell>
              <TableCell>Паспорт</TableCell>
              <TableCell>Палата</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>Врач</TableCell>
              <TableCell>Диагноз</TableCell>
              <TableCell>Симптомы</TableCell>
              <TableCell>Поступление</TableCell>
              <TableCell>Выписка</TableCell>
              <TableCell>Аллергия</TableCell>
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
        disableEnforceFocus // Добавьте это
        disableAutoFocus // И это
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить пациента?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientList;