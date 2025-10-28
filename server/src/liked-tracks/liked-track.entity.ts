import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('liked_tracks')
export class LikedTrack {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' })
    userId!: string;

    @Column({ type: 'varchar' })
    trackId!: string;

    @Column({ type: 'varchar' })
    trackName!: string;

    @Column({ type: 'varchar', nullable: true })
    artistName?: string;

    @Column({ type: 'varchar', nullable: true })
    albumName?: string;

    @Column({ type: 'varchar', nullable: true })
    imageUrl?: string;

    @CreateDateColumn()
    likedAt!: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;
}
