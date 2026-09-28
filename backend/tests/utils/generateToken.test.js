process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRE = '1h';

const jwt = require('jsonwebtoken');
const generateToken = require('../../src/utils/generateToken');

describe('generateToken', () => {
  test('produces a token that verifies back to the same id and role', () => {
    const token = generateToken('abc123', 'owner');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe('abc123');
    expect(decoded.role).toBe('owner');
  });

  test('rejects a token signed with the wrong secret', () => {
    const token = jwt.sign({ id: 'x' }, 'a-different-secret');
    expect(() => jwt.verify(token, process.env.JWT_SECRET)).toThrow();
  });
});
