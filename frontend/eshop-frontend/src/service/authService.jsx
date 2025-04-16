const API_URL = import.meta.env.VITE_API_URL;

export const login = async ({ email, password }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  console.log("API_URL:", API_URL);

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Invalid credentials');
  return await res.json();
};
