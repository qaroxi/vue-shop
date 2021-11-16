<template>
    <el-card class="rolesCard">
        <!-- 面包屑 -->
        <MyBread first="权限管理" second="角色列表"></MyBread>

        <!-- 添加角色按钮 -->
        <el-row>
            <el-col>
                <el-button @click="addRolesDialog = true" plain>添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table
        :data="rolesTableData"
        style="width: 100%">
            <el-table-column type="expand" width="50">
                <template slot-scope="scopeData">
                    <el-row v-for="(right1,index) of scopeData.row.children" :key="index">
                        <el-col :span="4">
                            <el-tag @close="deleteTag(scopeData.row,right1.id)" closable>
                                {{right1.authName}}
                            </el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row v-for="(right2,index) of right1.children" :key="index">
                                <el-col :span="4">
                                    <el-tag @close="deleteTag(scopeData.row,right2.id)" type="success" closable>
                                        {{right2.authName}}
                                    </el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                                <el-col :span="20">
                                    <el-tag @close="deleteTag(scopeData.row,right3.id)" v-for="(right3,index) of right2.children" :key="index" type="info" closable>
                                        {{right3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <p class="rolesTable_p" v-if="scopeData.row.children.length === 0">未分配权限</p>
                </template>
            </el-table-column>
            <el-table-column
            type="index"
            label="#"
            width="50">
            </el-table-column>
            <el-table-column
            label="角色名称"
            prop="roleName"
            width="200">
            </el-table-column>
            <el-table-column
            label="角色描述"
            prop="roleDesc"
            width="200">
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scopeData">
                    <el-button @click="openeditRolesDialog(scopeData.row.id)" size="mini" type="primary" icon="el-icon-edit" plain circle></el-button>
                
                    <el-button @click="deleteRoles(scopeData.row.id)" size="mini" type="danger" icon="el-icon-delete" plain circle></el-button>
                    
                    <el-button @click="openAssignPermissionsDialog(scopeData.row)" size="mini" type="success" icon="el-icon-check" plain circle></el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 其他 -->
            <!-- 分配角色对话框 -->
        <el-dialog
        title="分配权限"
        :visible.sync="AssignPermissionsDialog"
        width="40%">
            <el-tree
            ref="tree"
            :data="treeData"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="checkTreeNode"
            :props="treeDefaultProps">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="AssignPermissionsDialog = false">取 消</el-button>
                <el-button type="primary" @click="assignPermissions">确 定</el-button>
            </span>
        </el-dialog>

            <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRolesDialog">
            <el-form :model="addRolesForm" label-position="rigth" label-width="100px" :rules="addRolesRules">
                <el-form-item label="角色名称" prop="roleName"> 
                    <el-input v-model="addRolesForm.roleName" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRolesDialog = false">取 消</el-button>
                <el-button type="primary" @click="addRoles">确 定</el-button>
            </div>
        </el-dialog>

            <!-- 编辑角色对话框 -->
        <el-dialog title="编辑角色" :visible.sync="editRolesDialog">
            <el-form :model="editRolesForm" label-position="rigth" label-width="100px">
                <el-form-item label="角色名称" prop="roleName"> 
                    <el-input v-model="editRolesForm.rolesForm.roleName" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRolesForm.rolesForm.roleDesc" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editRolesDialog = false">取 消</el-button>
                <el-button type="primary" @click="editRoles">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import MyBread from '@/components/crumbs/myBread.vue'
export default {
    components:{MyBread},
    data() {
        return {
            // 表格数据
            rolesTableData:[],
            // 其他数据
                // 分配权限对话框是否可见
            AssignPermissionsDialog:false,

                // 树形控件数据
            treeData:[],
                // 树形控件默认配置
            treeDefaultProps:{
                children: 'children',
                label: 'authName'
            },
                // 需要勾选的数节点
            checkTreeNode:[],
                // 当前选择的角色id
            checkRolesId:-1,

                // 添加角色表单数据
            addRolesForm:{
                roleName:'',
                roleDesc:''
            },
                // 添加角色对话框是否可见
            addRolesDialog:false,
                // 添加角色输入框规则
            addRolesRules:{
                roleName:[{required:true,message:'角色名不能为空',trigger:'change'}],
            },

                // 编辑角色表单数据
            editRolesForm:{
                rolesId:'',
                rolesForm:{
                    roleName:'',
                    roleDesc:''
                }
            },
                // 编辑角色对话框是否可见
            editRolesDialog:false,
                // 编辑角色输入框规则
        }
    },
    methods: {
        // 表格事件
            // 打开分配角色对话框
        openAssignPermissionsDialog(roles){
            // 获取树形权限列表
            this.$axios.get('rights/tree')
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                let arr = [];// 存储已有权限的树节点值
                if(meta.status === 200){
                    // 将数据给树形控件
                    this.$data.treeData = data;
                    roles.children.forEach(element => {
                        element.children.forEach(element1 => {
                            element1.children.forEach(element2 => {
                                arr.push(element2.id);
                            });
                        });
                    });
                    // 将角色有的权限的id值赋值给树
                    this.$data.checkTreeNode= arr;
                }
            })
            // 存取当前打开对话框的角色id
            this.$data.checkRolesId = roles.id;
            // 打开对话框
            this.$data.AssignPermissionsDialog = true;
        },
            // 打开编辑角色对话框
        openeditRolesDialog(rolesId){
            this.$data.editRolesDialog = true;
            // 将角色id赋值
            this.$data.editRolesForm.rolesId = rolesId;
        },
            // 删除角色
        deleteRoles(rolesId){
            this.$confirm('是否删除该角色?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                // 点击确定后发送请求删除用户
                this.$axios.delete(`roles/${rolesId}`)
                .then(res => {
                    const meta = res.data.meta;
                    if(meta.status === 200){
                        // 消息提示
                        this.$message({
                            type: 'success',
                            message: meta.msg,
                        });
                        // 更新列表
                        this.getRoles(false);
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
            // 删除角色权限
        deleteTag(roles,rightId){
            this.$axios.delete(`roles/${roles.id}/rights/${rightId}`)
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
                    // 将剩余数据给列表标签(data中返回的数据是该角色取消权限后剩余的所有权限)
                    roles.children = data;
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

        // 其他事件
            // 获取角色列表
        getRoles(bool){
            this.$axios.get('roles')
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 提示成功
                    if(bool){
                        this.$message({
                            showClose: true,
                            message: meta.msg,
                            type: 'success'
                        });
                    }
                    // 将数据给表格
                    this.$data.rolesTableData = data;
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
            // 分配权限给角色
        assignPermissions(){
            let tree = this.$refs.tree;
            let checked = tree.getCheckedKeys();
            let halfChecked = tree.getHalfCheckedKeys();
            let all = [...checked,...halfChecked];
            this.$axios.post(`roles/${this.$data.checkRolesId}/rights`,{
                rids:all.join(','),
            })
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 提示成功
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                    // 刷新页面
                    this.getRoles(false);
                    // 关闭对话框
                    this.$data.AssignPermissionsDialog = false;
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
            // 添加角色
        addRoles(){
            // 发送请求添加角色
            this.$axios.post('roles',this.$data.addRolesForm)
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 201){
                    // 提示成功
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                    // 关闭对话框
                    this.$data.addRolesDialog = false;
                    // 刷新页面
                    this.getRoles(false);
                    // 删除输入框数据
                    this.$data.addRolesForm = {roleName:'',roleDesc:''}
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
            // 编辑角色
        editRoles(){
            // 发送请求编辑角色
            this.$axios.put(`roles/${this.$data.editRolesForm.rolesId}`,this.$data.editRolesForm.rolesForm)
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 提示成功
                    this.$message({
                        showClose: true,
                        message: '更改成功',
                        type: 'success'
                    });
                    // 关闭对话框
                    this.$data.editRolesDialog = false;
                    // 刷新页面
                    this.getRoles(false);
                    // 删除输入框数据
                    this.$data.editRolesForm.rolesForm = {roleName:'',roleDesc:''}
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
    created() {
        this.getRoles(true);
    },

}
</script>

<style>
    .rolesCard{
        height: 100%;
    }
    .rolesTable_p {
        padding-left: 100px;
    }
</style>