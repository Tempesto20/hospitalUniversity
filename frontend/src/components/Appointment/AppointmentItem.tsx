import React from 'react';
import { TableRow, TableCell, IconButton, Tooltip, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

interface AppointmentItemProps {
  appointment: any;
  onEdit: (appointment: any) => void;
  onDelete: (id: number) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ 
  appointment, 
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd.MM.yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <TableRow hover>
      <TableCell>{appointment.appointment_id}</TableCell>
      <TableCell>
        <strong>{appointment.patient?.full_name || 'Не указан'}</strong>
      </TableCell>
      <TableCell>
        {appointment.ward?.ward_number ? (
          <Chip 
            label={`№${appointment.ward.ward_number}`} 
            color="primary" 
            size="small"
          />
        ) : (
          'Не указана'
        )}
      </TableCell>
      <TableCell>{appointment.ward?.department?.department_name || 'Не указано'}</TableCell>
      <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
      <TableCell>{appointment.doctor?.full_name || 'Не указан'}</TableCell>
      <TableCell>
        {appointment.symptom ? (
          <Tooltip title={appointment.symptom}>
            <span>{appointment.symptom.substring(0, 20)}...</span>
          </Tooltip>
        ) : (
          'Не указаны'
        )}
      </TableCell>
      <TableCell>
        {appointment.diagnos ? (
          <Tooltip title={appointment.diagnos}>
            <span>{appointment.diagnos.substring(0, 20)}...</span>
          </Tooltip>
        ) : (
          'Не указан'
        )}
      </TableCell>
      <TableCell>
        <Tooltip title="Редактировать">
          <IconButton 
            onClick={() => onEdit(appointment)}
            color="primary"
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Удалить">
          <IconButton 
            onClick={() => onDelete(appointment.appointment_id)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default AppointmentItem;