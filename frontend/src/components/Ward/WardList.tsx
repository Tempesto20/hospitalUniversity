import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, 
  DialogActions, Box, Typography, Snackbar, Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import WardForm from './WardForm';
import WardItem from './WardItem';
import { WardData } from '../../api/types';
import { fetchCombinehWards, createWard, updateWard, deleteWard } from '../../api/api';

const WardList: React.FC = () => {
  const [wards, setWards] = useState<WardData[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [currentWard, setCurrentWard] = useState<WardData | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [wardToDelete, setWardToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadWards = async () => {
    try {
      setLoading(true);
      const { data } = await fetchCombinehWards();
      setWards(data);
      setLoading(false);
    } catch (err) {
      setError('Ошибка загрузки палат');
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
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
        await loadWards();
        setOpenDeleteDialog(false);
        setSuccessMessage('Палата успешно удалена');
      } catch (err) {
        setError('Ошибка удаления палаты');
        console.error(err);
      }
    }
  };

const handleFormSubmit = async (ward: WardData) => {
  try {
    if (currentWard?.ward_id) {
      await updateWard(currentWard.ward_id, {
        ward_number: ward.ward_number,
        department_id: ward.department_id,
        doctor_id: ward.doctor_id
      });
      setSuccessMessage('Палата успешно обновлена');
    } else {
      await createWard({
        ward_number: ward.ward_number,
        department_id: ward.department_id,
        doctor_id: ward.doctor_id
      });
      setSuccessMessage('Палата успешно создана');
    }
    setOpenForm(false);
    await loadWards();
  } catch (err: unknown) {
    let errorMessage = 'Ошибка сохранения палаты';
    if (err instanceof Error) {
      errorMessage += ': ' + (err as any).response?.data?.message || err.message;
    }
    setError(errorMessage);
    console.error(err);
  }
};

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccessMessage(null);
  };

  if (loading) return <Typography>Загрузка...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
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

      <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Номер</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>Врач</TableCell>
              <TableCell>Пациенты</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wards.map(ward => (
              <WardItem 
                key={ward.ward_id || ward.ward_number}
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
          <Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error" onClose={handleCloseSnackbar}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="success" onClose={handleCloseSnackbar}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WardList;