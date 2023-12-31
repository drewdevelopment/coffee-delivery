import { ReactNode, createContext, useState } from 'react';
import { Cart, Coffee } from '../interfaces';
import { saveCartInStorage } from '../utils/storage';
import { toast } from 'react-toastify';

interface CartReturnData {
  cart: Cart[];
  addNewItemToCart: (coffee: Coffee, quantity: number) => void;
  updateProductQuantity: (id: number, quantity: number) => void;
  deleteCartItem: (item: Coffee) => void;
  resetCart: () => void;
}

interface ICartProvider {
  children: ReactNode;
}

export const CartContext = createContext({} as CartReturnData)

export const CartProvider = ({ children }: ICartProvider) => {
  const storedCart = JSON.parse(localStorage.getItem("@coffee-delivery:cart") || "[]")
  const [cart, setCart] = useState<Cart[]>(storedCart);

  const addNewItemToCart = (coffee: Coffee, quantity: number) => {
    const hasItemIndex = cart.findIndex(item => item.coffee.id === coffee.id);

    if (hasItemIndex < 0) {
      const newCartList = [...cart, { coffee, quantity }];

      setCart(newCartList);
      saveCartInStorage(newCartList);
    } else {
      const newCartList = cart.map((item) => {
        if (item.coffee.id === coffee.id) {
          if (item.quantity + quantity > 30) {
            toast.warn("Você não pode adicionar mais do que 50 itens");
            return item;
          }
          toast.success("Item adicionado ao carrinho, obrigado! :)");
          return { ...item, quantity: item.quantity + quantity };
        }

        return item;
      });

      setCart(newCartList);
      saveCartInStorage(newCartList);
    }
  }

  const deleteCartItem = (item: Coffee) => {
    setCart((state) => state.filter(cartItem => cartItem.coffee.id !== item.id));
    saveCartInStorage(cart.filter(cartItem => cartItem.coffee.id !== item.id));
  }

  const updateProductQuantity = (id: number, quantity: number) => {
    const updateCart = cart.map((item) => {
      return id === item.coffee.id ? { ...item, quantity } : item
    });

    setCart(updateCart);
    saveCartInStorage(updateCart);
  }

  const resetCart = () => {
    setCart([]);
    localStorage.removeItem("@coffee-delivery:cart");
  }

  const returnData: CartReturnData = {
    cart,
    addNewItemToCart,
    updateProductQuantity,
    deleteCartItem,
    resetCart
  };

  return (
    <CartContext.Provider value={returnData}>
      {children}
    </CartContext.Provider>
  )
}
