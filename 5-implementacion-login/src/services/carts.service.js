// carts.service.js

import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";

const cartDao = new CartDaoMongoDB();
const productDao = new ProductDaoMongoDB();

export const getAll = async () => {
  try {
    return await cartDao.getAll();
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener carritos");
  }
};

export const updateCart = async (cid, pid, quantity) => {
  try {
    return await cartDao.updateCantidad(cid, pid, quantity);
  } catch (error) {
    console.error(error);
    throw new Error("Error al actualizar el carrito");
  }
};

export const getById = async (id) => {
  try {
    const carro = await cartDao.getById(id);
    if (!carro) return false;
    else return carro;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener carrito por ID");
  }
};

export const create = async () => {
  try {
    const newCart = cartDao.create();
    if (!newCart) return false;
    else return newCart;
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear un nuevo carrito");
  }
};

export const remove = async (cid, pid) => {
  try {
    const cartDel = await cartDao.remove(cid, pid);
    if (!cartDel) return false;
    else return cartDel;
  } catch (error) {
    console.error(error);
    throw new Error("Error al eliminar un producto del carrito");
  }
};

export const addProduct = async (cid, pid) => {
  try {
    const cart = await cartDao.getById(cid);
    const product = pid;
    if (!cart || !product) return false;
    else {
      const response = await cartDao.addProductToCart(cart, product);
      return response;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error al agregar un producto al carrito");
  }
};

export const removeAll = async (cid) => {
  try {
    if (!cid) {
      return false;
    } else {
      const response = await cartDao.removeAll(cid);
      return true;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error al eliminar todos los productos del carrito");
  }
};
