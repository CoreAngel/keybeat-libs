import { read, write } from 'clipboardy';
import { sha } from '../functions/crypto';

export default class ClipboardService {
  public write = async (password: string) => {
    return write(password);
  };

  public read = async (): Promise<string> => {
    return read();
  };

  public clear = async (hash: string) => {
    const password = await this.read();
    const passHash = sha(password);
    if (hash === passHash) {
      await this.write('');
    }
  };
}
