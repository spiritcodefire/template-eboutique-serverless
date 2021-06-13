import React from "react";
// import localCart from "../utils/localCart";

function getCartFromLocalStorage() {
  return localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
}

const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cart, setCart] = React.useState(getCartFromLocalStorage());
  const [total, setTotal] = React.useState(0);
  const [cartItems, setCartItems] = React.useState(0);

  React.useEffect(() => {
    // lorsque le cart est modifié, cette fonction s'active

    localStorage.setItem("cart", JSON.stringify(cart));

    let newTotal = cart.reduce((total, cartItem) => {
      return (total += cartItem.amount * cartItem.price);
    }, 0);
    newTotal = parseFloat(newTotal.toFixed(2)); // je garde que deux chiffres
    
    setTotal(newTotal);
    // cart items
    let newCartItems = cart.reduce((total, cartItem) => {
      return (total += cartItem.amount);
    }, 0);
    setCartItems(newCartItems);
  }, [cart]);




  // global functions
  const removeItem = id => {
    // je crééer une nouvelle liste ou l'ID de mon objet n'existe plus
    setCart([...cart].filter(item => item.id !== id));

  };


  const AugmenterLeMontantTotal = id => {
    // on prépare la fonction pour augmenter le montant
    const newCart = [...cart].map(item => {
      return item.id === id
        ? { ...item, amount: item.amount + 1 } : { ...item };
    });

    // on change la valeur du carte avec la nouvelle valeur ( le nouveau montant)
    setCart(newCart);
  };

  const diminuerLeMontant = (id, amount) => {
    if (amount === 1) {
      removeItem(id);
      return;
    } else {
      const newCart = [...cart].map(item => {
        return item.id === id
          ? { ...item, amount: item.amount - 1 } : { ...item };
      });

      setCart(newCart);
    }
  };

  const addToCart = product => {
    const { id, image, title, price } = product;
    const item = [...cart].find(item => item.id === id);

    if (item) {
      AugmenterLeMontantTotal(id);
      return;
    } else {
      const newItem = { id, image, title, price, amount: 1 };
      const newCart = [...cart, newItem];
      setCart(newCart);
    }
  };

  const clearCart = () => {
    setCart([]);
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        total,
        removeItem,
        AugmenterLeMontantTotal,
        diminuerLeMontant,
        addToCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProvider };
