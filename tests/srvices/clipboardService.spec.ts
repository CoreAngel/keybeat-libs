import ClipboardService from '../../src/services/clipboardService';
import { read, write } from 'clipboardy';
import { sha   } from "../../src/functions/crypto";

describe('clipboard service', () => {
  let service: ClipboardService;
  const str = 'data';

  beforeEach(() => {
    service = new ClipboardService();
  })

  it('should write data to clipboard', async () => {
    await service.write(str);
    const data = await read()
    expect(data).toBe(str);
  });

  it('should read data to clipboard', async () => {
    await write(str);
    const data = await service.read()
    expect(data).toBe(str);
  });

  it('should clear clipboard', async () => {
    await write(str);
    const hash = sha(str)
    await service.clear(hash)
    const curr = await read();
    expect(curr).toBe('');
  });

  it('should not clear clipboard', async () => {
    await write(str);
    await service.clear(str)
    const curr = await read();
    expect(curr).toBe(str);
  });
})
