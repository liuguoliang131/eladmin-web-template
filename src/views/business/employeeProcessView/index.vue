<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="短标题">
            <el-input v-model="form.sortTitle" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务状态">
            <el-input v-model="form.jobStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-input v-model="form.disabledStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="企业ID">
            <el-input v-model="form.companyId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="员工姓名">
            <el-input v-model="form.employeeName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="员工ID">
            <el-input v-model="form.employeeId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="工序ID">
            <el-input v-model="form.processId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务ID">
            <el-input v-model="form.jobId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="form.count" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="账单时间">
            <el-input v-model="form.billData" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否删除">
            <el-input v-model="form.del" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="form.processCount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图片ids">
            <el-input v-model="form.processImagesIds" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="完成数量">
            <el-input v-model="form.processFinishCount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="form.processUnitPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务完成状态">
            <el-input v-model="form.processFinishStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="工序名称">
            <el-input v-model="form.processName" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="sortTitle" label="短标题" />
        <el-table-column prop="jobStatus" label="任务状态" />
        <el-table-column prop="disabledStatus" label="是否禁用" />
        <el-table-column prop="companyId" label="企业ID" />
        <el-table-column prop="employeeName" label="员工姓名" />
        <el-table-column prop="employeeId" label="员工ID" />
        <el-table-column prop="processId" label="工序ID" />
        <el-table-column prop="jobId" label="任务ID" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="billData" label="账单时间" />
        <el-table-column prop="del" label="是否删除" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column prop="processCount" label="数量" />
        <el-table-column prop="processImagesIds" label="图片ids" />
        <el-table-column prop="processFinishCount" label="完成数量" />
        <el-table-column prop="processUnitPrice" label="单价" />
        <el-table-column prop="processFinishStatus" label="任务完成状态" />
        <el-table-column prop="processName" label="工序名称" />
        <el-table-column v-if="checkPer(['admin','employeeProcessView:edit','employeeProcessView:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudEmployeeProcessView from '@/api/business/employeeProcessView/'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, title: null, sortTitle: null, jobStatus: null, disabledStatus: null, companyId: null, employeeName: null, employeeId: null, processId: null, jobId: null, count: null, billData: null, del: null, createTime: null, updateTime: null, processCount: null, processImagesIds: null, processFinishCount: null, processUnitPrice: null, processFinishStatus: null, processName: null }
export default {
  name: 'EmployeeProcessView',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'employeeProcessView', url: 'api/business/employeeProcessView/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudEmployeeProcessView }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'employeeProcessView:add'],
        edit: ['admin', 'employeeProcessView:edit'],
        del: ['admin', 'employeeProcessView:del']
      },
      rules: {
        id: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
