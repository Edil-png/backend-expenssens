export function readData() {
  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    
    const initialData = {
      users: [],
      products: [],
      categories: [],
      orders: [],
      reviews: [],
      shippingMethods: [],
      promoCodes: [],
      cartItems: {}
    };
    fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}
