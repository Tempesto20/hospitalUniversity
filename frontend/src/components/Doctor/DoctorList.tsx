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
import { DoctorData } from '../../api/types';
import { 
  fetchCombineDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  fetchSpecialties
} from '../../api/api';

// DoctorForm component
interface DoctorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (doctor: DoctorData) => void;
  doctor: DoctorData | null;
}

interface FormData {
  full_name: string;
  specialty_id: number;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  doctor 
}) => {
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    specialty_id: 0
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
        full_name: doctor.full_name,
        specialty_id: doctor.specialty_id
      });
    } else {
      setFormData({
        full_name: '',
        specialty_id: 0
      });
    }
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'specialty_id' ? Number(value) : value
    }));
  };

  const handleSubmit = () => {
    const selectedSpecialty = specialties.find(s => s.id === formData.specialty_id);
    
    onSubmit({
      ...(doctor?.doctor_id ? { doctor_id: doctor.doctor_id } : {}),
      ...formData,
      specialty_name: selectedSpecialty?.name || ''
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
            value={formData.specialty_id}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value={0} disabled>
              Поиск специальности
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
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {doctor ? 'Редактировать' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// DoctorItem component
interface DoctorItemProps {
  doctor: DoctorData;
  onEdit: (doctor: DoctorData) => void;
  onDelete: (id: number) => void;
}

const DoctorItem: React.FC<DoctorItemProps> = ({ 
  doctor, 
  onEdit, 
  onDelete 
}) => {
  return (
    <TableRow>
      <TableCell>{doctor.doctor_id}</TableCell>
      <TableCell>{doctor.full_name}</TableCell>
      <TableCell>{doctor.specialty_name || 'No specialty'}</TableCell>
      <TableCell>   
        <IconButton onClick={() => onEdit(doctor)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(doctor.doctor_id!)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// DoctorList component
const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<DoctorData[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<DoctorData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const { data } = await fetchCombineDoctors();
        setDoctors(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch doctors');
        setLoading(false);
        console.error(err);
      }
    };

    loadDoctors();
  }, []);

  const handleAddClick = () => {
    setCurrentDoctor(null);
    setOpenForm(true);
  };

  const handleEditClick = (doctor: DoctorData) => {
    setCurrentDoctor(doctor);
    setOpenForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setDoctorToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (doctorToDelete) {
      try {
        await deleteDoctor(doctorToDelete);
        setDoctors(doctors.filter(d => d.doctor_id !== doctorToDelete));
        setOpenDeleteDialog(false);
      } catch (err) {
        setError('Failed to delete doctor');
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (doctor: DoctorData) => {
    try {
      if (currentDoctor?.doctor_id) {
        const { data: updatedDoctor } = await updateDoctor(
          currentDoctor.doctor_id, 
          doctor
        );
        setDoctors(doctors.map(d => 
          d.doctor_id === currentDoctor.doctor_id ? updatedDoctor : d
        ));
      } else {
        const { data: newDoctor } = await createDoctor(doctor);
        setDoctors([...doctors, newDoctor]);
      }
      setOpenForm(false);
    } catch (err) {
      setError('Failed to save doctor');
      console.error(err);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h4">Врачи</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Добавить врача
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер</TableCell>
              <TableCell>ФИО</TableCell>
              <TableCell>Специальность</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map(doctor => (
              <DoctorItem 
                key={doctor.doctor_id}
                doctor={doctor}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DoctorForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        doctor={currentDoctor}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить Врача?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Назад</Button>
          <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorList;