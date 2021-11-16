<template>
    <el-card class="rights-card">
        <!-- 面包屑 -->
        <MyBread first="权限管理" second="权限列表"></MyBread>

        <!-- 表格 -->
        <el-table
            :data="rightsTableData"
            border
            style="width: 100%"
            height="500px">
            <el-table-column
            type="index"
            label="#"
            width="50">
            </el-table-column>
            <el-table-column
            prop="authName"
            label="权限名称"
            width="200">
            </el-table-column>
            <el-table-column
            prop="path"
            label="路径"
            width="200">
            </el-table-column>
            <el-table-column label="层级">
                <template slot-scope="scopeData">
                    <div v-if="scopeData.row.level === '0'">一级</div>
                    <div v-if="scopeData.row.level === '1'">二级</div>
                    <div v-if="scopeData.row.level === '2'">三级</div>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import MyBread from '@/components/crumbs/myBread.vue'
export default {
    components:{MyBread},
    data() {
        return {
            // 表格数据
            rightsTableData:[]
        }
    },
    methods: {
        // 获取列表数据
        getpowersList(){
            this.$axios.get('rights/list')
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
                    // 将数据给表格
                    this.$data.rightsTableData = data;
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
        this.getpowersList();
    },
}
</script>

<style scoped>
    .rights-card {
        height: 100%;
    }
</style>