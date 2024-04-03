import db from '../src/models';
import jwt from 'jsonwebtoken';
import * as Constant from '../src/utils/constants';

export const onConnection = async (socket) => {
  socket.on('disconnect', function () {
    console.log('user ' + socket.id + ' disconnected');
  });
  // const transactionId = socket.handshake.query.transactionId;
  // console.log("transactionId", transactionId);
  const token = socket.handshake.query.token;
  console.log('token', token);
  if (!token) {
    socket.disconnect();
    return;
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded', decoded);
  }
  let user;
  if (
    decoded.role === Constant.ROLE.STAFF ||
    decoded.role === Constant.ROLE.ADMIN
  ) {
    user = await db.account.findOne({ _id: decoded.userId });
  } else if (decoded.role === Constant.ROLE.CUSTOMER) {
    user = await db.customer.findOne({ _id: decoded.userId });
  } else {
    socket.disconnect();
    return;
  }
};
