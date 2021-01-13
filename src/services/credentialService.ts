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

  public modifyCredential = async ({ id, data, iv }: CredentialEntity) => {
    await this.repository.update({ id }, { data, iv });
  };

  public setUuid = async ({ id, uuid }: CredentialEntity) => {
    await this.repository.update({ id }, { uuid });
  };

  public deleteCredential = async ({ id }: CredentialEntity) => {
    await this.repository.delete({ id });
  };

  public deleteCredentials = async (userId: number) => {
    await this.repository.delete({ userId });
  };
}
