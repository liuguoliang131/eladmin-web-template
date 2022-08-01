<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">工序名称</label>
        <el-input v-model="query.name" clearable placeholder="工序名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="工序名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="企业ID">
            <el-input v-model="form.companyId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务ID">
            <el-input v-model="form.jobId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="图片ids">
            <el-input v-model="form.imagesIds" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="form.unitPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数量">
            <el-input v-model="form.count" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="完成数量">
            <el-input v-model="form.finishCount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务完成状态" prop="finishStatus">
            <el-input v-model="form.finishStatus" style="width: 370px;" />
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
        <el-table-column prop="name" label="工序名称" />
        <el-table-column prop="companyId" label="企业ID" />
        <el-table-column prop="jobId" label="任务ID" />
        <el-table-column prop="imagesIds" label="图片ids" />
        <el-table-column prop="unitPrice" label="单价" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="finishCount" label="完成数量" />
        <el-table-column prop="finishStatus" label="任务完成状态" />
        <el-table-column prop="del" label="是否删除" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column v-if="checkPer(['admin','process:edit','process:del'])" label="操作" width="150px" align="center">
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
import crudProcess from '@/api/business/process/'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, companyId: null, jobId: null, imagesIds: null, unitPrice: null, count: null, finishCount: null, finishStatus: null, del: null, createTime: null, updateTime: null }
export default {
  name: 'Process',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'process', url: 'api/business/process/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudProcess }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'process:add'],
        edit: ['admin', 'process:edit'],
        del: ['admin', 'process:del']
      },
      rules: {
        finishStatus: [
          { required: true, message: '任务完成状态不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '工序名称' }
      ]
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
