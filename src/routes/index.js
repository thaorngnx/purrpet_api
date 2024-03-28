import account from './account.router';
import category from './category.router';
import order from './order.router';
import bookingHome from './bookingHome.router';
import bookingSpa from './bookingSpa.router';
import homestay from './homestay.router';
import spa from './spa.router';
import product from './product.router';
import login from './login.router';
import customer from './customer.router';
import cart from './cart.router';
import masterData from './masterData.router';
import pay from './pay.router';
import otp from './otp.router';
import { notFound } from '../middlewares/handle_errors';

const initRoutes = (app) => {
  app.use('/api/auth', login);
  app.use('/api/account', account);
  app.use('/api/category', category);
  app.use('/api/order', order);
  app.use('/api/bookingHome', bookingHome);
  app.use('/api/bookingSpa', bookingSpa);
  app.use('/api/homestay', homestay);
  app.use('/api/spa', spa);
  app.use('/api/product', product);
  app.use('/api/customer', customer);
  app.use('/api/cart', cart);
  app.use('/api/masterData', masterData);
  app.use('/api/pay', pay);
  app.use('/api/otp', otp);
  app.use(notFound);
};

module.exports = initRoutes;
