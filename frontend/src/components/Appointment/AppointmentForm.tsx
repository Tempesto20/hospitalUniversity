import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { fetchPatients, fetchCombineDoctors, fetchCombinehWards } from '../../api/api';

interface Patient {
  patient_id: number;
  full_name: string;
}

interface Doctor {
  doctor_id: number;
  full_name: string;
  specialty_name?: string;
}

interface Ward {
  ward_id: number;
  ward_number: number;
  department_name: string;
}

interface FormData {
  patient_id: number;
  doctor_id: number;
  ward_id: number | null;
  appointment_date: string;
  symptom: string;
  diagnos: string;
  allergy: string;
  preparation: string;
}

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (appointment: any) => void;
  appointment: any | null;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  appointment 
}) => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [formData, setFormData] = useState<FormData>({
    patient_id: 0,
    doctor_id: 0,
    ward_id: null,
    appointment_date: today,
    symptom: '',
    diagnos: '',
    allergy: '',
    preparation: ''
  });

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!open) {
      setInitialLoad(true);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        
        const [patientsRes, doctorsRes, wardsRes] = await Promise.all([
          fetchPatients(),
          fetchCombineDoctors(),
          fetchCombinehWards()
        ]);
        
        setPatients(patientsRes.data.map((p: any) => ({
          patient_id: p.patient_id,
          full_name: p.full_name || p.patient_full_name
        })));
        
        setDoctors(doctorsRes.data.map((d: any) => ({
          doctor_id: d.doctor_id,
          full_name: d.full_name,
          specialty_name: d.specialty_name
        })));
        
        setWards(wardsRes.data.map((w: any) => ({
          ward_id: w.ward_id,
          ward_number: w.ward_number,
          department_name: w.department_name
        })));

        if (appointment) {
          setFormData({
            patient_id: appointment.patient?.patient_id || 0,
            doctor_id: appointment.doctor?.doctor_id || 0,
            ward_id: appointment.ward?.ward_id || null,
            appointment_date: appointment.appointment_date 
              ? format(parseISO(appointment.appointment_date), 'yyyy-MM-dd')
              : today,
            symptom: appointment.symptom || '',
            diagnos: appointment.diagnos || '',
            allergy: appointment.allergy || '',
            preparation: appointment.preparation || ''
          });
        } else {
          setFormData({
            patient_id: 0,
            doctor_id: 0,
            ward_id: null,
            appointment_date: today,
            symptom: '',
            diagnos: '',
            allergy: '',
            preparation: ''
          });
        }

        setLoading(false);
        setInitialLoad(false);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setLoading(false);
        setInitialLoad(false);
      }
    };

    if (initialLoad) {
      loadData();
    }
  }, [open, appointment, initialLoad]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      appointment_date: new Date(formData.appointment_date).toISOString()
    };
    onSubmit(submitData);
  };

  const currentPatient = patients.find(p => p.patient_id === formData.patient_id) || null;
  const currentDoctor = doctors.find(d => d.doctor_id === formData.doctor_id) || null;
  const currentWard = wards.find(w => w.ward_id === formData.ward_id) || null;

  if (loading && initialLoad) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
          {appointment ? 'Редактирование приема' : 'Новый прием пациента'}
        </DialogTitle>
        <DialogContent sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '300px'
        }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        {appointment ? 'Редактирование приема' : 'Новый прием пациента'}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Autocomplete
              options={patients}
              getOptionLabel={(option: Patient) => option.full_name}
              value={currentPatient}
              onChange={(_, newValue: Patient | null) => {
                setFormData(prev => ({
                  ...prev,
                  patient_id: newValue?.patient_id || 0
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Пациент"
                  margin="normal"
                  fullWidth
                  required
                  error={!formData.patient_id}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Autocomplete
              options={doctors}
              getOptionLabel={(option: Doctor) => 
                `${option.full_name}${option.specialty_name ? ` (${option.specialty_name})` : ''}`
              }
              value={currentDoctor}
              onChange={(_, newValue: Doctor | null) => {
                setFormData(prev => ({
                  ...prev,
                  doctor_id: newValue?.doctor_id || 0
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Врач"
                  margin="normal"
                  fullWidth
                  required
                  error={!formData.doctor_id}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Autocomplete
              options={wards}
              getOptionLabel={(option: Ward) => 
                `${option.ward_number} (${option.department_name})`
              }
              value={currentWard}
              onChange={(_, newValue: Ward | null) => {
                setFormData(prev => ({
                  ...prev,
                  ward_id: newValue?.ward_id || null
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Палата"
                  margin="normal"
                  fullWidth
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Дата приема"
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Divider sx={{ my: 2 }} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Симптомы"
              name="symptom"
              value={formData.symptom}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Диагноз"
              name="diagnos"
              value={formData.diagnos}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Аллергии"
              name="allergy"
              value={formData.allergy}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Назначения"
              name="preparation"
              value={formData.preparation}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
          Отмена
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!formData.patient_id || !formData.doctor_id || !formData.appointment_date}
        >
          {appointment ? 'Сохранить изменения' : 'Создать прием'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentForm;