import db from '../src/models';
import jwt from 'jsonwebtoken';
import * as Constant from '../src/utils/constants';

export const onConnection = async (socket) => {
  console.log('user ' + socket.id + ' connected');
  console.log('token ' + socket.handshake.query.token + 'connected');
  socket.on('disconnect', function () {
    console.log('user ' + socket.id + ' disconnected');
  });
  // const transactionId = socket.handshake.query.transactionId;
  // console.log("transactionId", transactionId);
  const token = socket.handshake.query.token;
  let decoded;
  if (!token) {
    socket.disconnect();
    return;
  } else {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }
  let user;
  if (
    decoded.role === Constant.ROLE.STAFF ||
    decoded.role === Constant.ROLE.ADMIN
  ) {
    user = await db.account.findById(decoded.id);
  } else if (decoded.role === Constant.ROLE.CUSTOMER) {
    user = await db.customer.findById(decoded.id);
  } else {
    socket.disconnect();
    return;
  }
};
