<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-input
        v-model="query.queryText"
        clearable
        placeholder="模糊搜索"
        style="width: 185px;"
        class="filter-item"
        @keyup.enter.native="crud.toQuery"
      />
      <rrOperation :crud="crud" />
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false"  :visible.sync="dialog" :data="gridDataDetails" title="详情" width="620px">
        <el-form ref="form" :model="gridDataDetails" :rules="rules" size="small">

                    <el-form-item  hidden label="id">
                      <el-input v-model="form.id" style="width: 370px;" />
                    </el-form-item>
                    <el-form-item hidden label="编号">
                      <el-input v-model="form.num" style="width: 370px;" />
                    </el-form-item>

          <el-row >
            <el-col :span="10" >
                <el-row type="flex"  class="row-bg">
                  <el-col :span="7"><label class="grid-label">标题:</label></el-col>
                  <el-col :span="30" ><div class="grid-content">{{gridDataDetails.title}}</div></el-col>
                </el-row>
              <el-row type="flex"  class="row-bg" >
                <el-col :span="7"><label class="grid-label">短标题:</label></el-col>
                <el-col :span="30" ><div class="grid-content">{{gridDataDetails.sortTitle}}</div></el-col>
              </el-row>
              <el-row type="flex"  class="row-bg" >
                <el-col :span="7"><label class="grid-label">数量:</label></el-col>
                <el-col :span="30" ><div class="grid-content">{{gridDataDetails.count}}</div></el-col>
              </el-row>
              <el-row type="flex"  class="row-bg" >
                <el-col :span="7"><label class="grid-label">单价:</label></el-col>
                <el-col :span="30" ><div class="grid-content">{{gridDataDetails.unitPrice}}</div></el-col>
              </el-row>
              <el-row type="flex"  class="row-bg" >
                <el-col :span="7"><label class="grid-label">总价:</label></el-col>
                <el-col :span="30" ><div class="grid-content">{{gridDataDetails.totalPrice}}</div></el-col>
              </el-row>
              <el-row type="flex"  class="row-bg" >
                <el-col :span="7"><label class="grid-label">备注:</label></el-col>
                <el-col :span="30" ><div class="grid-content">{{gridDataDetails.remark}}</div></el-col>
              </el-row>
            </el-col>
            <el-col  :span="6" >
              <div v-loading="getImages(gridDataDetails.id,gridDataDetails.imagesIds)" :data="imageList">
                <span class="cell-item" v-for="(item, index) in imageList" :key="index">
                  <img :src="item.url" class="item-img" width="50" height="50" title="图像">
                </span>
              </div>
            </el-col>
          </el-row>
          <div>
            <div style="padding-top: 10px; padding-bottom: 10px; font-weight: bold;">工序</div>
              <el-table  :data="processList"  style="width: 90%; font-size: 8px"  >
                <el-table-column prop="id" width="50px" label="序号" />
                <el-table-column prop="name" width="100px" label="名称" :show-overflow-tooltip=true />
                <el-table-column prop="unitPrice" width="60px" label="单价" />
                <el-table-column prop="imagesList" width="150px" label="图标" >
                  <template slot-scope="scopeImages">
                      <div  :data="scopeImages.row.imageList">
                      <span class="cell-item" v-for="(item, index) in imageList" :key="index">
                        <img :src="item.url" class="item-img" width="25" height="25" title="图像">
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="count" width="55px" label="数量" />
                <el-table-column  label="完成数量" width="100px" :show-overflow-tooltip=true  >
                  <template slot-scope="scopes">
                    <el-popover
                      width="250"
                      trigger="hover"
                      @show="findProcessEmployeeList(scopes.row)">
                      <el-table :data="processEmployeeList" style="font-size: 5px">
                        <el-table-column width="50" property="id" label="序号" />
                        <el-table-column width="75" property="employeeName" label="姓名" />
                        <el-table-column width="80" property="count" label="领取数量" />
                      </el-table>
                      <el-button slot="reference">{{ scopes.row.finishCount }}</el-button>
                    </el-popover>
                  </template>
                </el-table-column>
              </el-table>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
<!--          <el-button type="text" @click="buttonCancel()">取消</el-button>-->
          <el-button :loading="crud.status.cu === 2" type="primary" @click="buttonCancel()">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="companyName" label="企业名称" :show-overflow-tooltip="true" />
        <el-table-column prop="title" label="标题" :show-overflow-tooltip="true" />
        <el-table-column prop="sortTitle" label="短标题" :show-overflow-tooltip="true" />
        <el-table-column prop="count" label="数量" />
        <el-table-column prop="shareCount" label="分享数量" />
        <el-table-column prop="unitPrice" label="单价" />
        <el-table-column prop="totalPrice" label="总价" />
        <el-table-column prop="jobStatus" label="任务状态" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="share" label="是否是分享" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column v-if="checkPer(['admin','job:edit','job:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="infoDetails(scope.row)">详情</el-button>
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
  </div>
</template>

<script>
import crudJob from '@/api/business/job/'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { findByIds } from '@/api/business/images'
import { findProcess } from '@/api/business/process'
import { findProcessView } from '@/api/business/employeeProcessView'

const defaultForm = { id: null, num: null, title: null, sortTitle: null, pidId: null, ids: null, companyId: null, companyName: null, count: null, shareCount: null, unitPrice: null, totalPrice: null, imagesIds: null, remark: null, disabledStatus: null, del: null, jobStatus: null, share: null, createTime: null, updateTime: null }
export default {
  name: 'Job',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'job', url: 'api/business/job/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudJob }})
  },
  data() {
    return {
      gridDataDetails: {},
      dialog: false,
      permission: {
        add: ['admin', 'job:add'],
        edit: ['admin', 'job:edit'],
        del: ['admin', 'job:del']
      },
      imageList: [],
      processList: [],
      processEmployeeList: [],
      imageListLoading: false,
      imageLoadingData: {},
      rules: {
        share: [
          { required: true, message: '是否是分享不能为空', trigger: 'blur' }
        ]
      }}
  },
  methods: {
    infoDetails(data) {
      this.dialog = true
      this.gridDataDetails = data
    },
    getImages(id, imageIds) {
      if (this.imageLoadingData !== id) {
        this.imageListLoading = false
      }
      if (id == null || this.imageListLoading === true) {
        return
      }
      findByIds(imageIds).then((response) => {
        console.log(response)
        this.imageList = response.content
        this.imageListLoading = true
        this.imageLoadingData = id
      })
      findProcess(id).then((response) => {
        console.log(response)
        this.processList = response.content
      })
    },
    buttonCancel() {
      this.dialog = false
    },
    findProcessEmployeeList(row) {
      findProcessView(row).then((response) => {
        console.log(response)
        this.processEmployeeList = response.content
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
.grid-content{
  font-size: 10px;
}
.grid-label{
  font-weight: bold;
  font-size: 12px;
}

.row-bg{
  padding: 5px;
}

.item-img{
  margin: 1px;
}
</style>
