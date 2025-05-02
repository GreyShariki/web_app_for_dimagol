export const getProducts = async () => {
  const res = await fetch("http://localhost:3000/api/catalog");
  const data = res.json();
  return data;
};
