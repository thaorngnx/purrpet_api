export const STATUS_ACCOUNT = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const ROLE = {
  ADMIN: 'Quản trị viên',
  STAFF: 'Nhân viên',
  CUSTOMER: 'Khách hàng',
};

export const STATUS_PRODUCT = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const STATUS_HOME = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const STATUS_SPA = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const STATUS_ORDER = {
  WAITING_FOR_PAY: 'Chờ thanh toán',
  NEW: 'Đơn hàng mới',
  PREPARE: 'Đang chuẩn bị',
  DELIVERING: 'Đang giao hàng',
  CANCEL: 'Đã hủy',
  DONE: 'Đã hoàn thành',
};

export const STATUS_BOOKING = {
  WAITING_FOR_PAY: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
  CHECKIN: 'Đã check-in',
  EXPIRED: 'Đã hết hạn',
  CANCEL: 'Đã hủy',
};

export const STATUS_CATEGORY = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

export const CATEGORY_TYPE = {
  PRODUCT: 'Sản phẩm',
  SPA: 'Spa',
  HOMESTAY: 'Homestay',
};

export const PREFIX = {
  PRODUCT: 'PRD_',
  SPA: 'SPA_',
  HOMESTAY: 'HOME_',
  ORDER: 'ORD_',
  BOOKING_HOME: 'BKHOME_',
  BOOKING_SPA: 'BKSPA_',
  CATEGORY: 'CAT_',
  ACCOUNT: 'ACC_',
  CUSTOMER: 'CUS_',
  MASTERDATA: 'MD_',
  OTP: 'OTP_',
};

export const COLLECTION = {
  PRODUCT: 'product',
  SPA: 'spa',
  HOMESTAY: 'homestay',
  ORDER: 'order',
  BOOKING_HOME: 'bookingHome',
  BOOKING_SPA: 'bookingSpa',
  CATEGORY: 'category',
  ACCOUNT: 'account',
  CUSTOMER: 'customer',
  MASTERDATA: 'masterData',
  OTP: 'otp',
};

export const SPA_TYPE = {
  DOG: 'Chó',
  CAT: 'Mèo',
};

export const HOME_TYPE = {
  DOG: 'Chó',
  CAT: 'Mèo',
};

export const RESPONSE_STATUS = {
  SUCCESS: 0,
  ERROR: -1,
};

export const VALIDATE_DUPLICATE = {
  CATEGORY_NAME: 'categoryName',
  PRODUCT_NAME: 'productName',
  SPA_NAME: 'spaName',
  SPA_TYPE: 'spaType',
  HOMESTAY_NAME: 'homeName',
  HOMESTAY_TYPE: 'homeType',
  USERNAME: 'username',
  GROUP_CODE: 'groupCode',
  CATEGORY_CODE: 'categoryCode',
  MASTERDATA_NAME: 'name',
  MASTERDATA_CODE: 'masterDataCode',
  PHONE_NUMBER: 'phoneNumber',
  EMAIL: 'email',
};

export const GROUP_CODE = {
  SPA: 'SPA',
};

export const GROUP_SPA = {
  QUANTITY: 'quantity',
  TIME_START: 'timeStart',
  TIME_END: 'timeEnd',
  MINUTE_STEP: 'minutesStep',
};

export const COOKIES_PATH = {
  CUSTOMER: '/',
  ADMIN: '/admin',
  STAFF: '/staff',
};

export const PAYMENT_METHOD = {
  COD: 'Tiền mặt',
  VNPAY: 'VNPAY',
};
