import { Connection, Repository } from 'typeorm';
import UserEntity from '../entities/user';

export default class UserService {
  private repository: Repository<UserEntity>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(UserEntity);
  }

  public create = async (user: UserEntity) => {
    return this.repository.save(user);
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

  public deleteUser = async ({ id }: UserEntity) => {
    await this.repository.delete({ id });
  };
}
