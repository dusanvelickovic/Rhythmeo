import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Playlist } from '../playlist/playlist.entity';

@Entity('playlist_tracks')
export class PlaylistTrack {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' })
    playlistId!: number;

    @Column({ type: 'varchar' })
    trackId!: string;

    @ManyToOne(() => Playlist)
    @JoinColumn({ name: 'playlistId' })
    playlist!: Playlist;
}
