import axios from 'axios';
import { AppointmentData, DepartmentData, DoctorData, PatientData, SpecialtyData, WardData } from './types';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Specialty API
export const fetchSpecialties = () => api.get('/specialties');
export const fetchSpecialty = (id: number) => api.get(`/specialties/${id}`);
export const createSpecialty = (specialty: SpecialtyData) => api.post('/specialties', specialty);
export const updateSpecialty = (id: number, specialty: SpecialtyData) => api.put(`/specialties/${id}`, specialty);
export const deleteSpecialty = (id: number) => api.delete(`/specialties/${id}`);

// Doctor API
export const fetchDoctors = () => api.get('/doctors');
export const fetchDoctor = (id: number) => api.get(`/doctors/${id}`);
export const createDoctor = (doctor: DoctorData) => api.post('/doctors', doctor);
export const updateDoctor = (id: number, doctor: DoctorData) => api.put(`/doctors/${id}`, doctor);
export const deleteDoctor = (id: number) => api.delete(`/doctors/${id}`);


// ------------------------------------------------------------------------
export const fetchCombineDoctors = () => api.get('/doctors/with-specialties');
// ------------------------------------------------------------------------


// Patient API
export const fetchPatients = () => api.get('/patients');
export const fetchPatient = (id: number) => api.get(`/patients/${id}`);
// export const createPatient = (patient: PatientData) => api.post('/patients', patient);
// export const updatePatient = (id: number, patient: PatientData) => api.put(`/patients/${id}`, patient);
export const deletePatient = (id: number) => api.delete(`/patients/${id}`);


// ------------------------------------------------------------------------
export const fetchCombinePatients = () => api.get('/patients/with-combines');
// ------------------------------------------------------------------------



// работает создание

export const createPatient = (patient: Omit<PatientData, 'patient_id'>) => {
  return api.post('/patients', patient);
};

export const updatePatient = (id: number, patient: Partial<PatientData>) => {
  const payload = {
    full_name: patient.full_name,
    birth_date: patient.birth_date,
    insurance_policy: patient.insurance_policy,
    passport: patient.passport,
    admission_date: patient.admission_date,
    discharge_date: patient.discharge_date || null,
    doctor_id: patient.doctor_id || null,
    ward_number: patient.ward_number || null,
    diagnos: patient.diagnos || '',
    symptom: patient.symptom || '',
    allergy: patient.allergy || '',
    preparation: patient.preparation || ''
  };
  return api.put(`/patients/${id}`, payload);
};



api.interceptors.request.use(config => {
  console.log('Request:', config.method?.toUpperCase(), config.url);
  console.log('Request Data:', config.data);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 400) {
      console.error('Validation errors:', error.response.data);
      // Можно добавить обработку конкретных ошибок валидации
    }
    return Promise.reject(error);
  }
);










// Department API
export const fetchDepartments = () => api.get('/departments');
export const fetchDepartment = (id: number) => api.get(`/departments/${id}`);
export const createDepartment = (department: DepartmentData) => api.post('/departments', department);
export const updateDepartment = (id: number, department: DepartmentData) => api.put(`/departments/${id}`, department);
export const deleteDepartment = (id: number) => api.delete(`/departments/${id}`);




// Ward API
export const fetchWards = () => api.get('/wards');
export const fetchWard = (id: number) => api.get(`/wards/${id}`);
// export const createWard = (ward: WardData) => api.post('/wards', ward);
// export const updateWard = (id: number, ward: WardData) => api.put(`/wards/${id}`, ward);
export const deleteWard = (id: number) => api.delete(`/wards/${id}`);


export const fetchCombinehWards = () => api.get('/wards/with-combines');

// export const createWard = (ward: {
//   ward_number: number | string;
//   department_id: number | string;
//   doctor_id?: number | string | null;
// }) => {
//   return api.post('/wards', {
//     ward_number: String(ward.ward_number),
//     department_id: String(ward.department_id),
//     doctor_id: ward.doctor_id ? String(ward.doctor_id) : null
//   });
// };


export const createWard = (ward: {
  ward_number: number;
  department_id: number;
  doctor_id?: number | null;
}) => {
  return api.post('/wards', {
    ward_number: ward.ward_number,
    department_id: ward.department_id,
    doctor_id: ward.doctor_id !== undefined ? ward.doctor_id : null
  });
};



export const updateWard = (id: number, ward: {
  ward_number?: number;
  department_id?: number;
  doctor_id?: number | null;
}) => {
  return api.put(`/wards/${id}`, {
    ward_number: Number(ward.ward_number),
    department_id: Number(ward.department_id),
    doctor_id: ward.doctor_id ? Number(ward.doctor_id) : null
  });
};



// ------------------------------------------------------------------------
// export const fetchCombinehWards = () => api.get('/wards/with-wards');
// ------------------------------------------------------------------------

// Appointment API
export const fetchAppointments = () => api.get('/appointments');
export const fetchAppointment = (id: number) => api.get(`/appointments/${id}`);
export const createAppointment = (appointment: AppointmentData) => api.post('/appointments', appointment);
export const updateAppointment = (id: number, appointment: AppointmentData) => api.put(`/appointments/${id}`, appointment);
export const deleteAppointment = (id: number) => api.delete(`/appointments/${id}`);

// ------------------------------------------------------------------------
export const fetchCombinehAppointments = () => api.get('/appointments/with-appointments');
// ------------------------------------------------------------------------



// Отчеты
// ------------------------------------------------------------------------
// Отчет А
export const fetchСomplaints = () => api.get(`http://localhost:3000/complaints`);
// ------------------------------------------------------------------------

// Отчет B

// ------------------------------------------------------------------------

// Отчет C

// ------------------------------------------------------------------------

export default api;