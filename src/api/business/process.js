import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/business/process/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/business/process/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/business/process/',
    method: 'put',
    data
  })
}

export function findProcess(data) {
  return request({
    url: 'api/business/process/?jobId=' + data,
    method: 'get',
    data
  })
}
export default { add, edit, del }
