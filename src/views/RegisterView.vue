<template>
  <div class="registerWrapper" id="registerBackground">
    <div class="formWrapper">
      <h1 class="registerTitle">注册</h1>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="10px" class="demo-ruleForm">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" :prefix-icon="User" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="telephone">
          <el-input v-model="ruleForm.telephone" :prefix-icon="Cellphone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" :prefix-icon="Lock" placeholder="密码" type="password" show-password
            @keydown.enter="submitFrom"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitFrom" class="registerButton">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { User, Cellphone, Lock } from '@element-plus/icons-vue'
import { register } from "@/request/user.js"
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
const router = useRouter()
const route = useRoute()

const ruleForm = reactive({
  username: "",
  telephone: "",
  password: ""
})

const rules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
  ],
  telephone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { min: 11, max: 11, message: "请输入11位手机号", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 5,
      max: 20,
      message: "长度在 5 到 20 个字符",
      trigger: "blur",
    },
  ],
})

const ruleFormRef = ref(null)

function submitFrom() {
  ruleFormRef.value.validate((valid) => {
    //    校验表单
    if (valid) {
      //  各项校验通过-调用注册接口，传参用户名、手机号和密码
      register(ruleForm).then((res) => {
        if (res.success) {
          ElMessage({
            message: '注册成功！已跳转到登录页面',
            type: 'success',
            duration: 1000
          })
          ruleFormRef.value.resetFields(); // 注册成功之后清空表单
          router.replace({ path: "/login" })// 注册成功之后跳转到登录页面
        } else {
          ElMessage({
            message: res.message,
            type: 'warning',
          })
        }
      });
    } else {
      // 表单校验没通过
      ElMessage.error('请完善信息！')
      return false;
    }
  })
}

const store = useStore()
if (store.getters.isLogin) {
  // 用户若已登录，自动跳转到首页
  ElMessage({
    message: '已登录！已跳转到首页',
    type: 'success',
    duration: 1000
  })
  router.replace({ name: 'Home' })
}


</script>

<style scoped>
.demo-ruleForm {
  width: 100%;
  margin-top: 20px;
}

.registerWrapper {
  height: 500px !important;
  min-height: 500px !important;
  width: 100% !important;
  padding-top: 50px;
}

.formWrapper {
  width: 375px;
  margin: 0 auto;
  text-align: center;
}

.registerTitle {
  margin-bottom: 10px;
  font-weight: 300;
  font-size: 30px;
  color: #000;
}

el-form-item {
  margin-left: 0 !important;
}

.registerButton {
  width: 100%;
}
</style>

