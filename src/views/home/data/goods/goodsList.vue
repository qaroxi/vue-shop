<template>
    <el-card class="goodsListCard">
        <!-- 面包屑 -->
        <MyBread first="商品管理" second="商品列表"></MyBread>

        <!-- 搜索栏 -->
        <el-input class="goodsList-input" placeholder="请输入内容" v-model="goodsListInput">
            <el-button @click="searchGoods" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="$router.push({name:'goodsAdd'});" type="success" plain>添加商品</el-button>

        <!-- 表格 -->
        <el-table
        class="goodsListTable"
        :data="goodsTableData"
        border
        height="500"
        style="width: 100% ">
            <el-table-column
            type="index"
            label="#"
            width="50">
            </el-table-column>
            <el-table-column
            prop="goods_name"
            label="商品名称"
            width="520">
            </el-table-column>
            <el-table-column
            prop="goods_price"
            label="商品价格(元)"
            width="120">
            </el-table-column>
            <el-table-column
            prop="goods_weight"
            label="商品重量"
            width="120">
            </el-table-column>
            <el-table-column
            prop="goods_number"
            label="商品数量"
            width="120">
            </el-table-column>
            <el-table-column
            prop="add_time"
            label="创建日期"
            width="120">
                <template slot-scope="scopeData">
                    {{scopeData.row.add_time|changeData}}
                </template>
            </el-table-column>
            <el-table-column
            label="操作">
                <template slot-scope="scopeData">
                    <div>
                        <el-button @click="openEditGoods(scopeData.row)" size="mini" type="primary" icon="el-icon-edit" plain circle></el-button>
                        
                        <el-button @click="openDeleteMessageBox(scopeData.row.goods_id)" size="mini" type="danger" icon="el-icon-delete" plain circle></el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 编辑商品对话框 -->
        <el-dialog title="编辑商品" :visible.sync="editGoodsDialog">
            <el-form :model="editGoodsForm" label-position="rigth" label-width="100px" :rules="editGoodsRules">
                <el-form-item label="商品名称" prop="goods_name"> 
                    <el-input v-model="editGoodsForm.goods_name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="editGoodsForm.goods_price" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="editGoodsForm.goods_weight" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="editGoodsForm.goods_number" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editGoodsDialog = false">取 消</el-button>
                <el-button type="primary" @click="editGoods">确 定</el-button>
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
            // 当前页
            pagenum:1,
            // 当前页的数量(这里填的数据相当于获取了目前数据库所有的商品)
            pagesize:999,

            // 搜索栏数据
            goodsListInput:'',

            // 表格数据
            goodsTableData:[],

            // 编辑商品数据
                // 编辑商品对话框是否可见
            editGoodsDialog:false,
                // 编辑商品对话框表单数据
            editGoodsForm:{},
                // 编辑商品表单验证规则
            editGoodsRules:{
                goods_name:[
                    { required: true, message: '商品名称不能为空'},
                ],
                goods_price:[
                    { required: true, message: '商品价格不能为空'},
                    { type: 'number', message: '商品价格必须为数字值'}
                ],
                goods_weight:[
                    { required: true, message: '商品重量不能为空'},
                    { type: 'number', message: '商品重量必须为数字值'}
                ],
                goods_number:[
                    { required: true, message: '商品数量不能为空'},
                    { type: 'number', message: '商品数量必须为数字值'}
                ],
            },
        }
    },

    methods:{
        // 输入框事件
            // 查询商品
        searchGoods(){
            this.getGoodsList(false);
        },

        // 表格事件
            // 打开删除商品弹框
        openDeleteMessageBox(id){
            this.$confirm('是否删除该商品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(() => {
                // 点击确定后发送请求删除用户
                this.$axios.delete(`goods/${id}`)
                .then(res => {
                    const meta = res.data.meta;
                    if(meta.status === 200){
                        // 消息提示
                        this.$message({
                            type: 'success',
                            message: meta.msg,
                        });
                        // 更新列表
                        this.getGoodsList(false);
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
        
            // 打开编辑商品对话框
        openEditGoods(goods){
            // 将当前需要编辑的商品数据赋值给editGoodsForm
            this.$data.editGoodsForm = goods;
            // 添加一个商品分类列表的属性
            // 此处商品列表修改了接口中 services/GoodService.js 第561行，否则无法进行编辑商品功能的编写
            this.$data.editGoodsForm.goods_cat = `${goods.cat_one_id},${goods.cat_two_id},${goods.cat_three_id}`;
            // 打开编辑商品对话框
            this.$data.editGoodsDialog = true;
        },
        // 其他事件
            // 编辑商品
        editGoods(){
            this.$axios.put(`goods/${this.$data.editGoodsForm.goods_id}`,this.$data.editGoodsForm)
            .then(res => {
                const meta = res.data.meta;
                console.log(res);
                if(meta.status === 200){
                    // 消息提示
                    this.$message({
                        type: 'success',
                        message: '商品更新成功',
                    });
                    // 关闭对话框
                    this.$data.editGoodsDialog = false;
                    // 更新列表
                    this.getGoodsList(false);
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
        // 获取所有的商品
        getGoodsList(bool){
            this.$axios.get(`goods`,{
                params:{
                    query:this.$data.goodsListInput,
                    pagenum:this.$data.pagenum,
                    pagesize:this.$data.pagesize
                }
            })
            .then(res => {
                const data = res.data.data;
                const meta = res.data.meta;
                if(meta.status === 200){
                    // 消息提示
                    if(bool){
                        this.$message({
                            type: 'success',
                            message: meta.msg,
                        });
                    }
                    this.$data.goodsTableData = data.goods
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
        this.getGoodsList(true)
    }

}
</script>

<style scoped>
    .goodsListCard {
        height: 100%;
    }

    .goodsList-input {
        width: 30%;
        margin-right: 5px;
    }

    .goodsListTable {
        margin-top: 10px;
    }
</style>