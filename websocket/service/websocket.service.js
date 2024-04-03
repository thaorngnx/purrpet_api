import db from '../../src/models';
import * as Constant from '../../src/utils/constants';

export async function notifyToUser(userResquest, action, data) {
  let user;
  if (
    userResquest.role === Constant.ROLE.STAFF ||
    userResquest.role === Constant.ROLE.ADMIN
  ) {
    user = await db.account.findOne({ _id: userResquest.userId });
  } else if (userResquest.role === Constant.ROLE.CUSTOMER) {
    user = await db.customer.findOne({ _id: userResquest.userId });
  } else {
    return;
  }
  io.sockets.emit(
    user.accessToken,
    JSON.stringify(socketResponse(action, data)),
  );
}

export async function notifyWithSubject(token, action, data) {
  io.sockets.emit(token, JSON.stringify(socketResponse(action, data)));
}

//noti to admin
export async function notifyMultiUser(userList, action, data) {
  if (userList.length > 0) {
    userList.forEach(async (userResquest) => {
      let user;
      if (
        userResquest.role === Constant.ROLE.STAFF ||
        userResquest.role === Constant.ROLE.ADMIN
      ) {
        user = await db.account.findOne({ _id: userResquest.userId });
      } else if (userResquest.role === Constant.ROLE.CUSTOMER) {
        user = await db.customer.findOne({ _id: userResquest.userId });
      } else {
        console.log('user not valid');
        return;
      }
      io.sockets.emit(
        user.accessToken,
        JSON.stringify(socketResponse(action, data)),
      );
    });
  }
}
