import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column({ type: 'varchar', unique: true })
    email!: string;

    @Column({type: 'varchar' })
    displayName!: string;

    @Column({ type: 'varchar', unique: true })
    spotifyId!: string;

    @Column({ type: 'varchar', nullable: true })
    accessToken?: string;

    @Column({ type: 'varchar', nullable: true })
    refreshToken?: string;

    @Column({ type: 'timestamp', nullable: true })
    tokenExpiresAt?: Date;

    @Column({ type: 'varchar', nullable: true })
    profileImage?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
