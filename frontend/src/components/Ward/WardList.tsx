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
import { WardData } from '../../api/types';
import { 
  fetchCombinehWards,
  createWard,
  updateWard,
  deleteWard,
  fetchDepartments,
  fetchDoctors
} from '../../api/api';

// WardForm component
interface WardFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (ward: WardData) => void;
  ward: WardData | null;
}

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
    ward_number: 0,
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
        doctor_name: ward.doctor_full_name || ''
      });
    } else {
      setFormData({
        ward_number: 0,
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
        {ward ? 'Редактировать палату' : 'Добавить палату'}
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
            label="Врач"
            name="doctor_name"
            value={formData.doctor_name}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="">Не назначен</MenuItem>
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

// WardItem component
interface WardItemProps {
  ward: WardData;
  onEdit: (ward: WardData) => void;
  onDelete: (id: number) => void;
}

const WardItem: React.FC<WardItemProps> = ({ 
  ward, 
  onEdit, 
  onDelete 
}) => {
  return (
    <TableRow>
      <TableCell>{ward.ward_number}</TableCell>
      <TableCell>{ward.department_name || '-'}</TableCell>
      <TableCell>{ward.doctor_full_name || '-'}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(ward)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(ward.ward_id!)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// WardList component
const WardList: React.FC = () => {
  const [wards, setWards] = useState<WardData[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentWard, setCurrentWard] = useState<WardData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [wardToDelete, setWardToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWards = async () => {
      try {
        const { data } = await fetchCombinehWards();
        setWards(data);
        setLoading(false);
      } catch (err) {
        setError('Не удалось загрузить данные о палатах');
        setLoading(false);
        console.error(err);
      }
    };

    loadWards();
  }, []);

  const handleAddClick = () => {
    setCurrentWard(null);
    setOpenForm(true);
  };

  const handleEditClick = (ward: WardData) => {
    setCurrentWard(ward);
    setOpenForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setWardToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (wardToDelete) {
      try {
        await deleteWard(wardToDelete);
        setWards(wards.filter(w => w.ward_id !== wardToDelete));
        setOpenDeleteDialog(false);
      } catch (err) {
        setError('Не удалось удалить палату');
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (ward: WardData) => {
    try {
      if (currentWard?.ward_id) {
        const { data: updatedWard } = await updateWard(
          currentWard.ward_id, 
          ward
        );
        setWards(wards.map(w => 
          w.ward_id === currentWard.ward_id ? updatedWard : w
        ));
      } else {
        const { data: newWard } = await createWard(ward);
        setWards([...wards, newWard]);
      }
      setOpenForm(false);
    } catch (err) {
      setError('Не удалось сохранить данные палаты');
      console.error(err);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h4">Палаты</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Добавить палату
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер палаты</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>Врач</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wards.map((ward, index) => (
              <WardItem 
                key={ward.ward_id || index}
                ward={ward}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <WardForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        ward={currentWard}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить палату?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Назад</Button>
          <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WardList;