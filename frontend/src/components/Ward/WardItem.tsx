import React from 'react';
import { TableRow, TableCell, IconButton, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { WardData } from '../../api/types';

interface WardItemProps {
  ward: WardData;
  onEdit: (ward: WardData) => void;
  onDelete: (id: number) => void;
}

const WardItem: React.FC<WardItemProps> = ({ ward, onEdit, onDelete }) => {
  return (
    <TableRow hover>
      <TableCell>{ward.ward_number}</TableCell>
      <TableCell>{ward.department_name || '-'}</TableCell>
      <TableCell>{ward.doctor_full_name || '-'}</TableCell>
      <TableCell>
        <Chip 
          label={`${ward.patient_count || 0} пациентов`} 
          color={ward.patient_count ? 'primary' : 'default'} 
          size="small"
        />
      </TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(ward)} color="primary">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(ward.ward_id!)} color="error">
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default WardItem;