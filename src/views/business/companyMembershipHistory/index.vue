<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.companyName"
          clearable
          size="small"
          placeholder="输入名称搜索"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <el-select v-model="query.status" placeholder="订单状态" clearable size="small" class="filter-item" style="width: 110px" @change="crud.toQuery">
          <el-option v-for="item in optionsOrderQuery" :key="item.key" :label="item.label" :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
    </div>
    <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
    <crudOperation :permission="permission" />
    <!--表单组件-->
    <el-dialog  :close-on-click-modal="false"  :visible.sync="dialog" title="退款" width="500px">
      <el-form ref="refundForm" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="id" hidden>
          <el-input v-model="gridDataDetails.id" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="gridDataDetails.remake" type="textarea" autosize placeholder="请输入内容" style="width: 300px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="buttonCancel()">取消</el-button>
        <el-button  type="primary" @click="submit()">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="序号" />
      <el-table-column prop="orderNum" width="200" label="订单编号" />
      <el-table-column prop="companyName" label="企业名称" />
      <el-table-column prop="membershipName" label="套餐名称" />
      <el-table-column label="购买数量">1</el-table-column>
      <el-table-column prop="amount" label="支付金额" />
      <el-table-column prop="createTime" label="下单时间" />
      <el-table-column prop="status" label="订单状态">
        <template slot-scope="scope">
          {{ dict.label.pay_status[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column prop="remake" label="备注" />
      <el-table-column v-if="checkPer(['admin','companyMembershipHistory:edit','companyMembershipHistory:del'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="infoDetails(scope.row)">退款</el-button>
        </template>
        <!--        <template slot-scope="scope">-->
        <!--          <udOperation-->
        <!--            :data="scope.row"-->
        <!--            :permission="permission"-->
        <!--          />-->
        <!--        </template>-->
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
<!--  </div>-->
</template>

<script>
import crudCompanyMembershipHistory from '@/api/business/companyMembershipHistory/'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import { listEmployee } from '@/api/business/company/adminCompanyView'
import { editHistory } from '@/api/business/companyMembershipHistory'

const defaultForm = { id: null, userOpenId: null, orderNum: null, requestNum: null, unitPrice: null, amount: null, status: null, incomeAmount: null, companyId: null, membershipId: null, userCount: null, jobCount: null, openCount: null, remainingDayCount: null, withholdingAmount: null, openTime: null, maturityTime: null, disabledUpgrade: null, upgradePid: null, ids: null, disabledStatus: null, useStatus: null, del: null, createTime: null, updateTime: null, remake: null, companyName: null, membershipName: null }
export default {
  name: 'CompanyMembershipHistory',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['pay_status', 'disabled_status'],
  cruds() {
    return CRUD({ title: 'order', url: 'api/business/companyMembershipHistory/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudCompanyMembershipHistory }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'companyMembershipHistory:add'],
        edit: ['admin', 'companyMembershipHistory:edit'],
        del: ['admin', 'companyMembershipHistory:del']
      },
      gridDataDetails: {},
      dialog: false,
      optionsOrderQuery: [{
        value: 'INIT',
        label: '待支付'
      }, {
        value: 'SUCCESS',
        label: '支付成功'
      }, {
        value: 'FAIL',
        label: '失败'
      }, {
        value: 'CANCEL',
        label: '已取消'
      }, {
        value: 'REFUND',
        label: '已退款'
      }, {
        value: 'REFUNDING',
        label: '退款中'
      }, {
        value: 'REFUNDFAIL',
        label: '退款失败'
      }],
      rules: {
      },
      queryTypeOptions: [
        { key: 'disabledStatus', display_name: '是否有效' },
        { key: 'companyName', display_name: '企业名称' }
      ]
    }
  },
  methods: {
    infoDetails(data) {
      this.dialog = true
      this.gridDataDetails = data
    },
    buttonCancel() {
      this.dialog = false
    },
    submit() {
      editHistory(this.gridDataDetails).then((response) => {
        console.log(response)
        this.$message({
          type: 'success',
          message: '操作成功: '
        })
        this.gridDataList = response.content
        this.dialog = false
      })
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
