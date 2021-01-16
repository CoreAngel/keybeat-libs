import UserService from './userService';
import CredentialService from './credentialService';
import ActionService from './actionService';
import ApiService from './apiService';
import CredentialEntity from '../entities/credential';

export default class SynchronizationService {
  constructor(
    private userService: UserService,
    private credentialService: CredentialService,
    private actionService: ActionService,
    private apiService: ApiService,
  ) {}

  public synchronize = async (userId: number, lastSynchronizedDate: number) => {
    const credentials = await this.credentialService.getCredentials(userId);
    const ids = credentials.map(({ uuid }) => uuid).filter((uuid) => uuid !== null);
    const synchroData = await this.syncCredentials(ids, lastSynchronizedDate);

    const created = await this.createdCredentials(userId, credentials);
    const modified = await this.modifiedCredentials(userId, credentials);
    const deletedIds = (await this.actionService.findDeletedActions(userId))
      .map(({ credentialUuid }) => credentialUuid)
      .filter((uuid) => uuid !== undefined);

    const { modified: modifiedSyncho, deleted: deletedSyncho } = synchroData;
    await this.userService.updateSynchroDate(userId, synchroData.date);

    const modifiedSynchoFiltered = modifiedSyncho
      .filter(({ id }) => !modified.some(({ uuid }) => id === uuid))
      .filter(({ id }) => !deletedIds.some((uuid) => id === uuid));
    modifiedSynchoFiltered.forEach(({ id, data }) => this.credentialService.createOrModifyCredential(userId, id, data));

    const deletedSynchoFiltered = deletedSyncho
      .filter((id) => !modified.some(({ uuid }) => id === uuid))
      .filter((id) => !deletedIds.some((uuid) => id === uuid));
    deletedSynchoFiltered.forEach((id) => this.credentialService.deleteCredentialByUuid(id));

    if (created.length > 0) {
      const mappedIds = await this.addCredential(created);
      await this.actionService.deleteCreatedActions(userId);
      mappedIds.forEach(({ id, uuid }) => this.credentialService.setUuid(id, uuid));
    }

    if (modified.length > 0) {
      await this.modifyCredential(modified);
    }

    if (deletedIds.length > 0) {
      await this.deleteCredential(deletedIds);
    }
  };

  private syncCredentials = async (ids: string[], lastSynchronizedDate: number) => {
    const result = await this.apiService.synchronizeCredential({ ids, lastSynchronizedDate });

    if (result.data.errors.length > 0) {
      throw result.data.errors;
    }

    return result.data.data;
  };

  private createdCredentials = async (userId: number, credentials: CredentialEntity[]) => {
    const createdActions = await this.actionService.findCreatedActions(userId);
    return credentials.filter(({ id }) => createdActions.some(({ credentialId }) => credentialId === id));
  };

  private modifiedCredentials = async (userId: number, credentials: CredentialEntity[]) => {
    const modifiedActions = await this.actionService.findModifiedActions(userId);
    return credentials.filter(({ id }) => modifiedActions.some(({ credentialId }) => credentialId === id));
  };

  private addCredential = async (items: CredentialEntity[]) => {
    const dataToSend = items.map(({ id, data }) => ({ id, data }));
    const result = await this.apiService.addCredential(dataToSend);

    if (result.data.errors.length > 0) {
      throw result.data.errors;
    }

    return result.data.data.items;
  };

  private modifyCredential = async (items: CredentialEntity[]) => {
    const dataToSend = items.map(({ uuid, data }) => ({ id: uuid, data }));
    const result = await this.apiService.modifyCredential(dataToSend);

    if (result.data.errors.length > 0) {
      throw result.data.errors;
    }
  };

  private deleteCredential = async (items: string[]) => {
    const dataToSend = items.map((uuid) => ({ id: uuid }));
    const result = await this.apiService.deleteCredential(dataToSend);

    if (result.data.errors.length > 0) {
      throw result.data.errors;
    }
  };
}
