import { Connection, Repository } from 'typeorm';
import CredentialEntity from '../entities/credential';

export default class CredentialService {
  private repository: Repository<CredentialEntity>;

  constructor(connection: Connection) {
    this.repository = connection.getRepository(CredentialEntity);
  }

  public create = async (credential: CredentialEntity) => {
    return this.repository.save(credential);
  };

  public getCredentials = async (userId: number) => {
    return this.repository.find({ userId });
  };

  public modifyCredential = async (id: string, data: string) => {
    await this.repository.update({ id }, { data });
  };

  public getCredential = async (id: string) => {
    return this.repository.findOne({ id });
  };

  public createOrModifyCredential = async (userId: number, id: string, data: string) => {
    const founded = await this.repository.findOne({ uuid: id });
    if (founded) {
      await this.repository.update({ id: founded.id }, { data });
    } else {
      await this.repository.save({ uuid: id, data, userId });
    }
  };

  public setUuid = async (id: string, uuid: string) => {
    await this.repository.update({ id }, { uuid });
  };

  public deleteCredentialById = async (id: string) => {
    await this.repository.delete({ id });
  };

  public deleteCredentialByUuid = async (uuid: string) => {
    await this.repository.delete({ uuid });
  };

  public deleteCredentials = async (userId: number) => {
    await this.repository.delete({ userId });
  };
}
