import PasswordGeneratorService from '../../src/services/passwordGeneratorService';

describe('clipboard service', () => {
  let service: PasswordGeneratorService;

  beforeEach(() => {
    service = new PasswordGeneratorService();
  })

  it('should generate lower upper number chars password', async () => {
    service.setConfig({
      upper: true,
      lower: true,
      numbers: true,
      latin1: false,
      special: false,
    });
    const password = service.generate(16)
    const chars = service.upper + service.lower + service.numbers;
    const charsArr = chars.split('');
    const notMatchingChars = password.split('').filter(val => charsArr.indexOf(val) === -1)
    expect(password.length).toBe(16);
    expect(notMatchingChars.length).toBe(0);
  });

  it('should throw error', async () => {
    service.setConfig({
      upper: false,
      lower: false,
      numbers: false,
      latin1: false,
      special: false,
    });
    expect(() => service.generate(16)).toThrow();
  });

  it('should generate similar amount chars', async () => {
    service.setConfig({
      upper: true,
      lower: true,
      numbers: true,
      latin1: true,
      special: true,
    });
    const password = service.generate(36)
    const avgAmountChars = 36 / 5;
    const fragments = [service.upper, service.lower, service.numbers, service.latin1, service.special]

    fragments.forEach(fragment => {
      const elemsLen = password.split('').filter(val => fragment.indexOf(val) !== -1).length
      expect(Math.abs(elemsLen - avgAmountChars)).toBeLessThanOrEqual(1)
    });
  });
});
