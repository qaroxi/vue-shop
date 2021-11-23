<template>
    <el-card>
        <!-- 面包屑 -->
        <MyBread first="订单管理" second="订单列表"></MyBread>

        <!-- 表格 -->
        <el-table
        :data="ordersTableData"
        stripe
        height="500"
        style="width: 100%">
            <el-table-column
            type="index"
            label="#"
            width="50">
            </el-table-column>
            <el-table-column
            prop="order_number"
            label="订单编号"
            width="300">
            </el-table-column>
            <el-table-column
            prop="order_price"
            label="订单价格"
            width="250">
            </el-table-column>
            <el-table-column
            label="是否付款"
            width="150">
                <template slot-scope="scopeData">
                    <el-tag v-if="scopeData.row.pay_status === '0'" type="danger">未付款</el-tag>
                    <el-tag v-else-if="scopeData.row.pay_status === '1'">已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column
            prop="is_send"
            label="是否发货"
            width="150">
            </el-table-column>
            <el-table-column
            label="下单时间"
            width="150">
                <template slot-scope="scopeData">
                    {{scopeData.row.create_time|changeData}}
                </template>
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scopeData">
                    <div>
                        <el-button @click="openEditDialog(scopeData.row)" size="mini" type="primary" icon="el-icon-edit" plain circle></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑订单对话框 -->
        <el-dialog title="修改订单" :visible.sync="editOrdersDialog">
            <el-form :model="editOrdersForm" label-position="rigth" label-width="100px">
                <el-form-item label="选择省市区"> 
                    <el-cascader
                    clearable
                    :options="cityOptions"
                    v-model="cascader_value"
                    :props="{ expandTrigger: 'hover' }">
                    </el-cascader>
                </el-form-item>

                <el-form-item label="详细地址" prop="address"> 
                    <el-input v-model="editOrdersForm.address" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editOrdersDialog = false">取 消</el-button>
                <el-button type="primary" @click="editOrders">确 定</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import MyBread from '@/components/crumbs/myBread.vue'
import cityOptions from '@/assets/js/city_data2017_element.js'
export default {
    components:{MyBread,cityOptions},
    data() {
        return {
            // 表格数据
            ordersTableData:[],

            // 编辑订单对话框是否可见
            editOrdersDialog:false,
            // 编辑订单对话框数据
            editOrdersForm:{
                address:"",
            },

            // 级联选择器数据
            cityOptions:cityOptions,
            // 级联选择器选择数据
            cascader_value:[],

        }
    },
    methods:{
        // 打开编辑订单对话框
        openEditDialog(data){
            // 打开对话框
            this.$data.editOrdersDialog = true;

        },
        // 编辑订单
        editOrders(){
            // 无接口可发送请求
            this.$data.editOrdersDialog = false;
            // 初始化数据
            this.$data.cascader_value = [];
            this.$data.editOrdersForm = {
                address:"",
            };
        },
        // 获取订单列表
        getOrdersList(bool){
            this.$axios.get('orders?pagenum=1&pagesize=500')
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
                    this.$data.ordersTableData = data.goods;
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
        this.getOrdersList(true);
    }

}
</script>

<style>

</style>