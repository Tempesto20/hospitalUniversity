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
import { SpecialtyData } from '../../api/types';
import { 
  fetchSpecialties, 
  createSpecialty, 
  updateSpecialty, 
  deleteSpecialty 
} from '../../api/api';

// SpecialtyForm component
interface SpecialtyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (specialty: SpecialtyData) => void;
  specialty: SpecialtyData | any;
}

const SpecialtyForm: React.FC<SpecialtyFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  specialty 
}) => {
  const [formData, setFormData] = useState<Omit<SpecialtyData, 'specialty_id'>>({
    specialty_name: ''
  });
  const [errors, setErrors] = useState<{ specialty_name?: string }>({});

  useEffect(() => {
    if (specialty) {
      setFormData({
        specialty_name: specialty.specialty_name
      });
    } else {
      setFormData({
        specialty_name: ''
      });
    }
  }, [specialty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors: { specialty_name?: string } = {};
    if (!formData.specialty_name.trim()) {
      newErrors.specialty_name = 'Specialty name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        ...(specialty?.specialty_id ? { specialty_id: specialty.specialty_id } : {}),
        ...formData
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {specialty ? 'Редактировать специальность' : 'Добавить специальность'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 2 }}>
          <TextField
            fullWidth
            label="Название специальности"
            name="specialty_name"
            value={formData.specialty_name}
            onChange={handleChange}
            error={!!errors.specialty_name}
            helperText={errors.specialty_name}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Назад</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {specialty ? 'Редактировать' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// SpecialtyItem component
interface SpecialtyItemProps {
  specialty: SpecialtyData;
  onEdit: (specialty: SpecialtyData) => void;
  onDelete: (id: number | any) => void;
}

const SpecialtyItem: React.FC<SpecialtyItemProps> = ({ 
  specialty, 
  onEdit, 
  onDelete 
}) => {
  return (
    <TableRow>
      <TableCell>{specialty.specialty_id}</TableCell>
      <TableCell>{specialty.specialty_name}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(specialty)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(specialty.specialty_id)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// SpecialtyList component
const SpecialtyList: React.FC = () => {
  const [specialties, setSpecialties] = useState<SpecialtyData[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState<SpecialtyData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const { data } = await fetchSpecialties();
        setSpecialties(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch specialties');
        setLoading(false);
        console.error(err);
      }
    };

    loadSpecialties();
  }, []);

  const handleAddClick = () => {
    setCurrentSpecialty(null);
    setOpenForm(true);
  };

  const handleEditClick = (specialty: SpecialtyData) => {
    setCurrentSpecialty(specialty);
    setOpenForm(true);
  };

  const handleDeleteClick = (id: number | any) => {
    setSpecialtyToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (specialtyToDelete) {
      try {
        await deleteSpecialty(specialtyToDelete);
        setSpecialties(specialties.filter(s => s.specialty_id !== specialtyToDelete));
        setOpenDeleteDialog(false);
      } catch (err) {
        setError('Failed to delete specialty');
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (specialty: SpecialtyData) => {
    try {
      if (currentSpecialty && currentSpecialty.specialty_id) {
        const { data: updatedSpecialty } = await updateSpecialty(currentSpecialty.specialty_id, specialty);
        setSpecialties(specialties.map(s => 
          s.specialty_id === currentSpecialty.specialty_id ? updatedSpecialty : s
        ));
      } else {
        const { data: newSpecialty } = await createSpecialty(specialty);
        setSpecialties([...specialties, newSpecialty]);
      }
      setOpenForm(false);
    } catch (err) {
      setError('Failed to save specialty');
      console.error(err);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h4">Специальности</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Добавить Специальность
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер специальности</TableCell>
              <TableCell>Название специальности</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties.map(specialty => (
              <SpecialtyItem 
                key={specialty.specialty_id}
                specialty={specialty}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SpecialtyForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        specialty={currentSpecialty}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить специальность?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Назад</Button>
          <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpecialtyList;