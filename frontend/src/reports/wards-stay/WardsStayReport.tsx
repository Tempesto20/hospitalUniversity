// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Box, Typography, TextField, Button, 
//   Table, TableBody, TableCell, TableContainer, 
//   TableHead, TableRow, Paper,
//   IconButton, Tooltip, LinearProgress
// } from '@mui/material';
// import { Refresh, ArrowBack } from '@mui/icons-material';
// import axios from 'axios';
// import dayjs from 'dayjs';

// // interface WardStayData {
// //   patient_stay_days: number;
// //   ward_number: string;
// //   patient_names: string;
// //   admission_date: string;
// //   discharge_date: string;
// // }


// interface WardStayData {
//   ward_number: string;
//   department_name: string;
//   doctor_name: string;
//   specialty_name: string;
//   max_stay_days: number;
//   patient_count: number;
//   patients: {
//     name: string;
//     admission_date: string;
//     discharge_date: string;
//     stay_days: number;
//   }[];
// }


// const WardsStayReport = () => {
//   const [data, setData] = useState<WardStayData[]>([]);
//   const [maxDays, setMaxDays] = useState('30');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();







// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const params = new URLSearchParams();
// //       if (maxDays) params.append('max_days', maxDays);
      
// //       // const response = await axios.get(`http://localhost:3000/reports/wards-stay`);
// // // console.log('Making request to:', `http://localhost:3000/reports/wards-stay`);


// // //       const response = await axios.get(`http://localhost:3000/reports/wards-stay`, {
// // //   params: { max_days: maxDays }
// // // });


// // // const response = await axios.get('http://localhost:3000/api/reports/wards-stay', {
// // //   params: { max_days: 10 }
// // // });


// // const response = await axios.get(`http://localhost:3000/reports/wards-stay`, {
// //   params: { max_days: maxDays }
// // });

// //       setData(response.data);
// //       console.log(response.data)
// //     } catch (error) {
// //       console.error('Error fetching wards stay report:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };




// // const fetchData = async () => {
// //   try {
// //     const response = await axios.get('http://localhost:3000/wards-stay');
// //     console.log('Ответ сервера:', response.data); // Проверьте в консоли браузера
// //     setData(response.data);
// //   } catch (error) {
// //     console.error('Ошибка запроса:');
// //   }
// // };







// const fetchData = async () => {
//   setLoading(true);
//   try {
//     const params = new URLSearchParams();
//     params.append('max_days', maxDays);
    
//     const response = await axios.get(`http://localhost:3000/reports/wards-stay`, { params });
//     const data = response.data;
    
//     const formattedData = data.map((item: { patients: any[]; }) => {
//       return {
//         ...item,
//         patients: item.patients.map(patient => ({
//           name: patient.full_name,
//           admission_date: patient.admission_date,
//           discharge_date: patient.discharge_date,
//           stay_days: patient.stay_days,
//         }))
//       };
//     });
    
//     setData(formattedData);
//   } catch (error) {
//     console.error('Error fetching wards stay report:', error);
//   } finally {
//     setLoading(false);
//   }
// };

//   // const fetchData = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await axios.get(`http://localhost:3000/reports/wards-stay`, {
//   //       params: { max_days: maxDays }
//   //     });
//   //     setData(response.data);
//   //   } catch (error) {
//   //     console.error('Error fetching wards stay report:', error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };



//   useEffect(() => {
//     fetchData();
//   }, []);




  
//   return (
    // <Box sx={{ p: 3 }}>
    //   <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
    //     <Tooltip title="Вернуться к списку отчетов">
    //       <IconButton onClick={() => navigate('/reports')}>
    //         <ArrowBack />
    //       </IconButton>
    //     </Tooltip>
    //     <Typography variant="h4">Палаты по длительности пребывания</Typography>
    //     <Tooltip title="Обновить данные">
    //       <IconButton onClick={fetchData} color="primary">
    //         <Refresh />
    //       </IconButton>
    //     </Tooltip>
    //   </Box>

    //   {loading && <LinearProgress sx={{ mb: 2 }} />}

    //   <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
    //     <div style={{ flex: 1 }}>
    //       <TextField
    //         fullWidth
    //         label="Максимальное количество дней"
    //         type="number"
    //         value={maxDays}
    //         onChange={(e) => setMaxDays(e.target.value)}
    //         size="small"
    //         inputProps={{ min: 1 }}
    //       />
    //     </div>
    //     <div style={{ flex: 1, maxWidth: '200px' }}>
    //       <Button 
    //         fullWidth 
    //         variant="contained" 
    //         onClick={fetchData}
    //         sx={{ height: '40px' }}
    //       >
    //         Применить
    //       </Button>
    //     </div>
    //   </div>

//       {/* <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>Номер палаты</TableCell>
//               <TableCell>Пациент</TableCell>
//               <TableCell>Дата поступления</TableCell>
//               <TableCell>Дата выписки</TableCell>
//               <TableCell>Дней в палате</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((row, index) => (
//               <TableRow key={index} hover>
//                 <TableCell>{row.ward_number}</TableCell>
//                 <TableCell>{row.patient_names}</TableCell>
//                 <TableCell>{dayjs(row.admission_date).format('DD.MM.YYYY')}</TableCell>
//                 <TableCell>{dayjs(row.discharge_date).format('DD.MM.YYYY')}</TableCell>
//                 <TableCell>{row.patient_stay_days}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer> */}


// <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>Номер палаты</TableCell>
//               <TableCell>Отделение</TableCell>
//               <TableCell>Врач</TableCell>
//               <TableCell>Специализация</TableCell>
//               <TableCell>Макс. дней</TableCell>
//               <TableCell>Кол-во пациентов</TableCell>
//               <TableCell>Пациенты</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={index} hover>
//                 <TableCell>{item.ward_number}</TableCell>
//                 <TableCell>{item.department_name}</TableCell>
//                 <TableCell>{item.doctor_name}</TableCell>
//                 <TableCell>{item.specialty_name}</TableCell>
//                 <TableCell>{item.max_stay_days}</TableCell>
//                 <TableCell>{item.patient_count}</TableCell>
//                 <TableCell>
//                   {item.patients.map((patient, idx) => (
//                     <React.Fragment key={idx}>
//                       <Typography variant="body2">
//                         {patient.name}
//                       </Typography>
//                       <Typography variant="caption">
//                         Поступила: {dayjs(patient.admission_date).format('DD.MM.YYYY')}
//                       </Typography>
//                       <Typography variant="caption">
//                         Выписана: {dayjs(patient.discharge_date).format('DD.MM.YYYY')}
//                       </Typography>
//                       <Typography variant="caption">
//                         Дней в палате: {patient.stay_days}
//                       </Typography>
//                       <br />
//                     </React.Fragment>
//                   ))}
//                 </TableCell>
//                 </TableRow>
//                 ))}
//                 </TableBody>
//                 </Table>
//                 </TableContainer>



//         {data.length === 0 && !loading && (
//           <Typography sx={{ mt: 2, textAlign: 'center' }}>
//             Нет данных для отображения
//           </Typography>
//         )}
//         </Box>



//   );
// };

// export default WardsStayReport;













// import React, { useState, useEffect } from 'react';
// import { Typography, Table, TableCell, TableContainer, Paper, Box, TableHead, TableRow, TableBody, Button, Tooltip, IconButton, LinearProgress, TextField } from '@mui/material';
// import axios from 'axios';
// import { ArrowBack, Refresh } from '@mui/icons-material';

// interface WardStayData {
//   // patient_names: string;
//   ward_number: string;
//   department_name: string;
//   doctor_name: string;
//   specialty_name: string;
//   max_stay_days: number;
//   patient_count: number;
//   patients: {
//     name: string;
//     admission_date: string;
//     discharge_date: string;
//     stay_days: number;
//   }[];
// }

// const WardsStayReport = () => {
//   const [data, setData] = useState<WardStayData[]>([]);
//   const [maxDays, setMaxDays] = useState('30');
//   const [loading, setLoading] = useState(false);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       params.append('max_days', maxDays);
      
//       const response = await axios.get(`http://localhost:3000/reports/wards-stay`, { params });
//       const data = response.data;
// console.log(data);
//       // Проверка на null/undefined
//       if (data) {
//         setData(data);
//       }
//     } catch (error) {
//       console.error('Error fetching wards stay report:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   function dayjs(admission_date: string) {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
//         <Tooltip title="Вернуться к списку отчетов">
//           <IconButton onClick={() => navigator('/reports')}>
//             <ArrowBack />
//           </IconButton>
//         </Tooltip>
//         <Typography variant="h4">Палаты по длительности пребывания</Typography>
//         <Tooltip title="Обновить данные">
//           <IconButton onClick={fetchData} color="primary">
//             <Refresh />
//           </IconButton>
//         </Tooltip>
//       </Box>

//       {loading && <LinearProgress sx={{ mb: 2 }} />}

//       <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
//         <div style={{ flex: 1 }}>
//           <TextField
//             fullWidth
//             label="Максимальное количество дней"
//             type="number"
//             value={maxDays}
//             onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setMaxDays(e.target.value)}
//             size="small"
//             inputProps={{ min: 1 }}
//           />
//         </div>
//         <div style={{ flex: 1, maxWidth: '200px' }}>
//           <Button 
//             fullWidth 
//             variant="contained" 
//             onClick={fetchData}
//             sx={{ height: '40px' }}
//           >
//             Применить
//           </Button>
//         </div>
//       </div>


//       <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>Номер палаты</TableCell>
//               <TableCell>Отделение</TableCell>
//               <TableCell>Врач</TableCell>
//               <TableCell>Специализация</TableCell>
//               <TableCell>Макс. дней</TableCell>
//               <TableCell>Пациенты</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.map((item, index) => (
//               <TableRow key={index} hover>
//                 <TableCell>{item.ward_number}</TableCell>
//                 <TableCell>{item.department_name}</TableCell>
//                 <TableCell>{item.doctor_name}</TableCell>
//                 <TableCell>{item.specialty_name}</TableCell>
//                 <TableCell>{item.max_stay_days}</TableCell>

//                 <TableCell>
//                   {item.patients?.map((patient, idx) => (
//                     <React.Fragment key={idx}>
//                       <Typography variant="body2">
//                         {patient.name}
//                       </Typography>
//                       <Typography variant="caption">
//                         Поступила: {dayjs(patient.admission_date).format('DD.MM.YYYY')}
//                       </Typography>
//                       <Typography variant="caption">
//                         Выписана: {dayjs(patient.discharge_date).format('DD.MM.YYYY')}
//                       </Typography>
//                       <Typography variant="caption">
//                         Дней в палате: {patient.stay_days}
//                       </Typography>
//                       <br />
//                     </React.Fragment>
//                   ))}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {data.length === 0 && !loading && (
//         <Typography sx={{ mt: 2, textAlign: 'center' }}>
//           Нет данных для отображения
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default WardsStayReport;



















// import React, { useState, useEffect } from 'react';
// import { 
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   TextField,
//   Tooltip,
//   IconButton,
//   LinearProgress,
//   CircularProgress
// } from '@mui/material';
// import { ArrowBack, Refresh } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import dayjs from 'dayjs';
// import axios from 'axios';

// interface PatientData {
//   name: string;
//   admission_date: string;
//   discharge_date: string | null;
//   stay_days: number;
// }

// interface WardStayData {
//   ward_number: string;
//   department_name: string;
//   doctor_name: string;
//   specialty_name: string;
//   max_stay_days: number;
//   patient_count: number;
//   patients: PatientData[];
// }

// const WardsStayReport = () => {
//   const [data, setData] = useState<WardStayData[]>([]);
//   const [maxDays, setMaxDays] = useState('30');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // const fetchData = async () => {
//   //   setLoading(true);
//   //   setError(null);
//   //   try {
//   //     const response = await axios.get(`http://localhost:3000/reports/wards-stay`, {
//   //       params: { max_days: maxDays }
//   //     });
//   //     setData(response.data || []);
//   //   } catch (err) {
//   //     console.error('Error fetching wards stay report:', err);
//   //     setError('Не удалось загрузить данные');
//   //     setData([]);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`http://localhost:3000/reports/wards-stay`, {
//         params: { max_days: maxDays }

//       });
//       if (response.data) {
//         setData(response.data);
//       } else {
//         setData([]);
//       }
//               console.log(response.data);
//     } catch (err) {
//       console.error('Error fetching wards stay report:', err);
//       setError('Не удалось загрузить данные');
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
//         <Tooltip title="Вернуться к списку отчетов">
//           <IconButton onClick={() => navigate('/reports')}>
//             <ArrowBack />
//           </IconButton>
//         </Tooltip>
//         <Typography variant="h4">Палаты по длительности пребывания</Typography>
//         <Tooltip title="Обновить данные">
//           <IconButton onClick={fetchData} color="primary">
//             <Refresh />
//           </IconButton>
//         </Tooltip>
//       </Box>

//       {loading && <LinearProgress sx={{ mb: 2 }} />}
//       {error && (
//         <Typography color="error" sx={{ mb: 2 }}>
//           {error}
//         </Typography>
//       )}

//       <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//         <TextField
//           fullWidth
//           label="Максимальное количество дней"
//           type="number"
//           value={maxDays}
//           onChange={(e) => setMaxDays(e.target.value)}
//           size="small"
//           inputProps={{ min: 1 }}
//           sx={{ maxWidth: 400 }}
//         />
//         <Button 
//           variant="contained" 
//           onClick={fetchData}
//           disabled={loading}
//           sx={{ height: 40, width: 200 }}
//         >
//           Применить
//         </Button>
//       </Box>

//       <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>Номер палаты</TableCell>
//               <TableCell>Отделение</TableCell>
//               <TableCell>Врач</TableCell>
//               <TableCell>Специализация</TableCell>
//               <TableCell>Макс. дней</TableCell>
//               <TableCell>Кол-во пациентов</TableCell>
//               <TableCell>Пациенты</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.length > 0 ? (
//               data.flatMap((ward, wardIdx) => 
//                 (ward.patients || []).map((patient, patientIdx) => (
//                   <TableRow key={`${wardIdx}-${patientIdx}`} hover>
//                     <TableCell>{ward.ward_number}</TableCell>
//                     <TableCell>{ward.department_name}</TableCell>
//                     <TableCell>{ward.doctor_name}</TableCell>
//                     <TableCell>{ward.specialty_name}</TableCell>
//                     <TableCell>{ward.max_stay_days}</TableCell>
//                     <TableCell>{ward.patient_count}</TableCell>
//                     <TableCell>
//                       <Typography variant="body2">{patient.name}</Typography>
//                       <Typography variant="caption" display="block">
//                         Поступил: {dayjs(patient.admission_date).format('DD.MM.YYYY')}
//                       </Typography>
//                       {patient.discharge_date && (
//                         <Typography variant="caption" display="block">
//                           Выписан: {dayjs(patient.discharge_date).format('DD.MM.YYYY')}
//                         </Typography>
//                       )}
//                       <Typography variant="caption" display="block">
//                         Дней в палате: {patient.stay_days}
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   {loading ? 'Загрузка...' : 'Нет данных для отображения'}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default WardsStayReport;















// // отрабатывает
// import React, { useState, useEffect } from 'react';
// import { 
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
//   TextField,
//   Tooltip,
//   IconButton,
//   LinearProgress,
//   CircularProgress
// } from '@mui/material';
// import { ArrowBack, Refresh } from '@mui/icons-material';
// import { useNavigate } from 'react-router-dom';
// import dayjs from 'dayjs';
// import axios from 'axios';

// interface PatientData {
//   name: string;
//   admission_date: string;
//   discharge_date: string | null;
//   stay_days: number;
// }

// interface WardStayData {
//   ward_number: string;
//   department_name: string;
//   doctor_name: string;
//   specialty_name: string;
//   max_stay_days: number;
//   patient_count: number;
//   patients: PatientData[];
// }

// const WardsStayReport = () => {
//   const [data, setData] = useState<WardStayData[]>([]);
//   const [maxDays, setMaxDays] = useState('30');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get(`http://localhost:3000/reports/wards-stay`, {
//         params: { max_days: maxDays }
//       });
//       if (Array.isArray(response.data)) {
//         setData(response.data);
//       } else {
//         setData([]);
//       }
//       console.log('Received data:', response.data);
//     } catch (err) {
//       console.error('Error fetching wards stay report:', err);
//       setError('Не удалось загрузить данные');
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const renderPatients = (patients: PatientData[]) => {
//     if (!patients || patients.length === 0) {
//       return <Typography variant="body2">Нет пациентов</Typography>;
//     }
    
//     return patients.map((patient, index) => (
//       <Box key={index} sx={{ mb: 2 }}>
//         <Typography variant="body2">{patient.name}</Typography>
//         <Typography variant="caption" display="block">
//           Поступил: {dayjs(patient.admission_date).format('DD.MM.YYYY')}
//         </Typography>
//         {patient.discharge_date && (
//           <Typography variant="caption" display="block">
//             Выписан: {dayjs(patient.discharge_date).format('DD.MM.YYYY')}
//           </Typography>
//         )}
//         <Typography variant="caption" display="block">
//           Дней в палате: {patient.stay_days}
//         </Typography>
//       </Box>
//     ));
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
//         <Tooltip title="Вернуться к списку отчетов">
//           <IconButton onClick={() => navigate('/reports')}>
//             <ArrowBack />
//           </IconButton>
//         </Tooltip>
//         <Typography variant="h4">Палаты по длительности пребывания</Typography>
//         <Tooltip title="Обновить данные">
//           <IconButton onClick={fetchData} color="primary">
//             <Refresh />
//           </IconButton>
//         </Tooltip>
//       </Box>

//       {loading && <LinearProgress sx={{ mb: 2 }} />}
//       {error && (
//         <Typography color="error" sx={{ mb: 2 }}>
//           {error}
//         </Typography>
//       )}

//       <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
//         <TextField
//           fullWidth
//           label="Максимальное количество дней"
//           type="number"
//           value={maxDays}
//           onChange={(e) => setMaxDays(e.target.value)}
//           size="small"
//           inputProps={{ min: 1 }}
//           sx={{ maxWidth: 400 }}
//         />
//         <Button 
//           variant="contained" 
//           onClick={fetchData}
//           disabled={loading}
//           sx={{ height: 40, width: 200 }}
//         >
//           Применить
//         </Button>
//       </Box>

//       <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
//         <Table stickyHeader>
//           <TableHead>
//             <TableRow>
//               <TableCell>Номер палаты</TableCell>
//               <TableCell>Отделение</TableCell>
//               <TableCell>Врач</TableCell>
//               <TableCell>Специализация</TableCell>
//               <TableCell>Макс. дней</TableCell>
//               <TableCell>Кол-во пациентов</TableCell>
//               <TableCell>Пациенты</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   <CircularProgress />
//                 </TableCell>
//               </TableRow>
//             ) : data.length > 0 ? (
//               data.map((ward, wardIdx) => (
//                 <TableRow key={wardIdx} hover>
//                   <TableCell>{ward.ward_number}</TableCell>
//                   <TableCell>{ward.department_name}</TableCell>
//                   <TableCell>{ward.doctor_name}</TableCell>
//                   <TableCell>{ward.specialty_name}</TableCell>
//                   <TableCell>{ward.max_stay_days}</TableCell>
//                   <TableCell>{ward.patient_count}</TableCell>
//                   <TableCell>
//                     {renderPatients(ward.patients || [])}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={7} align="center">
//                   Нет данных для отображения
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Box>
//   );
// };

// export default WardsStayReport;








import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Tooltip,
  IconButton,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import axios from 'axios';

interface PatientData {
  names: string;
  name: string;
  admission_date: string;
  discharge_date: string | null;
  stay_days: number;
}

interface WardStayData {
  ward_number: string;
  department_name: string;
  doctor_name: string;
  specialty_name: string;
  max_stay_days: number;
  patient_count: number;
  patients: PatientData[];
}

const WardsStayReport = () => {
  const [data, setData] = useState<WardStayData[]>([]);
  const [maxDays, setMaxDays] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3000/reports/wards-stay`, {
        params: { max_days: maxDays }
      });
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData([]);
      }
      console.log('Received data:', response.data);
    } catch (err) {
      console.error('Error fetching wards stay report:', err);
      setError('Не удалось загрузить данные');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string | null) => {
    return dateString ? dayjs(dateString).format('DD.MM.YYYY') : 'Не выписан';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Tooltip title="Вернуться к списку отчетов">
          <IconButton onClick={() => navigate('/reports')}>
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h4">Палаты по длительности пребывания</Typography>
        <Tooltip title="Обновить данные">
          <IconButton onClick={fetchData} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Максимальное количество дней"
          type="number"
          value={maxDays}
          onChange={(e) => setMaxDays(e.target.value)}
          size="small"
          inputProps={{ min: 1 }}
          sx={{ maxWidth: 400 }}
        />
        <Button 
          variant="contained" 
          onClick={fetchData}
          disabled={loading}
          sx={{ height: 40, width: 200 }}
        >
          Применить
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Номер палаты</TableCell>
              <TableCell>Отделение</TableCell>
              <TableCell>Врач</TableCell>
              <TableCell>Специализация</TableCell>
              <TableCell>Макс. дней</TableCell>
              <TableCell>Кол-во пациентов</TableCell>
              <TableCell>ФИО пациента</TableCell>
              <TableCell>Дата поступления</TableCell>
              <TableCell>Дата выписки</TableCell>
              <TableCell>Дней в палате</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.flatMap(ward => 
                ward.patients?.map((patient, index) => (
                  <TableRow key={`${ward.ward_number}-${index}`} hover>
                    <TableCell>{ward.ward_number}</TableCell>
                    <TableCell>{ward.department_name}</TableCell>
                    <TableCell>{ward.doctor_name}</TableCell>
                    <TableCell>{ward.specialty_name}</TableCell>
                    <TableCell>{ward.max_stay_days}</TableCell>
                    <TableCell>{ward.patient_count}</TableCell>
                    <TableCell>{patient.names}</TableCell>
                    <TableCell>{formatDate(patient.admission_date)}</TableCell>
                    <TableCell>{formatDate(patient.discharge_date)}</TableCell>
                    <TableCell>{patient.stay_days}</TableCell>
                  </TableRow>
                )) ?? (
                  <TableRow key={ward.ward_number} hover>
                    <TableCell>{ward.ward_number}</TableCell>
                    <TableCell>{ward.department_name}</TableCell>
                    <TableCell>{ward.doctor_name}</TableCell>
                    <TableCell>{ward.specialty_name}</TableCell>
                    <TableCell>{ward.max_stay_days}</TableCell>
                    <TableCell>{ward.patient_count}</TableCell>
                    <TableCell colSpan={4} align="center">Нет данных о пациентах</TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  Нет данных для отображения
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default WardsStayReport;