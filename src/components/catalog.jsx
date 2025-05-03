import { useState, useEffect } from "react";
import { getProducts } from "./back/getCatalog";
import { addCart } from "./back/addCart";

export default function Catalog() {
  const [userData, setUserData] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderForm, setOrderForm] = useState({
    size: "",
    quantity: 1,
    comment: "",
  });

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (tgUser) {
        setUserData({
          id: tgUser.id,
          name: `${tgUser.first_name} ${tgUser.last_name || ""}`.trim(),
          username: tgUser.username,
        });
      }
    }

    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response);
      } catch (err) {
        console.error("Ошибка при загрузке товаров:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setOrderForm({
      ...orderForm,
      size: product.sizes[0] || "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm({
      ...orderForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct || !userData) {
      alert("Товар не выбран или пользователь не определен");
      return;
    }

    try {
      const cartData = {
        user_id: userData.id,
        product_id: selectedProduct.id,
        size: orderForm.size,
        quantity: orderForm.quantity,
        comment: orderForm.comment,
      };

      const response = await addCart(cartData);

      alert("Товар добавлен в корзину!");
      setSelectedProduct(null);

      return response;
    } catch (error) {
      console.error("Ошибка при добавлении в корзину:", error);
      alert(`Ошибка: ${error.message}`);
      throw error;
    }
  };
  return (
    <div className="drip-catalog">
      <header className="drip-header">
        <h1>THREADHEAD</h1>
        <div className="drip-tagline">Твой стиль — твои правила</div>
      </header>

      <div className="drip-grid">
        {products.map((product) => (
          <div key={product.id} className="drip-card">
            <div
              className="drip-card-image"
              style={{ backgroundImage: `url(${product.photo})` }}
            />
            <div className="drip-card-info">
              <h3>{product.name}</h3>
              <div className="drip-price">{product.price}₽</div>
              <button
                className="drip-buy-btn"
                onClick={() => handleBuyClick(product)}
              >
                КУПИТЬ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Модалка с формой заказа */}
      {selectedProduct && (
        <div className="drip-modal">
          <div className="drip-modal-content">
            <span
              className="drip-close"
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </span>

            <h2>{selectedProduct.name}</h2>
            <div className="drip-modal-price">{selectedProduct.price}₽</div>

            <form className="drip-form">
              <div className="drip-form-group">
                <label>Размер:</label>
                <select
                  name="size"
                  value={orderForm.size}
                  onChange={handleFormChange}
                  className="drip-select"
                >
                  {selectedProduct.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="drip-form-group">
                <label>Количество:</label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={orderForm.quantity}
                  onChange={handleFormChange}
                  className="drip-input"
                />
              </div>

              <div className="drip-form-group">
                <label>Комментарий:</label>
                <textarea
                  name="comment"
                  value={orderForm.comment}
                  onChange={handleFormChange}
                  className="drip-textarea"
                  placeholder="Напиши тут всякие приколы..."
                />
              </div>

              <button
                onClick={handleSubmit}
                type="button"
                className="drip-buy-btn"
              >
                ЗАКАЗАТЬ
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="drip-debug">
        <h3>ТЕКУЩИЙ ВЫБОР</h3>
        <table className="drip-debug-table">
          <tbody>
            <tr>
              <td className="debug-label">Товар:</td>
              <td>{selectedProduct ? selectedProduct.name : "Не выбран"}</td>
            </tr>
            <tr>
              <td className="debug-label">Размер:</td>
              <td>{orderForm.size || "-"}</td>
            </tr>
            <tr>
              <td className="debug-label">Количество:</td>
              <td>{orderForm.quantity}</td>
            </tr>
            <tr>
              <td className="debug-label">Комментарий:</td>
              <td>{orderForm.comment || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
