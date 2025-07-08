import { humanInterval } from '../interval';

describe('splitDateRangeAtMidnight', () => {
  it('should format valid intervals correclty', () => {
    expect(humanInterval('6')).toEqual('00:06');
    expect(humanInterval('12')).toEqual('00:12');
    expect(humanInterval('3:59')).toEqual('03:59');
    expect(humanInterval('3:59')).toEqual('03:59');
    expect(humanInterval('17:59:30')).toEqual('17:59:30');
    expect(humanInterval('00:00:30')).toEqual('00:00:30');
  });

  it('should wrap too big values', () => {
    expect(humanInterval('120')).toEqual('02:00');
    expect(humanInterval('150')).toEqual('02:30');
    expect(humanInterval('00:00:90')).toEqual('00:01:30');
    expect(humanInterval('00:59:90')).toEqual('01:00:30');
    expect(humanInterval('00:60')).toEqual('01:00');
  });

  it('should throw for invalid intervals', () => {
    // From taginfo
    expect(() => humanInterval('irregular')).toThrow(Error);
    expect(() => humanInterval('school')).toThrow(Error);
    expect(() => humanInterval('00:15-00:20')).toThrow(Error);
  });
});
