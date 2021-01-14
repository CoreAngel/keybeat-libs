import axios from 'axios';
import { sha } from '../functions/crypto';
import {toHex} from "../functions/utils";

export default class ExposedPasswordService {
  public checkPassword = async (password: string): Promise<number> => {
    const hash = await toHex(sha(password, 'sha1'));
    const header = hash.slice(0, 5);
    const body = hash.slice(5);

    const result = await axios.get<string>(`https://api.pwnedpasswords.com/range/${header}`);
    const resultArray = result.data.split('\n');
    const exposed = resultArray.filter((val) => val.trim().startsWith(body.toUpperCase()));
    return exposed.reduce((prevValue, currValue) => {
      const numberOfExposed = parseInt(currValue.split(':')[1], 10);
      return prevValue + numberOfExposed;
    }, 0);
  };
}
