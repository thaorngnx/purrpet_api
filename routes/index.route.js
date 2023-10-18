import account from "./account.route";
import category from "./category.route";
import order from "./order.route";
import bookingHome from "./bookingHome.route";
import bookingSpa from "./bookingSpa.route";
import homestay from "./homestay.route";
import spa from "./spa.route";
import product from "./product.route";

export const initRoutes = (app) => {
    app.use("/api/account", account);
    app.use("/api/category", category);
    app.use("/api/order", order);
    app.use("/api/bookingHome", bookingHome);
    app.use("/api/bookingSpa", bookingSpa);
    app.use("/api/homestay", homestay);
    app.use("/api/spa", spa);
    app.use("/api/product", product);
};