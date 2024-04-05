import db from '../../src/models';
import * as Constant from '../../src/utils/constants';
import io from '../../index';

export async function notifyToUser(userResquest, action, data) {
  let user;
  if (
    userResquest.role === Constant.ROLE.STAFF ||
    userResquest.role === Constant.ROLE.ADMIN
  ) {
    user = await db.account.findById(userResquest.id);
  } else if (userResquest.role === Constant.ROLE.CUSTOMER) {
    user = await db.customer.findById(userResquest.id);
  } else {
    return;
  }
  io.sockets.emit(
    user.accessToken,
    JSON.stringify({ action: action, data: data }),
  );
}

export async function notifyWithSubject(token, action, data) {
  io.sockets.emit(token, JSON.stringify({ action: action, data: data }));
}

//noti to admin
export async function notifyMultiUser(userList, action, data) {
  if (userList.length > 0) {
    userList.forEach(async (userResquest) => {
      let user;
      console.log('userResquest', userResquest);
      if (
        userResquest.role === Constant.ROLE.STAFF ||
        userResquest.role === Constant.ROLE.ADMIN
      ) {
        user = await db.account.findById(userResquest._id);
      } else if (userResquest.role === Constant.ROLE.CUSTOMER) {
        user = await db.customer.findById(userResquest._id);
        console.log('user', user);
      } else {
        console.log('user not valid');
        return;
      }
      if (!user?.accessToken || user.accessToken === '') {
        return;
      }
      io.sockets.emit(
        user.accessToken,
        JSON.stringify({ action: action, data: data }),
      );
    });
  }
}
