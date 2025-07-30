import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { PatientData } from '../../api/types';

interface PatientFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (patient: PatientData) => void;
  patient: PatientData | null;
}

type PatientFormData = Omit<PatientData, 'patient_id'> & {
  discharge_date?: string;
};

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
  discharge_date: '',
  doctor_id: null,
  ward_number: null,
  diagnos: '',
  symptom: '',
  allergy: '',
  preparation: ''
});
  
  const [errors, setErrors] = useState<Record<string, string>>({});


  useEffect(() => {
  if (patient) {
    setFormData({
      patient_full_name: patient.patient_full_name || patient.full_name || '', // Учитываем оба варианта
      birth_date: patient.birth_date ? format(parseISO(patient.birth_date), 'yyyy-MM-dd') : today,
      insurance_policy: patient.insurance_policy || '',
      passport: patient.passport || '',
      admission_date: patient.admission_date ? format(parseISO(patient.admission_date), 'yyyy-MM-dd') : today,
      discharge_date: patient.discharge_date ? format(parseISO(patient.discharge_date), 'yyyy-MM-dd') : '',
      doctor_id: patient.doctor_id || null,
      ward_number: patient.ward_number || null,
      diagnos: patient.diagnos || '',
      symptom: patient.symptom || '',
      allergy: patient.allergy || '',
      preparation: patient.preparation || ''
    });
  } else {
    setFormData({
      patient_full_name: '',
      birth_date: today,
      insurance_policy: '',
      passport: '',
      admission_date: today,
      discharge_date: '',
      doctor_id: null,
      ward_number: null,
      diagnos: '',
      symptom: '',
      allergy: '',
      preparation: ''
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
  
  if (!formData.patient_full_name?.trim() || formData.patient_full_name.trim().length < 2) {
    newErrors.patient_full_name = 'ФИО должно содержать минимум 2 символа';
  }
  
  if (!formData.insurance_policy?.match(/^[А-Я]{2}[0-9]{4}[А-Я]$/)) {
    newErrors.insurance_policy = 'Неверный формат полиса (XX9999X)';
  }
  
  if (!formData.passport?.match(/^[0-9]{2} [0-9]{2} [0-9]{6}$/)) {
    newErrors.passport = 'Неверный формат паспорта (00 00 000000)';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = () => {
  if (validate()) {
    const submitData: PatientData = {
      ...(patient?.patient_id ? { patient_id: patient.patient_id } : {}),
      patient_full_name: formData.patient_full_name,
      birth_date: formData.birth_date,
      insurance_policy: formData.insurance_policy,
      passport: formData.passport,
      admission_date: formData.admission_date,
      discharge_date: formData.discharge_date || null,
      doctor_id: formData.doctor_id || null,
      ward_number: formData.ward_number || null,
      diagnos: formData.diagnos || '',
      symptom: formData.symptom || '',
      allergy: formData.allergy || '',
      preparation: formData.preparation || ''
    };
    
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

export default PatientForm;