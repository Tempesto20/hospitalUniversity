import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Specialty } from '../specialty/specialty.entity';
import { Ward } from '../ward/ward.entity';
import { Appointment } from '../appointment/appointment.entity';

// @Entity()
// export class Doctor {
//   @PrimaryGeneratedColumn()
//   doctor_id: number;

//   @Column({ length: 255 })
//   full_name: string;

//   @ManyToOne(() => Specialty, specialty => specialty.doctors, { onDelete: 'SET NULL' })
//   @JoinColumn({ name: 'specialty_id' })
//   specialty: Specialty;

//   @OneToMany(() => Ward, ward => ward.doctor)
//   wards: Ward[];

//   @OneToMany(() => Appointment, appointment => appointment.doctor)
//   appointments: Appointment[];
// }



@Entity()
export class Doctor {
  // @PrimaryGeneratedColumn()
  // doctor_id: number;

  // @Column({ length: 255 })
  // full_name: string;

  // @ManyToOne(() => Specialty, specialty => specialty.doctors, { 
  //   onDelete: 'SET NULL',
  //   nullable: true // This allows the relation to be null
  // })
  // @JoinColumn({ name: 'specialty_id' })
  // specialty: Specialty | null; // Make sure to type it as possibly null

  @PrimaryGeneratedColumn()
  doctor_id: number;

  @Column({ length: 255 })
  full_name: string;

  @ManyToOne(() => Specialty, specialty => specialty.doctors, { 
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({ name: 'specialty_id' })
  specialty: Specialty | null;



  @OneToMany(() => Ward, ward => ward.doctor)
  wards: Ward[];

  @OneToMany(() => Appointment, appointment => appointment.doctor)
  appointments: Appointment[];
}