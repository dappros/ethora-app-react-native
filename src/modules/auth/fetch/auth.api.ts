export async function loginApi(email: string, password: string) {
    await new Promise((r) => setTimeout(r, 500));
    if (!email || !password) throw new Error('Invalid credentials');
    return { token: 'demo-token', user: { id: '1', email } };
  }
  