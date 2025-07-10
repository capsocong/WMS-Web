import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

/** Columns */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

/** Cards */
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return response.data
}

export const updateCardDetailAPI = async (cardId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}`, updateData)
  return response.data
}

export const deleteCardAPI = async (cardId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/cards/${cardId}`)
  return response.data
}

export const fetchDefaultLabelsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/cards/default-labels`)
  return response.data
}

/** Users */
export const registerUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success(
    'Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản của bạn.'
  )
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/verify`, data)
  return response.data
}

export const refreshTokenAPI = async (data) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`, data)
  return response.data
}

/** Member Management */
export const updateMemberRoleAPI = async (boardId, memberId, role) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}/members/${memberId}/role`, { role })
  return response.data
}

export const removeMemberAPI = async (boardId, memberId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/boards/${boardId}/members/${memberId}`)
  return response.data
}

export const fetchBoardsAPI = async (searchPath) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/boards${searchPath}`)
  return response.data
}

export const createNewBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/boards`, data)
  return response.data
}

export const updateBoardAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const deleteBoardAPI = async (boardId) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}


export const inviteUserToBoardAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/invitations/board`, data)
  toast.success('Mời người dùng vào bảng thành công! chờ họ xác nhận nhé!')
  return response.data
}

/** Card Member Assignment */
export const assignMemberToCardAPI = async (cardId, memberId) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}/assign-member`, { memberId })
  return response.data
}

export const unassignMemberFromCardAPI = async (cardId, memberId) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/cards/${cardId}/unassign-member`, { memberId })
  return response.data
}

