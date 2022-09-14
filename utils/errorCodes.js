// 자주 사용되는 Error Codes의 관리를 위한 파일
module.exports = {
  pageNotFound: "페이지를 찾을 수 없습니다.",
  notUpdate: "수정된 내용이 없습니다.",
  notDelete: "삭제되지 않았습니다.",
  thereIsNotOrder: "주문내역이 존재하지 않습니다.",
  notWorkingExchangeAPI: "exchangeAPI로 다시 요청해주세요.",
  canNotFindDeliveryCost: "DeliveryCost를 찾을 수 없습니다.",
  canNotFindCountry: "Country를 찾을 수 없습니다.",
  // validator
  required: "필수 값입니다.",
  tooLongString: "요청 데이터가 제한글자수를 넘었습니다.",
  OnlyUseInt: "정수만 입력가능합니다.",
  DateFormat: "YYYYMMDD로 입력하세요.",
  OrderStateFormat: "주문상태를 다시 입력하세요.",
  CouponTypeFormat: "쿠폰 타입에는 배송비, 정액, 정률만 가능합니다.",
  CouponStateFormat: "쿠폰 상태는 발급완료, 사용완료, 기간만료만 가능합니다.",
  // 쿠폰
  thereIsNotCoupon: "존재하지 않는 쿠폰입니다.",
  updatedButThereIsNotCoupon: "수정된 쿠폰이 존재하지 않습니다.",
  canNotApplyCoupon: "쿠폰 적용을 할 수 없습니다.",
  alreadyUsedCoupon: "이미 사용한 쿠폰입니다.",
  expiredCoupon: "이미 만료된 쿠폰입니다.",
  serverError: "서버 에러가 발생하였습니다. 잠시 후 시도하여 주세요.",
};
