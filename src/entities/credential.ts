import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Credential')
export default class CredentialEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public id?: number;

  @Column({ type: 'int' })
  public userId: number;

  @Column({ type: 'text' })
  public uuid?: string;

  @Column({ type: 'text' })
  public data: string;
}
