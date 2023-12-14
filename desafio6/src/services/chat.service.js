// chat.service.js

import messageDaoMongoDB from "../daos/mongodb/models/message.dao.js";

const message = new messageDaoMongoDB();

export const getAll = async () => {
  try {
    const mensajes = await message.getAll();
    return mensajes;
  } catch (error) {
    console.error(error);
    throw new Error("Error al obtener mensajes del chat");
  }
};

export const createMessage = async (msg) => {
  try {
    const mensaje = await message.createMessage(msg);
    return mensaje;
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear un mensaje en el chat");
  }
};
