import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/business/companyMembershipHistory/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/business/companyMembershipHistory/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/business/companyMembershipHistory/',
    method: 'put',
    data
  })
}

export function editHistory(data) {
  return request({
    url: 'api/business/companyMembershipHistory/',
    method: 'put',
    data
  })
}

export default { add, edit, del }
