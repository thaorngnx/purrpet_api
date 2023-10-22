import account from './account.router';
import category from './category.router';
import order from './order.router';
import bookingHome from './bookingHome.router';
import bookingSpa from './bookingSpa.router';
import homestay from './homestay.router';
import spa from './spa.router';
import product from './product.router';
import { notFound } from '../middlewares/handle_errors';

const initRoutes = (app) => {
    app.use('/api/account', account);
    app.use('/api/category', category);
    app.use('/api/order', order);
    app.use('/api/bookingHome', bookingHome);
    app.use('/api/bookingSpa', bookingSpa);
    app.use('/api/homestay', homestay);
    app.use('/api/spa', spa);
    app.use('/api/product', product);

    app.use(notFound);
};

module.exports = initRoutes;