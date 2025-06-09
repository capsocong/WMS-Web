
// Một vài biểu thức chính quy - Regular Expression và custom message.
// Về Regular Expression: https://viblo.asia/p/hoc-regular-expression-va-cuoc-doi-ban-se-bot-kho-updated-v22-Az45bnoO5xY
export const FIELD_REQUIRED_MESSAGE = 'Trường này là bắt buộc.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email không hợp lệ. (ví dụ: example@gmail.com)'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Mật khẩu phải bao gồm ít nhất 1 chữ cái, 1 số và tối thiểu 8 ký tự.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Xác nhận mật khẩu không khớp!'


// Liên quan đến Validate File
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'Tệp không được để trống.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Kích thước tệp vượt quá giới hạn. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'Loại tệp không hợp lệ. Chỉ chấp nhận jpg, jpeg và png'
  }
  return null
}
