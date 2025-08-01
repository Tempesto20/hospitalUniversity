import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem
} from '@mui/material';
import { DoctorData } from '../../api/types';
import { fetchSpecialties } from '../../api/api';

interface DoctorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (doctor: DoctorData) => void;
  doctor: DoctorData | null;
}

interface FormData {
  full_name: string;
  specialty_id: number | null;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  doctor 
}) => {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    specialty_id: null
  });
  const [specialties, setSpecialties] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const { data } = await fetchSpecialties();
        setSpecialties(data.map((s: any) => ({ id: s.specialty_id, name: s.specialty_name })));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    loadSpecialties();
  }, []);

  useEffect(() => {
    if (doctor) {
      setFormData({
        full_name: doctor.full_name || '',
        specialty_id: doctor.specialty_id || null
      });
    } else {
      setFormData({
        full_name: '',
        specialty_id: null
      });
    }
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'specialty_id' ? (value ? Number(value) : null) : value
    }));
  };

const handleSubmit = () => {
  onSubmit({
    ...(doctor?.doctor_id ? { doctor_id: doctor.doctor_id } : {}),
    full_name: formData.full_name,
    specialty_id: formData.specialty_id
  });
};

  if (loading) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {doctor ? 'Редактировать данные' : 'Добавить врача'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 2 }}>
          <TextField
            fullWidth
            label="ФИО врача"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            select
            fullWidth
            label="Специальность"
            name="specialty_id"
            value={formData.specialty_id || ''}
            onChange={handleChange}
            margin="normal"
            error={formData.specialty_id === null}
            helperText={formData.specialty_id === null ? 'Выберите специальность' : ''}
          >
            <MenuItem value="" disabled>
              Выберите специальность
            </MenuItem>
            {specialties.map(specialty => (
              <MenuItem key={specialty.id} value={specialty.id}>
                {specialty.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Назад</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={formData.specialty_id === null || formData.full_name.trim() === ''}
        >
          {doctor ? 'Редактировать' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DoctorForm;