import { setupMemoryMongo, teardownMemoryMongo, clearCollections } from './helpers/mongo';
import bcrypt from 'bcryptjs';
import UserModel from '../src/models/user.model';

describe('User Domain & Validation (unit)', () => {
  beforeAll(setupMemoryMongo);   // Start in-memory Mongo before tests
  afterAll(teardownMemoryMongo); // Stop in-memory Mongo after tests
  afterEach(clearCollections);   // Clear data between tests

    /**
   * Email validation:
   * - Accepts a well-formed email
   * - Rejects malformed email with "Invalid email format"
   * - Enforces uniqueness when email is provided
   */
  it('accepts valid email and rejects invalid email with "Invalid email format"', async () => {
    // Valid email should pass
    await expect(
      UserModel.create({ name: 'Ok', email: 'ok@mail.com', password: 'Secret12!' })
    ).resolves.toBeDefined();

    // Invalid email should fail
    await expect(
      UserModel.create({ name: 'Bad', email: 'not-an-email', password: 'Secret12!' })
    ).rejects.toThrow(/Invalid email format/i); // will FAIL until validator is added
  });

  it('enforces email uniqueness when provided', async () => {
    await UserModel.create({ name: 'U1', email: 'dup@mail.com', password: 'Secret12!' });

    // Duplicate email should fail
    await expect(
      UserModel.create({ name: 'U2', email: 'dup@mail.com', password: 'Secret34!' })
    ).rejects.toThrow();
  });

    /**
   * Password hashing & verification:
   * - Password is stored hashed (not plain text)
   * - bcrypt.compare verifies correctly
   */
  it('hashes password (hash !== plain) and verify works', async () => {
    const plain = 'P@ssw0rd!';
    const u = await UserModel.create({ name: 'Hash', email: 'hash@mail.com', password: plain });

    // Saved password should not equal the plain password
    expect(u.password).toBeDefined();
    expect(u.password).not.toBe(plain); // will FAIL until hashing is added

    // Correct password must verify, wrong one must fail
    expect(await bcrypt.compare(plain, u.password!)).toBe(true);
    expect(await bcrypt.compare('wrong', u.password!)).toBe(false);
  });
