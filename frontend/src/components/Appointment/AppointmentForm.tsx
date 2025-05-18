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
  Typography
} from '@mui/material';
import { format, parseISO } from 'date-fns';
// import { ru } from 'date-fns/locale';
import { AppointmentData } from '../../api/types';
import { fetchPatients, fetchDoctors, fetchWards } from '../../api/api';

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

type AppointmentFormData = Omit<AppointmentData, 'appointment_id'> & {
  patient_full_name: string;
  doctor_full_name: string;
  formatted_date: string;
};

// const formatToDisplay = (dateString: string): string => {
//   try {
//     return format(parseISO(dateString), 'dd.MM.yyyy', { locale: ru });
//   } catch {
//     return format(new Date(), 'dd.MM.yyyy', { locale: ru });
//   }
// };


const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  appointment 
}) => {

    const today = format(new Date(), 'yyyy-MM-dd');


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



  const [patients, setPatients] = useState<{id: number, name: string}[]>([]);
  const [doctors, setDoctors] = useState<{id: number, name: string}[]>([]);
  const [wards, setWards] = useState<{id: number, number: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
    
  //   if (name === 'appointment_date') {
  //     setFormData(prev => ({
  //       ...prev,
  //       [name]: value,
  //       formatted_date: formatToDisplay(value)
  //     }));
  //   } else {
  //     setFormData(prev => ({
  //       ...prev,
  //       [name]: value
  //     }));
  //   }
  // };

  const handlePatientSelect = (patientId: number) => {
    const patient = patients.find(p => p.id === patientId);
    setFormData(prev => ({
      ...prev,
      patient_id: patientId,
      patient_full_name: patient?.name || ''
    }));
  };

  const handleDoctorSelect = (doctorId: number) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setFormData(prev => ({
      ...prev,
      doctor_id: doctorId,
      doctor_full_name: doctor?.name || ''
    }));
  };

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

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Загрузка данных...</Typography>
      </Box>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
        {appointment ? 'Редактирование приема' : 'Создание нового приема'}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
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

          <TextField
            select
            fullWidth
            label="Врач"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={(e) => handleDoctorSelect(Number(e.target.value))}
            margin="normal"
            variant="outlined"
          >
            {doctors.map(doctor => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Палата"
            name="ward_number"
            value={formData.ward_number}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          >
            <MenuItem value={0}>Не указана</MenuItem>
            {wards.map(ward => (
              <MenuItem key={ward.id} value={ward.id}>
                {ward.number}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Дата приема"
            type="date"
            name="appointment_date"
            value={formData.appointment_date}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            helperText={`Выбрана дата: ${formData.formatted_date}`}
          />

          <TextField
            fullWidth
            label="Симптомы"
            name="symptom"
            value={formData.symptom}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Диагноз"
            name="diagnos"
            value={formData.diagnos}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Аллергии"
            name="allergy"
            value={formData.allergy}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Назначения"
            name="preparation"
            value={formData.preparation}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={2}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ mr: 1 }}
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

export default AppointmentForm;