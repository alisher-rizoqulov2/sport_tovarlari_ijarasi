const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  if (password !== confirmPassword) {
    setError('Passwords do not match');
    setLoading(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:3030/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }),
    });
    // ... existing code ...
  }
}; 