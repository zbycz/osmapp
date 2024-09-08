import { splitDateRangeAtMidnight } from '../utils';

describe('splitDateRangeAtMidnight', () => {
  it('should not split it when it isn not needed', () => {
    expect(
      splitDateRangeAtMidnight([
        new Date(2024, 4, 4, 4, 4),
        new Date(2024, 4, 4, 6, 6),
      ]),
    ).toEqual([[new Date(2024, 4, 4, 4, 4), new Date(2024, 4, 4, 6, 6)]]);
  });

  it('should not split it at midnight into x sub ranges', () => {
    expect(
      splitDateRangeAtMidnight([
        new Date(2024, 4, 4, 4, 4),
        new Date(2024, 4, 5, 6, 6),
      ]),
    ).toEqual([
      [new Date(2024, 4, 4, 4, 4), new Date(2024, 4, 5, 0, 0)],
      [new Date(2024, 4, 5, 0, 0), new Date(2024, 4, 5, 6, 6)],
    ]);

    expect(
      splitDateRangeAtMidnight([
        new Date(2024, 4, 4, 4, 4),
        new Date(2024, 4, 6, 6, 6),
      ]),
    ).toEqual([
      [new Date(2024, 4, 4, 4, 4), new Date(2024, 4, 5, 0, 0)],
      [new Date(2024, 4, 5, 0, 0), new Date(2024, 4, 6, 0, 0)],
      [new Date(2024, 4, 6, 0, 0), new Date(2024, 4, 6, 6, 6)],
    ]);
  });

  it('should work when the dates start/end at midnight', () => {
    // Test case where the start and end time is exactly at midnight
    expect(
      splitDateRangeAtMidnight([
        new Date(2024, 4, 4, 0, 0),
        new Date(2024, 4, 5, 0, 0),
      ]),
    ).toEqual([[new Date(2024, 4, 4, 0, 0), new Date(2024, 4, 5, 0, 0)]]);

    // Test case where start time is exactly at midnight and end time is later the same day
    expect(
      splitDateRangeAtMidnight([
        new Date(2024, 4, 4, 0, 0),
        new Date(2024, 4, 4, 23, 59),
      ]),
    ).toEqual([[new Date(2024, 4, 4, 0, 0), new Date(2024, 4, 4, 23, 59)]]);

    // Test case where start time is just before midnight and end time is exactly at midnight
    expect(
      splitDateRangeAtMidnight([
        new Date(2024, 4, 4, 23, 59),
        new Date(2024, 4, 5, 0, 0),
      ]),
    ).toEqual([[new Date(2024, 4, 4, 23, 59), new Date(2024, 4, 5, 0, 0)]]);

    // Test case where range starts and ends on different midnights
    expect(
      splitDateRangeAtMidnight([
        new Date(2024, 4, 4, 0, 0),
        new Date(2024, 4, 6, 0, 0),
      ]),
    ).toEqual([
      [new Date(2024, 4, 4, 0, 0), new Date(2024, 4, 5, 0, 0)],
      [new Date(2024, 4, 5, 0, 0), new Date(2024, 4, 6, 0, 0)],
    ]);

    // Test case where range starts at midnight and ends at a time that is not midnight
    expect(
      splitDateRangeAtMidnight([
        new Date(2024, 4, 4, 0, 0),
        new Date(2024, 4, 5, 12, 0),
      ]),
    ).toEqual([
      [new Date(2024, 4, 4, 0, 0), new Date(2024, 4, 5, 0, 0)],
      [new Date(2024, 4, 5, 0, 0), new Date(2024, 4, 5, 12, 0)],
    ]);
  });
});
