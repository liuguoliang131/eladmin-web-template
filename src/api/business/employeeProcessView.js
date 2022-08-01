import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/business/employeeProcessView/',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/business/employeeProcessView/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/business/employeeProcessView/',
    method: 'put',
    data
  })
}

export function findProcessView(data) {
  return request({
    url: 'api/business/employeeProcessView/?jobId=' + data.jobId + '&processId=' + data.id,
    method: 'get',
    data
  })
}

export default { add, edit, del }
