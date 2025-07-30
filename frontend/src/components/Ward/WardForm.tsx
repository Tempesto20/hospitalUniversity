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
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { WardData } from '../../api/types';
import { fetchDepartments, fetchDoctors } from '../../api/api';

interface WardFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (ward: WardData) => void;
  ward: WardData | null;
}

interface FormData {
  ward_number: number;
  department_id: number;
  doctor_id: number;
}


interface WardFormData {
  ward_id?: number;
  ward_number: number;
  department_id: number;
  doctor_id: number | null;
  department_name?: string;
  doctor_full_name?: string;
}


const WardForm: React.FC<WardFormProps> = ({ open, onClose, onSubmit, ward }) => {
  const [departments, setDepartments] = useState<{department_id: number, department_name: string}[]>([]);
  const [doctors, setDoctors] = useState<{doctor_id: number, full_name: string}[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    ward_number: 0,
    department_id: 0,
    doctor_id: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const departmentsRes = await fetchDepartments();
        const doctorsRes = await fetchDoctors();
        
        setDepartments(departmentsRes.data);
        setDoctors(doctorsRes.data);

        // После загрузки departments обновляем formData
        if (departmentsRes.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            department_id: ward?.department_id || departmentsRes.data[0].department_id
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [ward]);

  useEffect(() => {
    if (ward && departments.length > 0) {
      setFormData({
        ward_number: ward.ward_number || 0,
        department_id: ward.department_id || departments[0].department_id,
        doctor_id: ward.doctor_id || 0
      });
    }
  }, [ward, departments]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.ward_number <= 0) {
      newErrors.ward_number = 'Номер палаты должен быть положительным числом';
    }
    
    if (formData.department_id <= 0) {
      newErrors.department_id = 'Необходимо выбрать отделение';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = () => {
  if (validate()) {
    const selectedDepartment = departments.find(d => d.department_id === formData.department_id);
    const selectedDoctor = doctors.find(d => d.doctor_id === formData.doctor_id);

    onSubmit({
      ...(ward?.ward_id && { ward_id: ward.ward_id }),
      ward_number: formData.ward_number,
      department_id: formData.department_id,
      department_name: selectedDepartment?.department_name || '',
      doctor_id: formData.doctor_id !== 0 ? formData.doctor_id : null,
      doctor_full_name: selectedDoctor?.full_name || ''
    });
  }
};

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: Number(value)
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{ward ? 'Редактировать палату' : 'Добавить палату'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Номер палаты"
            name="ward_number"
            type="number"
            value={formData.ward_number}
            onChange={handleNumberChange}
            error={!!errors.ward_number}
            helperText={errors.ward_number}
            margin="normal"
            inputProps={{ min: 1 }}
          />

          <FormControl fullWidth margin="normal" error={!!errors.department_id}>
            <InputLabel>Отделение</InputLabel>
            <Select
              name="department_id"
              value={formData.department_id}
              onChange={handleSelectChange}
              label="Отделение"
              disabled={departments.length === 0}
            >
              {departments.map(department => (
                <MenuItem key={department.department_id} value={department.department_id}>
                  {department.department_name}
                </MenuItem>
              ))}
            </Select>
            {errors.department_id && <Box sx={{ color: 'error.main', fontSize: '0.75rem' }}>{errors.department_id}</Box>}
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Врач</InputLabel>
            <Select
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleSelectChange}
              label="Врач"
            >
              <MenuItem value={0}>Не назначен</MenuItem>
              {doctors.map(doctor => (
                <MenuItem key={doctor.doctor_id} value={doctor.doctor_id}>
                  {doctor.full_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {ward ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WardForm;