import ProductDaoMongoDB from "../daos/mongodb/product.dao.js";

const prodDao = new ProductDaoMongoDB();

export const getAll = async (query,opciones) => {
  try {
    return await prodDao.getAll(query,opciones);
  } catch (error) {
    console.log(error);
  }
};

export const getById = async (id) => {
  try {
    const prod = await prodDao.getById(id);
    if (!prod) return false;
    else return prod;
  } catch (error) {
    console.log(error);
  }
};



export const create = async (obj) => {
  try {
    if (
      !obj.title ||
      !obj.description ||
      !obj.price ||
      !obj.thumbnails ||
      !obj.code ||
      !obj.stock
    ) {
      throw new Error("Missing fields");
    }
    const newProd = await prodDao.create(obj);
    if (!newProd) return false;
    else return newProd;
  } catch (error) {
    console.log(error);
  }
};

export const update = async (id, obj) => {
  try {
    const prodUpd = await prodDao.update(id, obj);
    if (!prodUpd) return false;
    else return prodUpd;
  } catch (error) {
    console.log(error);
  }
};

export const remove = async (id) => {
  try {
    const prodDel = await prodDao.delete(id);
    if (!prodDel) return false;
    else return prodDel;
  } catch (error) {
    console.log(error);
  }
};

export const aggregation1 = async (filtro) => {
  try {
    const response = await prodDao.aggregation1(filtro);
    return response;
  } catch (error) {
    console.log(error);
  }
};
