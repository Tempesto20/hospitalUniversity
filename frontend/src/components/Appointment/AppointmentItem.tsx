import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { AppointmentData } from '../../api/types';
import { format, parseISO } from 'date-fns';

interface AppointmentItemProps {
  appointment: AppointmentData;
  onEdit: (appointment: AppointmentData) => void;
  onDelete: (id: number) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({ 
  appointment, 
  onEdit, 
  onDelete 
}) => {
    const formatDate = (dateString: string | null) => {
      if (!dateString) return '-';
      return format(parseISO(dateString), 'dd.MM.yyyy');
    };
    
  return (
    <TableRow>
        <TableCell>{appointment.appointment_id}</TableCell>
        <TableCell>{appointment.patient_full_name || '-'}</TableCell>
        <TableCell>{appointment.ward_number || '-'}</TableCell>
        <TableCell>{appointment.department_name || '-'}</TableCell>
        <TableCell>{formatDate(appointment.appointment_date) || '-'}</TableCell>
        <TableCell>{appointment.doctor_full_name || '-'}</TableCell>
        <TableCell>{appointment.symptom || '-'}</TableCell>
        <TableCell>{appointment.diagnos || '-'}</TableCell>
        <TableCell>{appointment.allergy || '-'}</TableCell>
        <TableCell>{appointment.preparation || '-' }</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(appointment)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(appointment.appointment_id!)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default AppointmentItem;