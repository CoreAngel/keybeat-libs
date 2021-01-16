import { Connection, Repository } from 'typeorm';
import ActionEntity, { ActionType } from '../entities/action';

export default class ActionService {
  private repository: Repository<ActionEntity>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(ActionEntity);
  }

  public create = async (action: ActionEntity) => {
    return this.repository.save(action);
  };

  public findCreatedActions = async (userId: number) => {
    return this.findActions(userId, ActionType.CREATED);
  };

  public findModifiedActions = async (userId: number) => {
    return this.findActions(userId, ActionType.MODIFIED);
  };

  public findDeletedActions = async (userId: number) => {
    return this.findActions(userId, ActionType.DELETED);
  };

  public deleteCreatedActions = async (userId: number) => {
    await this.deleteActions(userId, ActionType.CREATED);
  };

  public deleteModifiedActions = async (userId: number) => {
    await this.deleteActions(userId, ActionType.MODIFIED);
  };

  public deleteDeletedActions = async (userId: number) => {
    await this.deleteActions(userId, ActionType.DELETED);
  };

  public deleteUserActions = async (userId: number) => {
    await this.repository.delete({ userId });
  };

  private findActions = async (userId: number, type: ActionType) => {
    return this.repository.find({ userId, type });
  };

  private deleteActions = async (userId: number, type: ActionType) => {
    await this.repository.delete({ userId, type });
  };
}
