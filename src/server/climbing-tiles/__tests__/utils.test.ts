import { getHoursUntilNextRefresh } from '../addCorsAndCache';

afterEach(() => {
  jest.restoreAllMocks();
});

test('getHoursUntilNextRefresh', () => {
  jest.spyOn(Date.prototype, 'getUTCHours').mockReturnValue(2);
  expect(getHoursUntilNextRefresh()).toBe(0);

  jest.spyOn(Date.prototype, 'getUTCHours').mockReturnValue(3);
  expect(getHoursUntilNextRefresh()).toBe(23);
});
