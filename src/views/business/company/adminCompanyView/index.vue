<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input
          v-model="query.queryText"
          clearable
          placeholder="模糊搜索"
          style="width: 185px;"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-select v-model="query.member" placeholder="是否会员" clearable size="small" class="filter-item" style="width: 110px" @change="crud.toQuery">
          <el-option v-for="item in optionsMemberQuery" :key="item.key" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.activeQuery" placeholder="活跃状态" clearable size="small" class="filter-item" style="width: 170px" @change="crud.toQuery">
          <el-option v-for="item in optionsActiveQuery" :key="item.key" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.memberEfficient" placeholder="会员到期时间" clearable size="small" class="filter-item" style="width: 130px" @change="crud.toQuery">
          <el-option v-for="item in optionsMaturityQuery" :key="item.key" :label="item.label" :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="500px"
      >
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="序号">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input v-model="form.companyName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="省">
            <el-input v-model="form.province" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门店简称">
            <el-input v-model="form.abbreviationName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="logo路径">
            <!--            <el-input v-model="form.logoPath" style="width: 370px;" />-->
            <img :src="form.logoPath" title="点击上传头像" class="avatar">
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
          <el-form-item label="官网地址">
            <el-input v-model="form.website" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" width="55" label="序号" />
        <el-table-column prop="companyName" label="企业名称" :show-overflow-tooltip=true>
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="infoDetails(scope.row)">{{ scope.row.companyName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="companyPhone" label="企业电话" />
        <el-table-column align="center" label="员工数">
          <template slot-scope="scope">
            <el-popover
              width="350"
              trigger="click"
              @show="findListEmployee(scope.row)"
            >
              <el-table :data="gridDataList">
                <el-table-column width="50" property="id" label="序号" />
                <el-table-column width="75" property="name" label="姓名" />
                <el-table-column width="50" label="性别">
                  <template slot-scope="scope">
                    {{ dict.label.sex[scope.row.sex] }}
                  </template>
                </el-table-column>
                <el-table-column width="100" property="phone" label="联系方式" />
              </el-table>
              <el-button slot="reference">{{ scope.row.employeeCount }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <!--        <el-table-column align="center" label="员工数">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.employeeCount }}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column align="center" label="当前任务">
          <template slot-scope="scope">
            <el-popover
              width="400"
              trigger="click"
              @show="findListJob(scope.row,null,'Finish')"
            >
              <el-table :data="gridDataList">
                <el-table-column width="50" property="id" label="序号" />
                <el-table-column width="200" property="title" label="标题" />
                <el-table-column width="100" property="sortTitle" label="简标" />
              </el-table>
              <el-button slot="reference">{{ scope.row.noFinishJobCount }}</el-button>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column align="center" label="历史任务">
          <template slot-scope="scope">
            <el-popover
              width="400"
              trigger="click"
              @show="findListJob(scope.row,'Finish','')"
            >
              <el-table :data="gridDataList">
                <el-table-column width="50" property="id" label="序号" />
                <el-table-column width="200" property="title" label="标题" />
                <el-table-column width="100" property="sortTitle" label="简标" />
              </el-table>
              <el-button slot="reference">{{ scope.row.finishJobCount }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="contact" label="联系人" />
        <el-table-column prop="member" label="是否会员">
          <template slot-scope="scope">
            {{ dict.label.member[scope.row.member] }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="是否禁用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.disabledStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              @change="changeEnabled(scope.row, scope.row.disabledStatus)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column
          v-if="checkPer(['admin','adminCompanyView:edit','adminCompanyView:del'])"
          label="操作"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
        <!--          <template slot-scope="scope">-->
        <!--            <udOperation-->
        <!--              :data="scope.row"-->
        <!--              :permission="permission"-->
        <!--            />-->
        <!--          </template>-->
      </el-table>
      <!--弹窗渲染-->
      <el-dialog :visible.sync="dialog" title="详情" append-to-body width="500px" top="30px" class="spec-dialog">
        <el-form ref="form" size="small" label-width="80px">
          <el-form-item label="序号">
            <el-input v-model="gridDataDetails.id" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input v-model="gridDataDetails.companyName" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="省">
            <el-input v-model="gridDataDetails.province" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="门店简称">
            <el-input v-model="gridDataDetails.abbreviationName" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="logo路径">
            <img :src="gridDataDetails.logoPath" width="50" height="50" title="点击上传头像" class="avatar">
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="gridDataDetails.city" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地区">
            <el-input v-model="gridDataDetails.area" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="gridDataDetails.address" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="企业电话">
            <el-input v-model="gridDataDetails.companyPhone" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="gridDataDetails.contact" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="营业执照 ">
            <el-input v-model="gridDataDetails.businessPhotos" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="gridDataDetails.remark" disabled style="width: 370px;" />
          </el-form-item>
          <el-form-item label="官网地址">
            <el-input v-model="gridDataDetails.website" disabled style="width: 370px;" />
          </el-form-item>
        </el-form>
      </el-dialog>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudAdminCompanyView, { listEmployee, listJob } from '@/api/business/company/adminCompanyView'
import company from '@/api/business/company'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = {
  noFinishJobCount: null,
  finishJobCount: null,
  employeeCount: null,
  id: null,
  num: null,
  companyName: null,
  province: null,
  abbreviationName: null,
  logoPath: null,
  city: null,
  area: null,
  address: null,
  companyPhone: null,
  contact: null,
  businessPhotos: null,
  remark: null,
  member: null,
  memberId: null,
  website: null,
  memberEfficient: null,
  useDayCount: null,
  disabledStatus: null,
  statusTime: null,
  appId: null,
  del: null,
  createTime: null,
  updateTime: null
}
export default {
  name: 'AdminCompanyView',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['member', 'disabled_status', 'sex'],
  cruds() {
    return CRUD({
      title: 'companyView',
      url: 'api/business/company/adminCompanyView/',
      idField: 'id',
      sort: 'id,desc',
      crudMethod: { ...crudAdminCompanyView }
    })
  },

  data() {
    return {
      permission: {
        companyUserList: ['admin', 'adminCompanyView:companyUserList'],
        add: ['admin', 'adminCompanyView:add'],
        edit: ['admin', 'adminCompanyView:edit'],
        del: ['admin', 'adminCompanyView:del']
      },
      dialog: false,
      rules: {},
      gridDataList: [],
      gridDataDetails: {},
      optionsMemberQuery: [{
        value: '1',
        label: '会员'
      }, {
        value: '0',
        label: '非会员'
      }],
      optionsActiveQuery: [{
        value: '120',
        label: '超过120小时未活跃'
      }, {
        value: '240',
        label: '超过240小时未活跃'
      }, {
        value: '480',
        label: '超过480小时未活跃'
      }],
      optionsMaturityQuery: [{
        value: '30',
        label: '30天'
      }, {
        value: '45',
        label: '45天'
      }, {
        value: '60',
        label: '60天'
      }, {
        value: '90',
        label: '90天'
      }],
      queryTypeOptions: [
        { key: 'companyPhone', display_name: '企业电话' },
        { key: 'member', display_name: '是否会员' }
      ]
    }
  },
  methods: {
    infoDetails(data) {
      this.dialog = true
      this.gridDataDetails = data
    },
    // 弹框
    findListEmployee(row) {
      listEmployee(row.id).then((response) => {
        console.log(response)
        this.gridDataList = response.content
      })
    },
    findListJob(row, jobStatus, jobStatusNot) {
      // this.gridData.attchTable()
      listJob(row, jobStatus, jobStatusNot).then((response) => {
        console.log(response)
        this.gridDataList = response.content
      })
    },
    // handleUpdate(row) {
    //   listEmployee(row.id).then((response, ret_content = null) => {
    //     console.log(response)
    //
    //     var name = ''
    //     if (response.totalElements > 0) {
    //       ret_content = response.content
    //       for (var i = 0; i < ret_content.length; i++) {
    //         console.log(ret_content[i])
    //         name += ret_content[i].name + ' '
    //       }
    //     }
    //     console.log(name)
    //     this.$alert(name, '员工列表', {
    //       confirmButtonText: '关闭',
    //       callback: action => {
    //         // this.$message({
    //         //   type: 'info',
    //         //   message: `action: ${ action }`
    //         // });
    //       }
    //     })
    //   })
    //   // this.$alert('这是一段内容', '员工列表', {
    //   //   confirmButtonText: '确定',
    //   //   callback: action => {
    //   //     // this.$message({
    //   //     //   type: 'info',
    //   //     //   message: `action: ${ action }`
    //   //     // });
    //   //   }
    //   // })
    // },
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.disabled_status[val] + '" ' + data.companyName + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        company.edit(data).then(res => {
          this.crud.notify(this.dict.label.disabled_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.disabledStatus = !data.disabledStatus
        })
      }).catch(() => {
        data.disabledStatus = !data.disabledStatus
      })
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style>
.spec-dialog .el-dialog__body {
  padding: 4px 30px;
  /*overflow-y: auto;*/
  height: calc(100vh - 140px);
}
</style>
