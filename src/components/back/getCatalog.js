export const getProducts = async () => {
  const res = await fetch("https://apikazakovm.ru/api/catalog");
  const data = res.json();
  return data;
};
