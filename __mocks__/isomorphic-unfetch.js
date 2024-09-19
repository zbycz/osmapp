module.exports = () => {
  throw new Error(`Calling fetch in tests is not allowed. Use mocks instead.
        eg: jest.spyOn(fetchModule, 'fetchJson').mockResolvedValue(...);
  `);
};
