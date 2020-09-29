exports.randomEmail = () => {
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();
  const testname = `Auto-test${id}@mail.com`;
  return testname;
};
