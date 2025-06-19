// import React from 'react';
// import { TableRow, TableCell, IconButton } from '@mui/material';
// import { Edit, Delete } from '@mui/icons-material';
// import { DoctorData } from '../../api/types';

// interface DoctorItemProps {
//   doctor: DoctorData;
//   onEdit: (doctor: DoctorData) => void;
//   onDelete: (id: number) => void;
// }

// const DoctorItem: React.FC<DoctorItemProps> = ({ 
//   doctor, 
//   onEdit, 
//   onDelete 
// }) => {
//   return (
//     <TableRow>
//       <TableCell>{doctor.doctor_id}</TableCell>
//       <TableCell>{doctor.full_name}</TableCell>
//       {/* <TableCell>{doctor.specialty_name || 'No specialty'}</TableCell> */}
//       <TableCell>{doctor.specialty_id|| 'No specialty'}</TableCell>
//       {/* <TableCell>{doctor.specialty ? doctor.specialty.specialty_name : 'Не указана'}</TableCell> */}
//       <TableCell>   
//         <IconButton onClick={() => onEdit(doctor)}>
//           <Edit />
//         </IconButton>
//         <IconButton onClick={() => onDelete(doctor.doctor_id!)}>
//           <Delete />
//         </IconButton>
//       </TableCell>
//     </TableRow>
//   );
// };

// export default DoctorItem;



import React from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { DoctorData } from '../../api/types';

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
  // Определяем название специальности
  const getSpecialtyName = () => {
    if (doctor.specialty?.specialty_name) {
      return doctor.specialty.specialty_name;
    }
    if (doctor.specialty_name) { // для обратной совместимости
      return doctor.specialty_name;
    }
    return 'Не указана';
  };

  return (
    <TableRow>
      <TableCell>{doctor.doctor_id}</TableCell>
      <TableCell>{doctor.full_name}</TableCell>
      <TableCell>
        {getSpecialtyName()}
        {doctor.specialty_id && !doctor.specialty && !doctor.specialty_name && 
          ` (ID: ${doctor.specialty_id})`}
      </TableCell>
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

export default DoctorItem;