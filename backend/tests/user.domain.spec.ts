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
