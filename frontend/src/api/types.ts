export interface SpecialtyData {
  specialty_id?: number;
  specialty_name: string;
}




export interface DoctorData {
  doctor_id?: number;
  full_name: string;
  specialty_id?: number | null;
  specialty?: {
    specialty_id: number;
    specialty_name: string;
  } | null;
  specialty_name?: string; // для обратной совместимости
}



export interface PatientData {
  patient_id?: number;
  patient_full_name?: string; // Для фронтенда
  full_name?: string; // Для бэкенда
  birth_date: string;
  insurance_policy: string;
  passport: string;
  admission_date: string;
  discharge_date?: string | null;
  doctor_id?: number | null;
  ward_number?: number | null;
  diagnos?: string;
  symptom?: string;
  allergy?: string;
  preparation?: string;
  doctor_full_name?: string;
  department_name?: string;
}




export interface DepartmentData {
  department_id?: number;
  department_name: string;
}

// export interface WardData {
//   ward_id?: number;  // сделали необязательным
//   ward_number: number;
//   department_name: string;
//   doctor_full_name: string;
// }


export interface WardData {
  ward_id?: number;
  ward_number: number;
  department_id: number; // Убираем optional, так как это обязательное поле
  department_name: string;
  doctor_id?: number | null;
  doctor_full_name?: string;
  patient_count?: number;
}



// export interface WardData {
//   ward_id?: number;
//   ward_number: number;
//   department_id: number;
//   department_name: string;
//   doctor_id: number | null;
//   doctor_full_name?: string;
// }



export interface AppointmentData {
  appointment_id?: number; // для новых записей может отсутствовать
  patient_id: number;
  patient_full_name?: string;
  doctor_id: number;
  doctor_full_name?: string;
  ward_number: number;
  department_name?: string;
  appointment_date: string;
  symptom?: string;
  diagnos?: string;
  allergy?: string;
  preparation?: string;
}