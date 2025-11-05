export const listOrders = async () => {
  const response = await fetch('/api/orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.ok) {
    const data = await response.json();

    return { data, error: null };
  } else {
    const error = await response.json();

    return { data: null, error };
  }
};