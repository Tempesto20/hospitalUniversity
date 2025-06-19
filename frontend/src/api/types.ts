export interface SpecialtyData {
  specialty_id?: number;
  specialty_name: string;
}

// export interface DoctorData {
//   specialty_name?: string; // делаем необязательным, так как оно может приходить с сервера
//   doctor_id?: number;
//   full_name: string;
//   specialty_id: number;
// }


export interface DoctorData {
  doctor_id?: number;
  full_name: string;
  specialty_id: number | null;  // Allow null
  specialty_name?: string;
}




export interface PatientData {
  patient_id: number;
  patient_full_name: string;
  birth_date: string;
  insurance_policy: string;
  passport: string;
  admission_date: string;
  discharge_date: string | null;
  ward_number?: number;
  department_name?: string;
  doctor_full_name?: string;
  diagnos?: string;
  symptom?: string;
  allergy?: string;
  preparation?: string;
}



export interface DepartmentData {
  department_id?: number;
  department_name: string;
}

export interface WardData {
  ward_id?: number;  // сделали необязательным
  ward_number: number;
  department_name: string;
  doctor_full_name: string;
}

// export interface AppointmentData {
//   doctor_full_name?: string;
//   department_name?: string;
//   ward_number?: number;
//   patient_full_name?: string;
//   appointment_id: number;
//   patient_id: number;
//   doctor_id: number;
//   ward_id?: number;
//   appointment_date: string;
//   symptom?: string;
//   diagnos?: string;
//   allergy?: string;
//   preparation?: string;
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