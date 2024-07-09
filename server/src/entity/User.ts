import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', unique: true })
    email: string; 

    @Column({ type: 'text' })
    password: string; 

    @Column({ type: 'int' ,default: 0 })
    loginAttempts: number; 

    @Column({ type: 'timestamp', nullable: true })
    blockedUntil: Date | null; 
}
