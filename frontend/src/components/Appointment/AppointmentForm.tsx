import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Divider
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { fetchPatients, fetchCombineDoctors, fetchCombinehWards } from '../../api/api';

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
  const [formData, setFormData] = useState({
    patient_id: 0,
    doctor_id: 0,
    ward_id: null as number | null,
    appointment_date: today,
    symptom: '',
    diagnos: '',
    allergy: '',
    preparation: ''
  });

  const [patients, setPatients] = useState<{patient_id: number, full_name: string}[]>([]);
  const [doctors, setDoctors] = useState<{doctor_id: number, full_name: string}[]>([]);
  const [wards, setWards] = useState<{ward_id: number, ward_number: number, department_name: string}[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    try {
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
        full_name: d.full_name
      })));
      
      setWards(wardsRes.data.map((w: any) => ({
        ward_id: w.ward_id,
        ward_number: w.ward_number,
        department_name: w.department_name
      })));
      
      setLoading(false);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setLoading(false);
    }
  };

  loadData();
}, []);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patient_id: appointment.patient_id,
        doctor_id: appointment.doctor_id,
        ward_id: appointment.ward_id,
        appointment_date: format(parseISO(appointment.appointment_date), 'yyyy-MM-dd'),
        symptom: appointment.symptom || '',
        diagnos: appointment.diagnos || '',
        allergy: appointment.allergy || '',
        preparation: appointment.preparation || ''
      });
    }
  }, [appointment]);

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

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        Загрузка данных...
      </Box>
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
              getOptionLabel={(option) => option.full_name}
              value={patients.find(p => p.patient_id === formData.patient_id) || null}
              onChange={(_, newValue) => {
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
              getOptionLabel={(option) => option.full_name}
              value={doctors.find(d => d.doctor_id === formData.doctor_id) || null}
              onChange={(_, newValue) => {
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
              getOptionLabel={(option) => `${option.ward_number} (${option.department_name})`}
              value={wards.find(w => w.ward_id === formData.ward_id) || null}
              onChange={(_, newValue) => {
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