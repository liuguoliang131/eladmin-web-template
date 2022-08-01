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
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" title="编辑会员" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item hidden label="id">
            <el-input v-model="form.id"   style="width: 370px;" />
          </el-form-item>
          <el-form-item label="名称">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
<!--          <div style="text-align: center">-->
<!--            <div class="el-upload">-->
<!--              <img :src="form.image ? baseApi + '/avatar/' + form.image : Avatar" title="点击上传头像" class="avatar" @click="toggleShow">-->
<!--              <myUpload-->
<!--                v-model="show"-->
<!--                :headers="headers"-->
<!--                :url="imageUploadApi"-->
<!--                @crop-upload-success="cropUploadSuccess"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.image" :src="form.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-form-item label="用户数量">
            <el-input v-model="form.userCount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="任务数量">
            <el-input v-model="form.jobCount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="使用天数">
            <el-input v-model="form.useDayCount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="form.unitPrice" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="背景图片">
            <el-input v-model="form.imagesIds" style="width: 370px;" />
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
        <el-table-column prop="id"  label="序号" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="userCount" label="用户数量" />
        <el-table-column prop="jobCount" label="任务数量" />
        <el-table-column prop="useDayCount" label="使用天数" />
        <el-table-column prop="unitPrice" label="价格" />
        <el-table-column prop="disabledStatus" label="启用禁用" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column v-if="checkPer(['admin','membership:edit','membership:del'])" label="操作" width="150px" align="center">
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
import myUpload from 'vue-image-crop-upload'
import crudMembership from '@/api/business/membership/'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import store from '@/store'
import Avatar from '@/assets/images/avatar.png'
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'

const defaultForm = { id: null, name: null, userCount: null, jobCount: null, useDayCount: null, unitPrice: null, imagesIds: null, rule: null, discount: null, disabledStatus: null, del: null, createTime: null, updateTime: null }
export default {
  name: 'Membership',
  components: { pagination, crudOperation, rrOperation, udOperation, myUpload },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: 'membership', url: 'api/business/membership/', idField: 'id', sort: 'id,desc', crudMethod: { ...crudMembership }})
  },
  computed: {
    ...mapGetters([
      'imageUploadApi'
    ])
  },
  data() {
    return {
      permission: {
        add: ['admin', 'membership:add'],
        edit: ['admin', 'membership:edit'],
        del: ['admin', 'membership:del']
      },
      imageUrl: '',
      rules: {
        disabledStatus: [
          { required: true, message: '启用禁用不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG|PNG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M;
      return true;
    },
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
