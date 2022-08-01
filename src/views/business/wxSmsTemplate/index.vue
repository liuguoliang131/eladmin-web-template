<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item hidden label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模板名称">
            <el-input v-model="form.templateName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模板编号">
            <el-input v-model="form.templateCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="推送对象">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="表达式">
            <el-input v-model="form.scheduled" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
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
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="title" label="标题" :show-overflow-tooltip=true />
        <el-table-column prop="templateName" label="模板名称" :show-overflow-tooltip=true />
        <el-table-column prop="templateCode" label="模板编号" :show-overflow-tooltip=true />
        <el-table-column prop="type" label="推送对象" />
        <el-table-column prop="scheduled" label="表达式" :show-overflow-tooltip=true />
        <el-table-column prop="remark" label="备注" :show-overflow-tooltip=true />
        <el-table-column prop="del" label="是否删除" />
        <el-table-column prop="disabledStatus" label="启用禁用" />
        <el-table-column prop="createTime" label="创建时间" :show-overflow-tooltip=true />
        <el-table-column v-if="checkPer(['admin','wxSmsTemplate:edit','wxSmsTemplate:del'])" label="操作" width="150px" align="center">
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
import crudWxSmsTemplate from '@/api/business/wxSmsTemplate/'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, title: null, templateName: null, templateCode: null, type: null, scheduled: null, remark: null, del: null, disabledStatus: null, createTime: null, updateTime: null }
export default {
  name: 'WxSmsTemplate',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'wxSmsTemplate', url: 'api/business/wxSmsTemplate/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudWxSmsTemplate }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'wxSmsTemplate:add'],
        edit: ['admin', 'wxSmsTemplate:edit'],
        del: ['admin', 'wxSmsTemplate:del']
      },
      rules: {
        disabledStatus: [
          { required: true, message: '启用禁用不能为空', trigger: 'blur' }
        ]
      }
    }
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
