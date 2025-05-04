export const getProducts = async () => {
  const res = await fetch("https://apikazakovm/api/catalog");
  const data = res.json();
  return data;
};
