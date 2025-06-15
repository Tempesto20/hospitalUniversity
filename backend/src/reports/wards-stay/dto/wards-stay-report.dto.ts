export class WardsStayDto {
  ward_number: number;
  department_name: string;
  patient_name: string;
  admission_date: Date;
  discharge_date: Date | null;
  days_in_ward: number;
  doctor_name: string | null;
  specialty_name: string | null;
  patient_id: number;
}

