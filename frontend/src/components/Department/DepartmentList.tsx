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
import { DepartmentData } from '../../api/types';
import { 
  fetchDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from '../../api/api';

// DepartmentForm component
interface DepartmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (department: DepartmentData) => void;
  department: DepartmentData | null;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  department 
}) => {
  const [formData, setFormData] = useState<Omit<DepartmentData, 'department_id'>>({
    department_name: ''
  });
  const [errors, setErrors] = useState<{ department_name?: string }>({});

  useEffect(() => {
    if (department) {
      setFormData({
        department_name: department.department_name
      });
    } else {
      setFormData({
        department_name: ''
      });
    }
  }, [department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors: { department_name?: string } = {};
    if (!formData.department_name.trim()) {
      newErrors.department_name = 'Department name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit({
        ...(department?.department_id ? { department_id: department.department_id } : {}),
        ...formData
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {department ? 'Редактировать отделение' : 'Добавить отделение'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ marginTop: 2 }}>
          <TextField
            fullWidth
            label="Название отделения"
            name="department_name"
            value={formData.department_name}
            onChange={handleChange}
            error={!!errors.department_name}
            helperText={errors.department_name}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Назад</Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          {department ? 'Редактировать' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// DepartmentItem component
interface DepartmentItemProps {
  department: DepartmentData;
  onEdit: (department: DepartmentData) => void;
  onDelete: (id: number) => void;
}

const DepartmentItem: React.FC<DepartmentItemProps> = ({ 
  department, 
  onEdit, 
  onDelete 
}) => {
  return (
    <TableRow>
      <TableCell>{department.department_id}</TableCell>
      <TableCell>{department.department_name}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(department)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(department.department_id!)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

// DepartmentList component
const DepartmentList: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<DepartmentData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const { data } = await fetchDepartments();
        setDepartments(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch departments');
        setLoading(false);
        console.error(err);
      }
    };

    loadDepartments();
  }, []);

  const handleAddClick = () => {
    setCurrentDepartment(null);
    setOpenForm(true);
  };

  const handleEditClick = (department: DepartmentData) => {
    setCurrentDepartment(department);
    setOpenForm(true);
  };

  const handleDeleteClick = (id: number) => {
    setDepartmentToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (departmentToDelete) {
      try {
        await deleteDepartment(departmentToDelete);
        setDepartments(departments.filter(d => d.department_id !== departmentToDelete));
        setOpenDeleteDialog(false);
      } catch (err) {
        setError('Failed to delete department');
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (department: DepartmentData) => {
    try {
      if (currentDepartment?.department_id) {
        const { data: updatedDepartment } = await updateDepartment(
          currentDepartment.department_id, 
          department
        );
        setDepartments(departments.map(d => 
          d.department_id === currentDepartment.department_id ? updatedDepartment : d
        ));
      } else {
        const { data: newDepartment } = await createDepartment(department);
        setDepartments([...departments, newDepartment]);
      }
      setOpenForm(false);
    } catch (err) {
      setError('Failed to save department');
      console.error(err);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Typography variant="h4">Отделения</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />}
          onClick={handleAddClick}
        >
          Добавить Отделение
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номер отделения</TableCell>              
              <TableCell>Название отделения</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map(department => (
              <DepartmentItem 
                key={department.department_id}
                department={department}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DepartmentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        department={currentDepartment}
      />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          Вы уверены, что хотите удалить Отделение?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Назад</Button>
          <Button onClick={handleDeleteConfirm} color="error">Удалить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepartmentList;