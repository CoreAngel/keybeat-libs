import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Credentials')
export default class CredentialEntity {
  @PrimaryGeneratedColumn('uuid')
  public id?: string;

  @Column({ type: 'int' })
  public userId: number;

  @Column({ type: 'text', nullable: true })
  public uuid?: string;

  @Column({ type: 'text' })
  public data: string;
}
