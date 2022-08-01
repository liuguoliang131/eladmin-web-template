import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/business/images/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/business/images/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/business/images/',
    method: 'put',
    data
  })
}

export function findByIds(data) {
  return request({
    url: 'api/business/images/?ids=' + data,
    method: 'get',
    data: data
  })
}
export default { add, edit, del }
