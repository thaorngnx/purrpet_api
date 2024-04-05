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
  console.log('token', token);
  let decoded;
  if (!token) {
    socket.disconnect();
    return;
  } else {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log('decoded', decoded);
  }
  let user;
  if (
    decoded.role === Constant.ROLE.STAFF ||
    decoded.role === Constant.ROLE.ADMIN
  ) {
    user = await db.account.findOne({ id: decoded.id });
  } else if (decoded.role === Constant.ROLE.CUSTOMER) {
    user = await db.customer.findOne({ id: decoded.id });
  } else {
    socket.disconnect();
    return;
  }
};
