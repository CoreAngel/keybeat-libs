import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ActionType {
  CREATED = 'created',
  MODIFIED = 'modified',
  DELETED = 'deleted',
}

@Entity('Actions')
export default class ActionEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  public id?: number;

  @Column({ type: 'int' })
  public userId: number;

  @Column({ type: 'text', nullable: true })
  public credentialId?: string;

  @Column({ type: 'text', nullable: true })
  public credentialUuid?: string;

  @Column({
    type: 'simple-enum',
    enum: ActionType,
  })
  public type: ActionType;
}
