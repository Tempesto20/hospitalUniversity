import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../patient/patient.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Ward } from '../ward/ward.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  appointment_id: number;

  @ManyToOne(() => Patient, { eager: true })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Ward, { eager: true, nullable: true })
  @JoinColumn({ name: 'ward_id' })
  ward: Ward | null;

  @Column('date')
  appointment_date: Date;

  @Column('text', { nullable: true })
  symptom: string | null;

  @Column('text', { nullable: true })
  diagnos: string | null;

  @Column('text', { nullable: true })
  allergy: string | null;

  @Column('text', { nullable: true })
  preparation: string | null;
}