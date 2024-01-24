import TicketDaoMongoDB from "../daos/mongodb/ticket.dao.js";
const ticketDao = new TicketDaoMongoDB();

import { getById as getCartById } from "./cart.services.js";
import { getByIdUser } from "./user.services.js";
import { getById as getProdById } from "./product.services.js";

import { v4 as uuidv4 } from 'uuid';

export const generateTicket = async (userId, cartId) => {
    try {
        const user = await getByIdUser(userId);
        if (!user) return false;

        const cart = await getCartById(cartId);
        if (!cart) return false;

        let amountAcc = 0;
        for (const p of cart.products) {
            const idProd = p.product._id.toString();
            const prodFromDB = await getProdById(idProd);

            if (p.quantity <= prodFromDB.stock) {
                const amount = p.quantity * prodFromDB.price;
                amountAcc += amount;
            }
        }

        const ticket = await ticketDao.create({
            code: uuidv4(),
            purchase_datetime: new Date().toLocaleString(),
            amount: amountAcc,
            purchaser: user.email
        });

        cart.products = [];
        cart.save();

        return ticket;
    } catch (error) {
        throw new Error(error);
    }
};