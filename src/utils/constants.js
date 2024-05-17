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

export const STATUS_PAYMENT = {
  WAITING_FOR_PAY: 'Chờ thanh toán',
  PAID: 'Đã thanh toán',
};

export const CATEGORY_TYPE = {
  PRODUCT: 'Sản phẩm',
  SPA: 'Spa',
  HOMESTAY: 'Homestay',
};

export const NOTIFICATION_TYPE = {
  ORDER: 'order',
  BOOKING_HOME: 'bookingHome',
  BOOKING_SPA: 'bookingSpa',
  REVIEW: 'review',
  PRODUCT: 'product',
};

export const NOTIFICATION_ACTION = {
  NEW_ORDER: 'newOrder',
  ORDER_UPDATE: 'orderUpdate',
  NEW_BOOKING_HOME: 'newBookingHome',
  BOOKING_HOME_UPDATE: 'bookingHomeUpdate',
  NEW_BOOKING_SPA: 'newBookingSpa',
  BOOKING_SPA_UPDATE: 'bookingSpaUpdate',
  NEW_REVIEW: 'newReview',
  REFUND_ORDER: 'orderRefund',
  CANCEL_ORDER: 'orderCancel',
  PRODUCT_EXPIRED: 'productExpired',
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
  FAVORITE: 'FAV_',
  REVIEW: 'REV_',
  SUPPLIER: 'SUP_',
  CONSIGNMENT: 'CON_',
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
  FAVORITE: 'favorite',
  REVIEW: 'review',
  NOTIFICATION: 'notification',
  SUPPLIER: 'supplier',
  CONSIGNMENT: 'consignment',
  MERCHANDISE: 'merchandise',
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
  SUPPLIER_NAME: 'supplierName',
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
  COIN: 'Xu',
};
export const STATUS_COIN = {
  PLUS: 'cộng',
  MINUS: 'trừ',
};
