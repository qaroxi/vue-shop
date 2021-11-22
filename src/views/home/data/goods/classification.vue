<template>
    <el-card>
        <!-- 面包屑 -->
        <MyBread first="商品管理" second="商品分类"></MyBread>

        <!-- 按钮 -->
        <el-button @click="openAddClassDialog" type="success" plain>添加分类</el-button>

        <!-- 表格数据 -->
        <el-table
            :data="classificationTableData"
            height="500"
            stripe
            style="width: 100%">
            <!-- <el-table-column prop="cat_name" label="分类名称" width="250">
            </el-table-column> -->
            <!-- 
                treeKey - nodeKey - 节点唯一标识 id
                parentKey - 父节点的id
                levelKey - 当前节点的级别
                childKey - 子节点
             -->
            <el-tree-grid
            prop="cat_name" 
            label="分类名称"
            treeKey="cat_id"
            parentKey="cat_pid"
            levelKey="cat_level"
            childKey="children"
            folderIcon="none">
                
            </el-tree-grid>
            <el-table-column
            label="级别"
            width="300">
                <template slot-scope="scopeData">
                    <span v-if="scopeData.row.cat_level === 0">一级</span>
                    <span v-else-if="scopeData.row.cat_level === 1">二级</span>
                    <span v-else-if="scopeData.row.cat_level === 2">三级</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="email"
            label="是否有效"
            width="300">
                <template slot-scope="scopeData">
                    <span v-if="scopeData.row.cat_deleted">无效</span>
                    <span v-else>有效</span>
                </template>
            </el-table-column>
            <el-table-column
            label="操作">
                    <template slot-scope="scopeData">
                        <div>
                            <el-button @click="openEditclassDialog(scopeData.row.cat_id)" size="mini" type="primary" icon="el-icon-edit" plain circle></el-button>
                            
                            <el-button @click="openDeleteMessageBox(scopeData.row.cat_id)" size="mini" type="danger" icon="el-icon-delete" plain circle></el-button>
                        </div>
                    </template>
            </el-table-column>
        </el-table>

        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addclassDialog">
            <el-form :model="addclassForm" label-position="rigth" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name"> 
                    <el-input v-model="addclassForm.cat_name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="attr_vals"> 
                    <el-cascader
                    :show-all-levels="false"
                    clearable
                    v-model="cascader_value"
                    :options="cascader_data"
                    :props="cascader_props">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addclassDialog = false">取 消</el-button>
                <el-button type="primary" @click="addclass">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑分类对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editclassDialog">
            <el-form :model="editclassForm" label-position="rigth" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name"> 
                    <el-input v-model="editclassForm.cat_name" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editclassDialog = false">取 消</el-button>
                <el-button type="primary" @click="editclass">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import MyBread from '@/components/crumbs/myBread.vue'
// 引入element-tree-grid组件
var ElTreeGrid = require('element-tree-grid');
export default {
    components:{MyBread,ElTreeGrid},
    data() {
        return {
            // 表格数据
            classificationTableData:[],
            
            // 添加分类对话框是否可见
            addclassDialog:false,
            // 添加分类对话框表单数据
            addclassForm:{
                cat_name:'',
                cat_pid:-1,
                cat_level:-1
            },

            // 编辑分类对话框是否可见
            editclassDialog:false,
            // 编辑分类对话框表单数据
            editclassForm:{
                cat_id:-1,
                cat_name:''
            },

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
        }
    },
    methods:{
        // 按钮数据
            // 打开添加分类对话框
        openAddClassDialog(){
            this.$data.addclassDialog = true;
            this.getGoodsClass();
        },

        // 表格数据
            // 打开编辑分类对话框
        openEditclassDialog(id){
            this.$data.editclassDialog = true;
            this.$data.editclassForm.cat_id = id;
        },
            // 打开删除分类消息框
        openDeleteMessageBox(id){
            this.$confirm('是否删除该分类?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                // 点击确定后发送请求删除用户
                this.$axios.delete(`categories/${id}`)
                .then(res => {
                    const meta = res.data.meta;
                    if(meta.status === 200){
                        // 消息提示
                        this.$message({
                            type: 'success',
                            message: meta.msg,
                        });
                        // 更新列表
                        this.getClassification(false);
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

        // 其他分类
            // 添加分类
        addclass(){
            // 将请求体准备好
            if(this.$data.cascader_value.length === 0){
                this.$data.addclassForm.cat_pid = 0
                this.$data.addclassForm.cat_level = 0
            }
            else if(this.$data.cascader_value.length === 1){
                this.$data.addclassForm.cat_pid = this.$data.cascader_value[0];
                this.$data.addclassForm.cat_level = 1
            }
            else if(this.$data.cascader_value.length === 2){
                this.$data.addclassForm.cat_pid = this.$data.cascader_value[1];
                this.$data.addclassForm.cat_level = 2
            }
            // 发送请求添加商品
            this.$axios.post('categories',this.$data.addclassForm)
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 201){
                    // 请求成功提示
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                    // 关闭对话框
                    this.$data.addclassDialog = false;
                    // 刷新数据
                    this.getClassification(false);
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
            // 编辑分类
        editclass(){
            this.$axios.put(`categories/${this.$data.editclassForm.cat_id}`,this.$data.editclassForm)
            .then(res => {
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 请求成功提示
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                    // 关闭对话框
                    this.$data.editclassDialog = false;
                    // 刷新数据
                    this.getClassification(false);
                    this.$data.editclassForm.cat_name = '';
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

            // 获取商品分类列表
        getClassification(bool){
            this.$axios.get('categories')
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 请求成功提示
                    if(bool){
                        this.$message({
                            showClose: true,
                            message: meta.msg,
                            type: 'success'
                        });
                    }
                    // 数据赋值
                    this.$data.classificationTableData = data;
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
            // 获取前2级商品分类的数据
        getGoodsClass(){
            this.$axios.get(`categories?type=2`)
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
    },
    created(){
        this.getClassification(true);
    }

}
</script>

<style>
</style>