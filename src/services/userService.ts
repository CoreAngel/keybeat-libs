import { Connection, Repository } from 'typeorm';
import UserEntity from '../entities/user';

interface CreateOrUpdateType {
  name: string;
  login: string;
  salt: string;
  hash: string;
  active: boolean;
}

export default class UserService {
  private repository: Repository<UserEntity>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(UserEntity);
  }

  public createOrUpdate = async (user: CreateOrUpdateType) => {
    await this.repository.update({ active: true }, { active: false });
    const foundUser = await this.findUserByLogin(user.login);
    if (!foundUser) {
      return this.repository.save({ ...user, lastSynchronize: 100000 });
    }
    const { id, lastSynchronize } = foundUser;
    await this.repository.update({ id }, { ...user, lastSynchronize });
    return foundUser;
  };

  public getUsers = async () => {
    return this.repository.find();
  };

  public getActiveUser = async () => {
    return this.repository.findOne({ active: true });
  };

  public findUserById = async (id: number) => {
    return this.repository.findOne({ id });
  };

  public findUserByLogin = async (login: string) => {
    return this.repository.findOne({ login });
  };

  public setActiveUser = async ({ id }: UserEntity) => {
    await this.repository.update({ active: true }, { active: false });
    return this.repository.update({ id }, { active: true });
  };

  public changePassword = async ({ id, salt, hash }: UserEntity) => {
    await this.repository.update({ id }, { salt, hash });
  };

  public updateSynchroDate = async (id: number, lastSynchronize: number) => {
    await this.repository.update({ id }, { lastSynchronize });
  };

  public deleteUser = async ({ id }: UserEntity) => {
    await this.repository.delete({ id });
  };
}
