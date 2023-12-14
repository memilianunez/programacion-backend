import * as service from "../services/products.service.js";

export const aggregation1 = async (req, res, next) => {
    try {
        const filtro = req.query.filter;
        const response = await service.aggregation1(filtro);
        if (!response) throw new Error("No data found");
        return res.status(200).json({ response });
    } catch (error) {
        next(error.message);
    }
};

export const getAll = async (req, res, next) => {
    try {
        let { limit = 8, page = 1, sort, query } = req.query;
        let sortBy = sort;
        let categorias = ["Ropa", "Hogar", "Libros", "Electrónica", "Deportes"];
        if (query) {
            categorias = [query];
        }
        const limitValue = Number(limit);
        const pageValue = Number(page);
        const opciones = {
            lean: true,
            limit: limitValue,
            page: pageValue,
        };
        if (sortBy) {
            opciones.sort = { price: sortBy };
        }
        const resultado = await service.getAll(categorias, opciones);
        resultado.status = "success";
        resultado.nextLink = null;
        resultado.prevLink = null;
        resultado.payload = resultado.docs;
        const products = resultado.payload;
        delete resultado.docs;

        if (resultado.hasPrevPage) {
            resultado.prevPage = resultado.page - 1;
            resultado.prevLink = `http://localhost:8080/api/products/?limit=${limit}&page=${resultado.prevPage}`;
        }
        if (resultado.hasNextPage) {
            resultado.nextPage = resultado.page + 1;
            resultado.nextLink = `http://localhost:8080/api/products/?limit=${limit}&page=${resultado.nextPage}`;
        }
        res.render("home", {
            style: "products.css",
            products,
            opciones: opciones,
            resultado,
            query: query,
        });
    } catch (error) {
        next(error.message);
    }
};

export const getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await service.getById(id);
        if (!response) {
            res.status(404).json({ msg: "Product Not found!" });
        } else {
            res.render("home", { style: "products.css", products: { response } });
        }
    } catch (error) {
        next(error.message);
    }
};

export const create = async (req, res, next) => {
    try {
        const { title, description, code, price, stock, thumbnails } = req.body;
        const newProd = { title, description, code, price, stock, thumbnails };
        const response = await service.create(newProd);
        if (!response) res.status(404).json({ msg: "Error create product!" });
        res.status(200).json(newProd);
    } catch (error) {
        next(error.message);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prodUpd = await service.update(id, req.body);
        if (!prodUpd) res.status(404).json({ msg: "Error update product!" });
        else res.status(200).json(prodUpd);
    } catch (error) {
        next(error.message);
    }
};

export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prodDel = await service.remove(id);
        if (!prodDel) res.status(404).json({ msg: "Error delete product!" });
        else res.status(200).json({ msg: `Product id: ${id} deleted` });
    } catch (error) {
        next(error.message);
    }
};