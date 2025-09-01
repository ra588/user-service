
  /**
   * User flags:
   * - Default role is "customer"
   * - Default authProvider is "LOCAL" (UPPERCASE)
   * - Default active is true
   * - Can set GOOGLE/FACEBOOK and inactive
   */
  it('sets default flags: role=customer, authProvider=LOCAL (UPPERCASE), active=true', async () => {
    const u = await UserModel.create({
      name: 'Flags',
      email: 'flags@mail.com',
      password: 'Secret12!'
    });

    expect(u.get('role')).toBe('customer');
    expect(u.get('authProvider')).toBe('LOCAL'); // will FAIL (enum is lowercase now)
    expect(u.get('active')).toBe(true);          // will FAIL (no active field yet)
  });

  it('allows GOOGLE/FACEBOOK providers and inactive users', async () => {
    const g = await UserModel.create({
      name: 'G',
      email: 'g@mail.com',
      password: 'Secret12!',
      authProvider: 'GOOGLE', // will FAIL (enum lowercase now)
      active: false           // will FAIL (no active field yet)
    });
    expect(g.get('authProvider')).toBe('GOOGLE');
    expect(g.get('active')).toBe(false);

    const f = await UserModel.create({
      name: 'F',
      email: 'f@mail.com',
      password: 'Secret12!',
      authProvider: 'FACEBOOK' // will FAIL
    });
    expect(f.get('authProvider')).toBe('FACEBOOK');
  });
});
