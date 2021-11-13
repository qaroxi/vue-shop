<template>
    <el-card class="user-card">
        <!-- 面包屑 -->
        <el-breadcrumb class="users-breadcrumb" separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 搜索栏 -->
        <el-input class="users-input" placeholder="请输入内容" v-model="usersInput">
            <el-button slot="append" icon="el-icon-search" @click="searchUsers"></el-button>
        </el-input>
        <el-button @click="addUsersDialog = true" type="success" plain>添加用户</el-button>

        <!-- 表格数据 -->
        <el-table
            :data="usersTableData"
            stripe
            style="width: 100%">
            <el-table-column
            type="index"
            label="#"
            width="40">
            </el-table-column>
            <el-table-column
            prop="username"
            label="姓名"
            width="100">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱"
            width="200">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="电话"
            width="200">
            </el-table-column>
            <el-table-column
            label="创建日期"
            width="150">
                <template slot-scope="scopeData">
                    <!-- 使用插槽解决表格数据问题，将数据通过slot-scope传入
                        scopeData表示传入表格所有数据(usersTableData)
                        scopeData.row表示当前一行的对象数据 -->
                    {{scopeData.row.create_time|changeData}}
                </template>
            </el-table-column>
            <el-table-column
            label="用户状态"
            width="100">
                <template slot-scope="scopeData">
                    <el-switch
                    @change="changeUsersState(scopeData.row.id,scopeData.row.mg_state)"
                    v-model="scopeData.row.mg_state"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scopeData">
                    <div>
                        <el-button @click="openEditUsersDialog(scopeData.row)" size="mini" type="primary" icon="el-icon-edit" plain circle></el-button>
                        
                        <el-button @click="openDeleteMessageBox(scopeData.row.id)" size="mini" type="danger" icon="el-icon-delete" plain circle></el-button>
                        
                        <el-button @click="openAssignRolesDialog(scopeData.row)" size="mini" type="success" icon="el-icon-check" plain circle></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[2, 4, 6, 8, 10]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
        
        <!-- 其他功能页面 -->
            <!-- 添加用户功能对话框 -->
        <el-dialog title="添加用户" :visible.sync="addUsersDialog">
            <el-form :model="addUsersForm" label-position="rigth" label-width="100px" :rules="addUsersRules">
                <el-form-item label="用户名" prop="username"> 
                    <el-input v-model="addUsersForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUsersForm.password" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUsersForm.email" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addUsersForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addUsersDialog = false">取 消</el-button>
                <el-button type="primary" @click="addusers">确 定</el-button>
            </div>
        </el-dialog>

            <!-- 编辑用户功能对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editUsersDialog">
            <el-form :model="editUsersForm" label-position="rigth" label-width="100px" :rules="editUsersRules">
                <el-form-item label="用户名" prop="username"> 
                    <el-input disabled v-model="editUsersForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUsersForm.email" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editUsersForm.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editUsersDialog = false">取 消</el-button>
                <el-button type="primary" @click="editusers">确 定</el-button>
            </div>
        </el-dialog>

            <!-- 分配角色功能对话框 -->
        <el-dialog title="分配角色" :visible.sync="assignRolesDialog">
            <el-form :model="assignRolesForm">
                <el-form-item label="用户名" label-width="100px">
                    {{assignRolesForm.userdata.username}}
                </el-form-item>

                <el-form-item label="角色" label-width="100px">
                    <el-select v-model="finalSelectData">
                        <el-option label="请选择角色" :value="-1" disabled></el-option>
                        <el-option 
                        v-for="(val,index) of assignRolesForm.selectData"
                        :key="index"
                        :label="val.roleName" 
                        :value="val.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="assignRolesDialog = false">取 消</el-button>
                <el-button type="primary" @click="assignRoles">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
export default {
    data() {
        return {
        // 搜索栏数据
            usersInput:'',

        // 用户表格数据
            usersTableData:[
                // 数据表示
                // username:姓名
                // email:邮箱
                // mobile:电话
                // create_time:创建时间
                // mg_state:用户状态
                // id:用户id
                // role_name:角色名称
            ],


        // 分页数据
            // 当前页码
            pagenum:1,
            // 每页显示条数
            pagesize:2,
            // 总记录数
            total:0,

        // 其他数据
            // 添加用户数据
                // 添加用户对话框是否可见
            addUsersDialog:false,
                // 添加用户对话框表单数据
            addUsersForm:{
                username:'',
                password:'',
                email:'',
                mobile:'',
                },
                // 添加用户表单验证规则
            addUsersRules:{
                username:[{required:true,message:'用户名不能为空',trigger:'blur'}],
                password:[
                    {required:true,message:'密码不能为空',trigger:'blur'},
                    {pattern:/^[^\u4e00-\u9fa5]{8,16}$/,message:'密码长度为8~16位的非中文字符',trigger:'change'}
                ],
                email:[{pattern:/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,message:'邮箱格式错误',trigger:'change'}],
                mobile:[{pattern:/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/,message:'电话格式错误',trigger:'change'}],
            },

            // 编辑用户数据
                // 编辑用户对话框是否可见
            editUsersDialog:false,
                // 编辑用户对话框表单数据
            editUsersForm:{
                // 数据同表格数据一样，修改页面打开时，会进行赋值
            },
                // 编辑用户表单验证规则
            editUsersRules:{
                email:[{pattern:/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,message:'邮箱格式错误',trigger:'change'}],
                mobile:[{pattern:/^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/,message:'电话格式错误',trigger:'change'}],
            },

            // 分配角色数据
                // 分配角色对话框是否可见
            assignRolesDialog:false,
                // 分配角色对话框表单数据
            assignRolesForm:{
                    //用户的基本数据 
                userdata:{},
                    // 下拉列表的选项数据
                selectData:[],
            },
                // 选择后的最终列表数据
            finalSelectData:-1,
        }
    },
    methods: {
    // 搜索栏事件
        // 搜索用户
        searchUsers(){
            this.getUserList(false);
        },

    // 用户表格事件
        // 改变用户当前状态
        changeUsersState(id,state){
            this.$axios.put(`users/${id}/state/${state}`)
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 请求成功提示
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                }else{
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'error'
                    });
                }
            })
            .catch(err => {
                // 请求发送失败的处理
                this.$message({
                    showClose: true,
                    message: '网络错误，未连接服务器！',
                    type: 'error'
                });
            })
        },

        // 打开删除用户弹框
        openDeleteMessageBox(id){
            this.$confirm('是否删除该用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                // 点击确定后发送请求删除用户
                this.$axios.delete(`users/${id}`)
                .then(res => {
                    const data = res.data.data;
                    const meta = res.data.meta;
                    if(meta.status === 200){
                        // 消息提示
                        this.$message({
                            type: 'success',
                            message: meta.msg,
                        });
                        // 更新列表
                        this.getUserList(false);
                    }
                })
                .catch(err => {
                    // 请求发送失败的处理
                    this.$message({
                        showClose: true,
                        message: '网络错误，未连接服务器！',
                        type: 'error'
                    });
                })
            })
            .catch(() => {
                // 消息提示
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },

        // 打开编辑用户对话框
        openEditUsersDialog(data){
            // 将数据赋值给对话框
            // let {username, email, mobile, id} = data;
            // this.$data.editUsersForm.username = username;
            // this.$data.editUsersForm.email = email;
            // this.$data.editUsersForm.mobile = mobile;
            // this.$data.editUsersForm.id = id;
            this.$data.editUsersForm = data;
            this.$data.editUsersDialog = true;
        },

        // 打开分配角色对话框
        openAssignRolesDialog(userdata){
            // 将用户基本数据给分配角色对话框
            this.$data.assignRolesForm.userdata = userdata;

            // 获取用户的角色id
            this.$axios.get(`users/${userdata.id}`)
            .then(res => {
                if(res.data.meta.status === 200){
                    // 将该用户的角色id给select
                    this.$data.finalSelectData = res.data.data.rid;
                }
            })

            // 发送获取角色列表的请求
            this.$axios.get('roles')
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 将获取的角色列表给下拉列表的选项
                    this.$data.assignRolesForm.selectData = data;
                }else{
                    // 提示问题
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'error'
                    });
                }
            })
            .catch(err => {
                // 发送失败处理
                this.$message({
                    showClose: true,
                    message: '网络错误，未连接服务器！',
                    type: 'error'
                }); 
            })

            // 打开对话框
            this.$data.assignRolesDialog = true;
        },


    // 分页事件
        // 页码改变时触发
        handleCurrentChange(val){
            // val表示当前所在的页码
            this.$data.pagenum = val;
            // 重新获取数据
            this.getUserList(false);
        },

        // 每页显示条数改变时触发
        handleSizeChange(val){
            // val表示当前修改的条数
            this.$data.pagesize = val;
            // 重新获取数据
            this.getUserList(false);
        },

    // 其他事件
        // 获取所有用户列表(bool代表是否提示列表更新成功)
        getUserList(bool){
            //获取token值
            const token = localStorage.getItem('token');
            //设置请求头
            this.$axios.defaults.headers.common['Authorization'] = token;
            //发送请求
            this.$axios.get('users',{
                params:{
                    query:this.$data.usersInput,
                    pagenum:this.$data.pagenum,
                    pagesize:this.$data.pagesize
                }
            })
            .then(res => {
                // 登录成功的处理
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    if(bool){
                        // 提示消息
                        this.$message({
                            showClose: true,
                            message: meta.msg,
                            type: 'success'
                        });
                    }
                    // 设置总人数
                    this.$data.total = data.total;
                    // 将数据给table用户表格
                    this.$data.usersTableData = data.users;
                }
            })
            .catch(err => {
                // 请求发送失败的处理
                this.$message({
                    showClose: true,
                    message: '网络错误，未连接服务器！',
                    type: 'error'
                });
            })

        },

        // 获取添加用户数据，发送请求事件
        addusers(){
            // 发送请求
            this.$axios.post('users',this.$data.addUsersForm)
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 201){
                    // 提示成功
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                    // 更新数据
                    this.getUserList(false);
                }else{
                    // 提示问题
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'error'
                    });
                }
            })
            .catch(err => {
                // 发送失败处理
                this.$message({
                    showClose: true,
                    message: '网络错误，未连接服务器！',
                    type: 'error'
                }); 
            })

            //清空表单数据
            this.$data.addUsersForm = {
                username:'',
                password:'',
                email:'',
                mobile:'',
            }

            // 关闭对话框
            this.$data.addUsersDialog = false;
        },

        // 获取编辑用户数据，发送请求
        editusers(){
            console.log(this.editUsersForm);
            this.$axios.put(`users/${this.$data.editUsersForm.id}`,this.$data.editUsersForm)
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 提示成功
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                    // 关闭对话框
                    this.$data.editUsersDialog = false;
                    // 更新数据
                    this.getUserList(false);
                }else{
                    // 提示问题
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'error'
                    });
                }
            })
            .catch(err => {
                // 发送失败处理
                this.$message({
                    showClose: true,
                    message: '网络错误，未连接服务器！',
                    type: 'error'
                }); 
            })
        },

        // 分配角色用户数据，发送请求
        assignRoles(){
            console.log(this.$data.finalSelectData);
            this.$axios.put(`users/${this.$data.assignRolesForm.userdata.id}/role`,{rid:this.$data.finalSelectData})
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 提示成功
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                    // 关闭对话框
                    this.$data.assignRolesDialog = false;
                    // 更新数据
                    this.getUserList(false);
                }else{
                    // 提示问题
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'error'
                    });
                }
            })
            .catch(err => {
                // 发送失败处理
                this.$message({
                    showClose: true,
                    message: '网络错误，未连接服务器！',
                    type: 'error'
                }); 
            })
        }
    },
    created(){
        // 数据代理完成后发送请求
        this.getUserList(true);
    }
        
    
}
</script>

<style scoped>
    .user-card {
        height: 100%;
    }
    .users-breadcrumb {
        margin-bottom: 20px;
    }
    .users-input {
        width: 30%;
        margin-right: 5px;
    }
</style>