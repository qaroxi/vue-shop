<template>
    <div class="login">
        <el-form class="form" v-model="formData" label-position="top">
            <h3 class="tit">用户登录</h3>
            <el-form-item label="用户名">
                <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password" placeholder="请输入用户密码" show-password></el-input>
            </el-form-item>
            <el-button class="btn" type="primary" @click="handleLogin">登录</el-button>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            formData:{
                username:'',
                password:'',
            },
            //表单数据
        }
    },
    methods:{
        handleLogin(){
            if(this.$data.formData.username != ''&&this.$data.formData.password != ''){
                this.$axios.post('login',this.$data.formData)
                .then(res => {
                    let data = res.data.data;//登录后用户基本信息
                    let status = res.data.meta;//登录状态，是否登录成功
                    if(status.msg == '登录成功'){
                        this.$message({
                            showClose: true,
                            message: status.msg,
                            type: 'success'
                        });
                        // 判断是否登陆成功
                        this.$router.replace({name:'home'});//登陆成功跳转至home页面
                    }else{
                        this.$message({
                            showClose: true,
                            message: status.msg,
                            type: 'error'
                        });
                        this.formData.password = '';
                        // 登录失败给出提示
                    }
                })
                // 发送axios请求验证用户名和密码是否正确
            }else{
                if(this.$data.formData.username == ''){
                    this.$message({
                        showClose: true,
                        message: '请输入用户名',
                        type: 'warning'
                    });
                }else{
                    this.$message({
                        showClose: true,
                        message: '请输入密码',
                        type: 'warning'
                    });
                }
                // 验证用户名和密码是否填写，然后发出警告
            }
            
        },
        //验证用户名密码
    }
}
</script>

<style scoped>
    .login {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: linear-gradient(to left, #BDBBBE 0%, #9D9EA3 100%), radial-gradient(88% 271%, rgba(255, 255, 255, 0.25) 0%, rgba(254, 254, 254, 0.25) 1%, rgba(0, 0, 0, 0.25) 100%), radial-gradient(50% 100%, rgba(255, 255, 255, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%);
        background-blend-mode: normal, lighten, soft-light;
    }
    /* 登录页面样式 */

    .form {
        width: 400px;
        padding: 50px;
        background-image: radial-gradient(73% 147%, #EADFDF 59%, #ECE2DF 100%), radial-gradient(91% 146%, rgba(255,255,255,0.50) 47%, rgba(0,0,0,0.50) 100%);
        background-blend-mode: screen;
        border-radius: 10px;
        box-shadow: 0px 0px 20px rgb(136, 136, 136);
    }
    /* 整体表单样式 */

    .tit {
        text-align: center;
        margin-bottom: 20px;
    }
    /* 登录标题样式 */
    
    .btn {
        width: 100%;
        margin-top: 10px;
    }
    /* 登录按钮样式 */
</style>