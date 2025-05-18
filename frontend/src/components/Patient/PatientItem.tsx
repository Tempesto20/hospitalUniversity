import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
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
  return (
    <TableRow>
      <TableCell>{patient.patient_id}</TableCell>
      <TableCell>{patient.patient_full_name || '-'}</TableCell>
      <TableCell>{patient.birth_date}</TableCell>
      <TableCell>{patient.insurance_policy || '-'}</TableCell>
      <TableCell>{patient.passport || '-'}</TableCell>
      <TableCell>{patient.ward_number || '-'}</TableCell>
      <TableCell>{patient.department_name || '-'}</TableCell>
      <TableCell>{patient.doctor_full_name || '-'}</TableCell>
      <TableCell>{patient.diagnos || '-'}</TableCell>
      <TableCell>{patient.symptom || '-'}</TableCell>
      <TableCell>{patient.admission_date}</TableCell>
      <TableCell>{patient.discharge_date || '-'}</TableCell>
      <TableCell>{patient.allergy || '-'}</TableCell>
      <TableCell>{patient.preparation || '-'}</TableCell>
      <TableCell>
        <IconButton onClick={() => onEdit(patient)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(patient.patient_id!)}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default PatientItem;