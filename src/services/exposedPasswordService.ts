import axios from 'axios';
import { sha } from '../functions/crypto';

export default class ExposedPasswordService {
  public checkPassword = async (password: string): Promise<number> => {
    const hash = sha(password, 'sha1');
    const header = hash.slice(0, 5);
    const body = hash.slice(5);

    const result = await axios.get<string>(`https://api.pwnedpasswords.com/range/${header}`);
    const resultArray = result.data.split('\n');
    const exposed = resultArray.filter((val) => val.trim().startsWith(body));
    return exposed.reduce((prevValue, currValue) => {
      const numberOfExposed = parseInt(currValue.split(':')[1], 10);
      return prevValue + numberOfExposed;
    }, 0);
  };
}
