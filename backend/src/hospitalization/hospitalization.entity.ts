import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../patient/patient.entity';
import { Ward } from '../ward/ward.entity';

@Entity()
export class Hospitalization {
  @PrimaryGeneratedColumn()
  hospitalization_id: number;

  @ManyToOne(() => Patient, patient => patient.hospitalizations)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => Ward, ward => ward.hospitalizations)
  @JoinColumn({ name: 'ward_id' })
  ward: Ward;

  @Column({ type: 'date' })
  admission_date: Date;

  @Column({ type: 'date', nullable: true })
  discharge_date: Date | null;

  @Column({ type: 'text', nullable: true })
  diagnosis: string | null;
}