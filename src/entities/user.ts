import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('Users')
export default class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public id?: number;

  @Column({ type: 'text' })
  public name: string;

  @Index()
  @Column({ type: 'text' })
  public login: string;

  @Column({ type: 'text' })
  public salt: string;

  @Column({ type: 'text' })
  public hash: string;

  @Column({ type: 'int' })
  public lastSynchronize: number;

  @Column({ type: 'boolean' })
  public active: boolean;
}
