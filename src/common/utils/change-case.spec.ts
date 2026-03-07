import { changeCase } from './change-case';

describe('Format string', () => {
  it('should return convert to uppercase', () => {
    expect(changeCase('hello')).toBe('HELLO');
  });
});
