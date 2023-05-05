<template>
  <div class="loginWrapper">
    <div class="formWrapper">
      <h1 class="loginTitle">登录</h1>
      <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="10px" class="demo-ruleForm">
        <el-form-item prop="telephone">
          <el-input v-model="ruleForm.telephone" :prefix-icon="Cellphone" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" :prefix-icon="Lock" placeholder="密码" type="password" show-password
            @keydown.enter="submitForm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="loginButton" type="primary" @click="submitForm">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue"
import { Cellphone, Lock } from '@element-plus/icons-vue'
import Cookies from "js-cookie";
import { login } from "@/request/user.js"
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter()
const route = useRoute()

const ruleForm = reactive({
  telephone: "",
  password: ""
})

const rules = reactive({
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

function submitForm() {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      // 各项校验通过-调用登录接口
      login(ruleForm, true).then((res) => {
        if (res.success) {
          Cookies.set("token", res.data.token); //    在cookies中添加token
          ElMessage({
            message: '登录成功',
            type: 'success',
            duration: 1000
          })
          ruleFormRef.value.resetFields(); //    清空表单项
          router.replace({ name: "Home" }); // 跳转到首页
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
      return false
    }
  })
}

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
.loginWrapper {
  height: 550px !important;
  min-height: 550px !important;
  padding-top: 50px;
}

.formWrapper {
  width: 375px;
  margin: 0 auto;
  text-align: center;
}

.loginTitle {
  margin-bottom: 10px;
  font-weight: 300;
  font-size: 30px;
  color: #000;
}

.demo-ruleForm {
  width: 100%;
  margin-top: 20px;
}

.loginButton {
  width: 100%;
}
</style>