import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { PatientData } from '../../api/types';

interface PatientItemProps {
  patient: PatientData;
  onEdit: (patient: PatientData) => void;
  onDelete: (id: number) => void;
}

const PatientItem: React.FC<PatientItemProps> = ({ 
  patient, 
  onEdit, 
  onDelete 
}) => {
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';
  return format(parseISO(dateString), 'dd.MM.yyyy');
};

  return (
    <TableRow hover>
      <TableCell>{patient.patient_id}</TableCell>
      <TableCell>{patient.patient_full_name || '-'}</TableCell>
      <TableCell>{formatDate(patient.birth_date)}</TableCell>
      <TableCell>{patient.insurance_policy || '-'}</TableCell>
      <TableCell>{patient.passport || '-'}</TableCell>
      <TableCell>{patient.ward_number || '-'}</TableCell>
      <TableCell>{patient.department_name || '-'}</TableCell>
      <TableCell>{patient.doctor_full_name || '-'}</TableCell>
      <TableCell>{patient.diagnos || '-'}</TableCell>
      <TableCell>{patient.symptom || '-'}</TableCell>
      <TableCell>{formatDate(patient.admission_date)}</TableCell>
<TableCell>{patient.discharge_date ? formatDate(patient.discharge_date) : '-'}</TableCell>
      <TableCell>{patient.allergy || '-'}</TableCell>
      <TableCell>{patient.preparation || '-'}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(patient)} color="primary">
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(patient.patient_id!)} color="error">
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default PatientItem;