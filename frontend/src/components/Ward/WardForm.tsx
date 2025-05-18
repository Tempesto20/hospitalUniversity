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
import { WardData } from '../../api/types';
import { fetchDepartments, fetchDoctors } from '../../api/api';

interface WardFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (ward: WardData) => void;
  ward: WardData | null;
}

// Создаем тип для формы, исключая ward_id и добавляя doctor_name
type WardFormData = Omit<WardData, 'ward_id' | 'doctor_full_name'> & {
  doctor_name: string;
};

const WardForm: React.FC<WardFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  ward 
}) => {
  const [formData, setFormData] = useState<WardFormData>({
    ward_number: '',
    department_name: '',
    doctor_name: ''
  });
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [doctors, setDoctors] = useState<{id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const departmentsRes = await fetchDepartments();
        const doctorsRes = await fetchDoctors();
        
        setDepartments(departmentsRes.data.map((d: any) => ({ 
          id: d.department_name, 
          name: d.department_name 
        })));
        setDoctors(doctorsRes.data.map((d: any) => ({ 
          id: d.doctor_name, 
          name: d.full_name 
        })));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (ward) {
      setFormData({
        ward_number: ward.ward_number,
        department_name: ward.department_name,
        // Преобразуем doctor_full_name в doctor_name для формы
        doctor_name: ward.doctor_full_name || ''
      });
    } else {
      setFormData({
        ward_number: '',
        department_name: '',
        doctor_name: ''
      });
    }
  }, [ward]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



const handleSubmit = () => {
  const submitData: WardData = {
    ...(ward?.ward_id && { ward_id: ward.ward_id }),
    ward_number: formData.ward_number,
    department_name: formData.department_name || '',
    doctor_full_name: formData.doctor_name || ''
  };
  onSubmit(submitData);
};




  if (loading) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {ward ? 'Редактировать' : 'Добавить палату'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 2 }}>
          <TextField
            fullWidth
            label="Номер палаты"
            name="ward_number"
            value={formData.ward_number}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            select
            fullWidth
            label="Отделение"
            name="department_name"
            value={formData.department_name}
            onChange={handleChange}
            margin="normal"
          >
            {departments.map(department => (
              <MenuItem key={department.id} value={department.id}>
                {department.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Doctor"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="">None</MenuItem>
            {doctors.map(doctor => (
              <MenuItem key={doctor.id} value={doctor.name}>
                {doctor.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Назад</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {ward ? 'Редактировать' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WardForm;