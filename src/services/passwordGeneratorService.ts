import lodash from 'lodash';

export interface ConfigType {
  lower: boolean;
  upper: boolean;
  numbers: boolean;
  special: boolean;
  latin1: boolean;
}

export default class PasswordGeneratorService {
  public readonly lower = 'abcdefghijklmnopqrstuvwxyz';
  public readonly upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  public readonly numbers = '0123456789';
  public readonly special = '-_ !"\'#$%^&*+=,./:;?@\\~`|[]{}()';
  public readonly latin1 =
    '¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ';

  private config: ConfigType = {
    lower: true,
    upper: true,
    numbers: true,
    special: true,
    latin1: false,
  };

  public setConfig = (partialConfig: Partial<ConfigType>) => {
    this.config = {
      ...this.config,
      ...partialConfig,
    };
  };

  public getConfig = (): ConfigType => {
    return { ...this.config };
  };

  public generate = (size: number) => {
    const fragments = this.getFragments();

    if (fragments.length === 0) {
      throw 'Minimum one fragment must be selected'
    }

    const fragmentsSize = fragments.length;
    const passwordArray = [];

    for (let i = 0; i < size; i += 1) {
      const fragment = fragments[i % fragmentsSize];
      const randomChar = this.getRandomChar(fragment);
      passwordArray.push(randomChar);
    }

    return lodash.shuffle(passwordArray).join('');
  };

  private getRandomChar = (str: string) => {
    const index = lodash.random(0, str.length - 1);
    return str.charAt(index);
  };

  private getFragments = () => {
    const fragments: string[] = [];

    if (this.config.lower) {
      fragments.push(this.lower);
    }
    if (this.config.upper) {
      fragments.push(this.upper);
    }
    if (this.config.numbers) {
      fragments.push(this.numbers);
    }
    if (this.config.special) {
      fragments.push(this.special);
    }
    if (this.config.latin1) {
      fragments.push(this.latin1);
    }
    return fragments;
  };
}
