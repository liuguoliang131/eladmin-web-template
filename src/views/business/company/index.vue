<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="企业编号">
            <el-input v-model="form.num" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.companyName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="省">
            <el-input v-model="form.province" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门店简称">
            <el-input v-model="form.abbreviationName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="logo路径">
            <el-input v-model="form.logoPath" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="form.city" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地区">
            <el-input v-model="form.area" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.address" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="企业电话">
            <el-input v-model="form.companyPhone" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="form.contact" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="营业执照 ">
            <el-input v-model="form.businessPhotos" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否会员" prop="member">
            <el-input v-model="form.member" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员表ID">
            <el-input v-model="form.memberId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="官网地址">
            <el-input v-model="form.website" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员是否有效" prop="memberEfficient">
            <el-input v-model="form.memberEfficient" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="会员剩余时间">
            <el-input v-model="form.useDayCount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-input v-model="form.disabledStatus" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="活跃状态时间">
            <el-input v-model="form.statusTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="微信open_id">
            <el-input v-model="form.appId" style="width: 370px;" />
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
        <el-table-column prop="num" label="企业编号" />
        <el-table-column prop="companyName" label="名称" />
        <el-table-column prop="province" label="省" />
        <el-table-column prop="abbreviationName" label="门店简称" />
        <el-table-column prop="logoPath" label="logo路径" />
        <el-table-column prop="city" label="城市" />
        <el-table-column prop="area" label="地区" />
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="companyPhone" label="企业电话" />
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="businessPhotos" label="营业执照 " />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="member" label="是否会员" />
        <el-table-column prop="memberId" label="会员表ID" />
        <el-table-column prop="website" label="官网地址" />
        <el-table-column prop="memberEfficient" label="会员是否有效" />
        <el-table-column prop="useDayCount" label="会员剩余时间" />
        <el-table-column prop="disabledStatus" label="是否禁用" />
        <el-table-column prop="statusTime" label="活跃状态时间" />
        <el-table-column prop="appId" label="微信open_id" />
        <el-table-column prop="del" label="是否删除" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="修改时间" />
        <el-table-column v-if="checkPer(['admin','company:edit','company:del'])" label="操作" width="150px" align="center">
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
import crudCompany from '@/api/business/company/'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, num: null, companyName: null, province: null, abbreviationName: null, logoPath: null, city: null, area: null, address: null, companyPhone: null, contact: null, businessPhotos: null, remark: null, member: null, memberId: null, website: null, memberEfficient: null, useDayCount: null, disabledStatus: null, statusTime: null, appId: null, del: null, createTime: null, updateTime: null }
export default {
  name: 'Company',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'company', url: 'api/business/company/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudCompany }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'company:add'],
        edit: ['admin', 'company:edit'],
        del: ['admin', 'company:del']
      },
      rules: {
        member: [
          { required: true, message: '是否会员不能为空', trigger: 'blur' }
        ],
        memberEfficient: [
          { required: true, message: '会员是否有效不能为空', trigger: 'blur' }
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
