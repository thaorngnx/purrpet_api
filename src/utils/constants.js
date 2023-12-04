export const STATUS_ACCOUNT = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const ROLE = {
  ADMIN: "Quản trị viên",
  STAFF: "Nhân viên",
};

export const STATUS_PRODUCT = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const STATUS_HOME = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const STATUS_SPA = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const STATUS_ORDER = {
  WAITING_FOR_PAY: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  DELIVERING: "Đang giao hàng",
  CANCEL: "Đã hủy",
  DONE: "Đã hoàn thành",
};

export const STATUS_BOOKING = {
  WAITING_FOR_PAY: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  CHECKIN: "Đã checkin",
  CHECKOUT: "Đã checkout",
  CANCEL: "Đã hủy",
};

export const STATUS_CATEGORY = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const CATEGORY_TYPE = {
  PRODUCT: "Sản phẩm",
  SPA: "Spa",
  HOMESTAY: "Homestay",
};

export const PREFIX = {
  PRODUCT: "PRD_",
  SPA: "SPA_",
  HOMESTAY: "HOME_",
  ORDER: "ORD_",
  BOOKING_HOME: "BKHOME_",
  BOOKING_SPA: "BKSPA_",
  CATEGORY: "CAT_",
  ACCOUNT: "ACC_",
  CUSTOMER: "CUS_",
  MASTERDATA: "MD_",
  OTP: "OTP_",
};

export const COLLECTION = {
  PRODUCT: "product",
  SPA: "spa",
  HOMESTAY: "homestay",
  ORDER: "order",
  BOOKING_HOME: "bookingHome",
  BOOKING_SPA: "bookingSpa",
  CATEGORY: "category",
  ACCOUNT: "account",
  CUSTOMER: "customer",
  MASTERDATA: "masterData",
  OTP: "otp",
};

export const SPA_TYPE = {
  DOG: "Chó",
  CAT: "Mèo",
};

export const HOME_TYPE = {
  DOG: "Chó",
  CAT: "Mèo",
};

export const RESPONSE_STATUS = {
  SUCCESS: 0,
  ERROR: -1,
};

export const VALIDATE_DUPLICATE = {
  CATEGORY_NAME: "categoryName",
  PRODUCT_NAME: "productName",
  SPA_NAME: "spaName",
  SPA_TYPE: "spaType",
  HOMESTAY_NAME: "homeName",
  HOMESTAY_TYPE: "homeType",
  USERNAME: "username",
  GROUP_CODE: "groupCode",
  CATEGORY_CODE: "categoryCode",
  MASTERDATA_NAME: "name",
  MASTERDATA_CODE: "masterDataCode",
  PHONE_NUMBER: "phoneNumber",
  EMAIL: "email",
};

export const GROUP_CODE = {
  SPA: "SPA",
};

export const GROUP_SPA = {
  QUANTITY: "quantity",
  TIME_START: "timeStart",
  TIME_END: "timeEnd",
  MINUTE_STEP: "minutesStep",
};

export const RESPONSE_MESSAGE = {
  SUCCESS: "Thành công",
  ERROR: "Đã có lỗi xảy ra. Vui lòng thử lại!",
  DUP_PRODUCT_NAME: "Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác!",
  DUP_SPA_NAME: "Tên spa đã tồn tại. Vui lòng chọn tên khác!",
  DUP_HOMESTAY_NAME: "Tên homestay đã tồn tại. Vui lòng chọn tên khác!",
  DUP_HOMESTAY_CODE: "Mã homestay đã tồn tại. Vui lòng chọn mã khác!",
  DUP_CATEGORY_NAME: "Tên danh mục đã tồn tại. Vui lòng chọn tên khác!",
  DUP_CATEGORY_CODE: "Mã danh mục đã tồn tại. Vui lòng chọn mã khác!",
  DUP_ACCOUNT_NAME: "Tên tài khoản đã tồn tại. Vui lòng chọn tên khác!",
  INVALID_CATEGORY: "Danh mục không hợp lệ. Vui lòng chọn lại danh mục!",
  INVALID_PRODUCT: "Sản phẩm không hợp lệ. Vui lòng chọn lại sản phẩm!",
  INVALID_SPA: "Spa không hợp lệ. Vui lòng chọn lại spa!",
  INVALID_HOMESTAY: "Homestay không hợp lệ. Vui lòng chọn lại homestay!",
  INVALID_PASSWORD: "Mật khẩu không hợp lệ. Vui lòng chọn lại mật khẩu!",
  INVALID_ROLE: "Vai trò không hợp lệ. Vui lòng chọn lại vai trò!",
  INVALID_USERNAME:
    "Tên tài khoản không hợp lệ. Vui lòng chọn lại tên tài khoản!",
  INVALID_IMAGE: "Hình ảnh không hợp lệ. Vui lòng chọn lại hình ảnh!",
  INVALID_INVENTORY:
    "Số lượng tồn không hợp lệ. Vui lòng chọn lại số lượng tồn!",
  INVALID_CATEGORY: "Danh mục không hợp lệ. Vui lòng chọn lại danh mục!",
  INVALID_CATEGORY_TYPE:
    "Loại danh mục không hợp lệ. Vui lòng chọn lại loại danh mục!",
  INVALID_STATUS: "Trạng thái không hợp lệ. Vui lòng chọn lại trạng thái!",
};
