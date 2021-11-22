<template>
    <el-card>
        <!-- 面包屑 -->
        <MyBread first="商品管理" second="分类参数"></MyBread>

        <!-- Alert 警告，消息提示 -->
        <el-alert
        title="只允许为三级分类设置参数"
        type="error"
        center
        show-icon>
        </el-alert>

        <!-- 级联选择器 -->
        <el-form class="parameterCascader" label-position="left" label-width="80px">
            <el-form-item label="商品分类">
                <el-cascader
                @change="cascaderChoose"
                :show-all-levels="false"
                clearable
                v-model="cascader_value"
                :options="cascader_data"
                :props="cascader_props"></el-cascader>
            </el-form-item>
        </el-form>

        <!-- tabs标签页 -->
        <el-tabs v-model="active" @tab-click="tabsChoose">
            <el-tab-pane label="动态参数" name="1">
                <el-button @click="addDynamicDialog = true" type="danger" plain>设置动态参数</el-button>
                <el-table
                :data="dynamicTableData"
                style="width: 100%">
                    <el-table-column 
                    type="expand"
                    label="#"
                    width="50">
                        <template slot-scope="scopeData">
                            <el-tag
                            :key="tag"
                            v-for="tag in scopeData.row.attr_vals"
                            closable
                            :disable-transitions="false"
                            @close="tagClose(scopeData.row,tag)">
                            {{tag}}
                            </el-tag>
                            <el-input
                            class="input-new-tag"
                            v-if="tagInputVisible"
                            v-model="tagInputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scopeData.row)"
                            @blur="handleInputConfirm(scopeData.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showTagInput">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="属性名称"
                    prop="attr_name"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    label="操作"
                    prop="id">
                        <template slot-scope="scopeData">
                            <div>
                                <el-button @click="openEditdynamic(scopeData.row)" size="mini" type="primary" icon="el-icon-edit" plain circle></el-button>
                                
                                <el-button @click="openDeleteMessageBox(scopeData.row.attr_id)" size="mini" type="danger" icon="el-icon-delete" plain circle></el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="2">
                <el-button @click="addStaticDialog = true" type="danger" plain>设置静态参数</el-button>
                <el-table
                :data="staticTableData"
                border
                height="500"
                style="width: 100% ">
                    <el-table-column
                    type="index"
                    label="#"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    prop="attr_name"
                    label="属性名称"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="attr_vals"
                    label="属性值"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    label="操作">
                        <template slot-scope="scopeData">
                            <div>
                                <el-button @click="openEditStatic(scopeData.row)" size="mini" type="primary" icon="el-icon-edit" plain circle></el-button>
                                
                                <el-button @click="openDeleteMessageBox(scopeData.row.attr_id)" size="mini" type="danger" icon="el-icon-delete" plain circle></el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>

        <!-- 添加动态参数对话框 -->
        <el-dialog title="添加参数" :visible.sync="addDynamicDialog">
            <el-form :model="addDynamicForm" label-position="rigth" label-width="100px">
                <el-form-item label="属性名称" prop="attr_name"> 
                    <el-input v-model="addDynamicForm.attr_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDynamicDialog = false">取 消</el-button>
                <el-button type="primary" @click="addDynamic">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 添加静态参数对话框 -->
        <el-dialog title="添加参数" :visible.sync="addStaticDialog">
            <el-form :model="addStaticForm" label-position="rigth" label-width="100px">
                <el-form-item label="属性名称" prop="attr_name"> 
                    <el-input v-model="addStaticForm.attr_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addStaticDialog = false">取 消</el-button>
                <el-button type="primary" @click="addStatic">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑动态参数对话框 -->
        <el-dialog title="添加参数" :visible.sync="editDynamicDialog">
            <el-form :model="editDynamicForm" label-position="rigth" label-width="100px">
                <el-form-item label="属性名称" prop="attr_name"> 
                    <el-input v-model="editDynamicForm.attr_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDynamicDialog = false">取 消</el-button>
                <el-button type="primary" @click="editDynamic">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑静态参数对话框 -->
        <el-dialog title="添加参数" :visible.sync="editStaticDialog">
            <el-form :model="editStaticForm" label-position="rigth" label-width="100px">
                <el-form-item label="属性名称" prop="attr_name"> 
                    <el-input v-model="editStaticForm.attr_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="属性值" prop="attr_vals"> 
                    <el-input v-model="editStaticForm.attr_vals" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editStaticDialog = false">取 消</el-button>
                <el-button type="primary" @click="editStatic">确 定</el-button>
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
            // 级联选择器数据
            cascader_data:[],
                // 级联选择器选择的值
            cascader_value:[],
                // 级联选择器的数据配置
            cascader_props:{
                expandTrigger: 'hover' ,
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            // tabs标签页数据
                // tabs标签页选择的数据
            active:'1',
                // 动态表格数据
            dynamicTableData:[],
                // 静态表格数据
            staticTableData:[],
            
                // 动态参数tag标签数据
                    // 添加tag标签的输入框是否可见
            tagInputVisible: false,
                    // 添加tag标签的输入框的值
            tagInputValue: '',


            // 其他数据
            // 添加动态参数数据
                // 添加动态参数对话框是否可见
            addDynamicDialog:false,
                // 添加动态参数对话框表单数据
            addDynamicForm:{
                attr_name:'',
                attr_sel:'many',
            },
            // 添加静态参数数据
                // 添加动态参数对话框是否可见
            addStaticDialog:false,
                // 添加动态参数对话框表单数据
            addStaticForm:{
                attr_name:'',
                attr_sel:'only',
            },

            // 编辑动态参数数据
                // 编辑动态参数对话框是否可见
            editDynamicDialog:false,
                // 编辑动态参数对话框表单数据
            editDynamicForm:{
                attr_id:'',
                attr_name:'',
                attr_sel:'many',
                attr_vals:''
            },
            // 编辑静态参数数据
                // 编辑静态参数对话框是否可见
            editStaticDialog:false,
                // 编辑静态参数对话框表单数据
            editStaticForm:{
                attr_id:'',
                attr_name:'',
                attr_sel:'only',
                attr_vals:''
            },
        }
    },
    methods:{
        // 级联选择器事件
            // 级联选择器选择后触发的函数
        cascaderChoose(){
            if(this.$data.cascader_value.length === 3){
                this.getDynamicData();

            }

        },
        // tabs标签页事件
            // 取消tag标签
        tagClose(data,tag) {
            data.attr_vals.splice(data.attr_vals.indexOf(tag), 1);

            // 创建请求体数据
            let manyData = {
                attr_name:data.attr_name,
                attr_sel:'many',
                attr_vals:data.attr_vals.join(','),
            }

            // 发送请求删除tag
            this.$axios.put(`categories/${this.$data.cascader_value[2]}/attributes/${data.attr_id}`,manyData)
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 消息提示
                    this.$message({
                        type: 'success',
                        message: meta.msg,
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
            // 点击打开tag输入框
        showTagInput() {
            this.tagInputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
            // 按回车或者失去焦点时添加tag标签
        handleInputConfirm(data) {
            let tagInputValue = this.tagInputValue;
            // 判断输入框是否有值
            if (tagInputValue) {
                data.attr_vals.push(tagInputValue);
                // 创建请求体数据
                let manyData = {
                    attr_name:data.attr_name,
                    attr_sel:'many',
                    attr_vals:data.attr_vals.join(','),
                }

                // 发送请求添加tag
                this.$axios.put(`categories/${this.$data.cascader_value[2]}/attributes/${data.attr_id}`,manyData)
                .then(res => {
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 消息提示
                    this.$message({
                        type: 'success',
                        message: meta.msg,
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
            }
            // 关闭输入框
            this.tagInputVisible = false;
            // 将值改为空
            this.tagInputValue = '';
        },
        
            // tabs标签页选择后触发
        tabsChoose(e){
            if(e.index === '1'){
                this.getStaticData();
            }
        },

            // 打开编辑动态参数对话框
        openEditdynamic(data){
            this.$data.editDynamicDialog = true;
            // 赋值给input框
            this.$data.editDynamicForm.attr_name = data.attr_name;
            this.$data.editDynamicForm.attr_id = data.attr_id;
        },
            // 打开编辑静态参数对话框
        openEditStatic(data){
            this.$data.editStaticDialog = true;
            console.log(data);
            // 赋值给input框
            this.$data.editStaticForm.attr_name = data.attr_name;
            this.$data.editStaticForm.attr_id = data.attr_id;
            this.$data.editStaticForm.attr_vals = data.attr_vals;
        },

        // 其他事件
            // 打开删除动态/静态参数消息框
        openDeleteMessageBox(id){
            this.$confirm('是否删除该参数?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                // 点击确定后发送请求删除用户
                this.$axios.delete(`categories/${this.$data.cascader_value[2]}/attributes/${id}`)
                .then(res => {
                    const meta = res.data.meta;
                    if(meta.status === 200){
                        // 消息提示
                        this.$message({
                            type: 'success',
                            message: meta.msg,
                        });
                        // 更新列表
                        this.getDynamicData();
                        this.getStaticData();
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

            // 编辑动态参数
        editDynamic(){
            // 发送请求
            this.$axios.put(`categories/${this.$data.cascader_value[2]}/attributes/${this.$data.editDynamicForm.attr_id}`,this.$data.editDynamicForm)
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 消息提示
                    this.$message({
                        type: 'success',
                        message: meta.msg,
                    });
                    // 关闭对话框
                    this.$data.editDynamicDialog = false;
                    // 刷新数据
                    this.getDynamicData();
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
            // 编辑静态参数
        editStatic(){
            // 发送请求
            this.$axios.put(`categories/${this.$data.cascader_value[2]}/attributes/${this.$data.editStaticForm.attr_id}`,this.$data.editStaticForm)
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 消息提示
                    this.$message({
                        type: 'success',
                        message: meta.msg,
                    });
                    // 关闭对话框
                    this.$data.editStaticDialog = false;
                    // 刷新数据
                    this.getStaticData();
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
        
            // 添加静态参数
        addStatic(){
            this.$axios.post(`categories/${this.$data.cascader_value[2]}/attributes`,this.$data.addStaticForm)
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 201){
                    // 刷新数据，重新获取动态参数
                    this.getStaticData();
                    // 关闭对话框
                    this.$data.addStaticDialog = false;
                    // 刷新input框
                    this.$data.addStaticForm = {attr_name:'',attr_sel:'only',}
                    // 消息提示
                    this.$message({
                        type: 'success',
                        message: meta.msg,
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
            // 添加动态参数
        addDynamic(){
            this.$axios.post(`categories/${this.$data.cascader_value[2]}/attributes`,this.$data.addDynamicForm)
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 201){
                    // 刷新数据，重新获取动态参数
                    this.getDynamicData();
                    // 关闭对话框
                    this.$data.addDynamicDialog = false;
                    // 刷新input框
                    this.$data.addDynamicForm = {attr_name:'',attr_sel:'many',}
                    // 消息提示
                    this.$message({
                        type: 'success',
                        message: meta.msg,
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
        
            // 获取3级商品分类的数据
        getGoodsClass(){
            this.$axios.get(`categories?type=3`)
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 将获取的数据给级联选择器
                    this.$data.cascader_data = data;
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

            // 获取静态参数
        getStaticData(){
            if(this.$data.cascader_value.length === 3){
                this.$axios.get(`categories/${this.$data.cascader_value[2]}/attributes?sel=only`)
                .then(res => {
                    const data = res.data.data;
                    const meta = res.data.meta;
                    if(meta.status === 200){
                        // 将获取的数据给静态数据表格
                        this.$data.staticTableData = data;
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
            }
        },
            // 获取动态参数
        getDynamicData(){
            this.$axios.get(`categories/${this.$data.cascader_value[2]}/attributes?sel=many`)
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 将获取的数据给动态数据表格
                    this.$data.dynamicTableData = data;
                    // 将复选框数据变成数组形式
                    this.$data.dynamicTableData.forEach(element => {
                        element.attr_vals.length === 0?
                        element.attr_vals = []:element.attr_vals = element.attr_vals.trim().split(',');
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
        }
    },
    created(){
        this.getGoodsClass()
    }
}
</script>

<style>
    .parameterCascader {
        margin-top: 20px;
    }
    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }
</style>