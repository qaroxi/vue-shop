<template>
    <el-card class="goodsAddCard">
        <!-- 面包屑 -->
        <MyBread first="商品管理" second="添加商品"></MyBread>

        <!-- Alert 警告，消息提示 -->
        <el-alert
        title="添加商品信息"
        type="success"
        center
        show-icon>
        </el-alert>

        <!-- 步骤条 -->
        <el-steps class="goodsAddSteps" :active="active*1" align-center finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>    
        </el-steps>

        <!-- 标签页 -->
        <el-tabs @tab-click="tabsChoose" v-model="active" tab-position="left" style="height: 100%;">
            <el-tab-pane name="0" label="基本信息">
                <el-form label-position="top" label-width="80px" :model="tab_0_form">
                    <el-form-item label="商品名称">
                        <el-input v-model="tab_0_form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="tab_0_form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="tab_0_form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="tab_0_form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <el-cascader
                        clearable
                        v-model="cascader_value"
                        :options="cascader_data"
                        :props="cascader_props"></el-cascader>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            
            <el-tab-pane name="1" label="商品参数">
                <el-form label-position="top">
                    <el-form-item v-for="(item1,index) of tab_1_data" :key="index" :label="item1.attr_name">
                        <el-checkbox-group v-model="item1.attr_vals">
                            <el-checkbox v-for="(item2,index) of item1.attr_vals" :label="item2" :key="index" border></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane name="2" label="商品属性">
                <el-form label-position="top">
                    <el-form-item v-for="(item,index) of tab_2_data" :key="index" :label="item.attr_name">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-form>
            </el-tab-pane>

            <el-tab-pane name="3" label="商品图片">
                <el-upload
                action="http://127.0.0.1:8888/api/private/v1/upload"
                :headers="uploadHeader"
                :on-remove="fileRemove"
                :on-success="filesuccess"
                list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>

            <el-tab-pane name="4" label="商品内容">
                <el-button @click="addGoods" type="primary">添加商品</el-button>
                <quillEditor v-model="editorData"></quillEditor>
            </el-tab-pane>
        </el-tabs>

    </el-card>
</template>

<script>
import MyBread from '@/components/crumbs/myBread.vue'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
    components:{MyBread,quillEditor},
    data() {
        return {
            // 添加商品的所需的所有数据
            addGoodsData:{
                // 添加商品需要的数据
                // | goods_name      | 商品名称
                goods_name:'',   
                // | goods_price     | 价格
                goods_price:'',                       
                // | goods_weight    | 重量
                goods_weight:'',                       
                // | goods_number    | 数量
                goods_number:'',                       
                // | goods_cat       | 以为','分割的分类列表
                goods_cat:'',      
                // | goods_introduce | 介绍
                goods_introduce:'',                       
                // | pics            | 上传的图片临时路径（对象）
                pics:[], 
                // | attrs           | 商品的参数（数组），包含 `动态参数` 和 `静态属性`
                attrs:[],
            },

            // 步骤条和标签页实现同步数据
            active:'0',

            // tabs标签页数据
                // 基本信息表单数据---对应添加商品的前4项
            tab_0_form:{
                // 商品名称
                goods_name:'',
                // 商品价格
                goods_price:'',
                // 商品重量
                goods_weight:'',
                // 商品数量
                goods_number:'',
            },
                // 级联选择器数据
            cascader_data:[],
                // 级联选择器选择的值---对应goods_cat
            cascader_value:[],
                // 级联选择器的数据配置
            cascader_props:{
                expandTrigger: 'hover' ,
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },

                // 商品参数数据---对应attrs
            tab_1_data:[],

                // 商品属性数据---对应attrs
            tab_2_data:[],

                // 上传图片的请求头
            uploadHeader:{
                Authorization:localStorage.getItem('token')
            },
            
                // 文本编辑器数据---对应goods_introduce
            editorData:''
        }
    },
    methods:{
        // 其他事件
            // 添加商品
        addGoods(){
            // 将商品信息赋值
            this.$data.addGoodsData = {...this.$data.addGoodsData,...this.$data.tab_0_form};

            // 将商品分类的值赋值
            this.$data.addGoodsData.goods_cat = this.$data.cascader_value.join(',');
            
            // 将商品介绍赋值
            this.$data.addGoodsData.goods_introduce = this.$data.editorData;

            // 将商品参数赋值
            this.$data.tab_1_data.forEach(element => {
                this.$data.addGoodsData.attrs.push({
                    attr_id:element.attr_id,
                    attr_vals:element.attr_vals.join(',')
                })
            });
            this.$data.tab_2_data.forEach(element => {
                this.$data.addGoodsData.attrs.push({
                    attr_id:element.attr_id,
                    attr_vals:element.attr_vals
                })
            });

            // 发送添加商品的请求
            this.$axios.post('goods',this.$data.addGoodsData)
            .then(res => {
                let meta = res.data.meta;
                if(meta.status === 201){//判断状态码是否为200
                    this.$message({
                        showClose: true,
                        message: meta.msg,
                        type: 'success'
                    });
                    this.$router.replace({name:'goods'});//登陆成功跳转至goods页面
                }else{
                    // 提示信息错误
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

        // tabs标签页事件
            // tabs标签页被选中时触发的函数
        tabsChoose(e){
            // 判断是否选中商品信息
            if(e.index !== '0'){
                // 如果选中的不是商品信息，则判断，是否选择三级分类，未选择则提示
                if(this.$data.cascader_value.length !== 3){
                    this.$message({
                        showClose: true,
                        message: '未选择三级分类',
                        type: 'warning'
                    });
                    return;
                }
                // 选择商品参数
                if(e.index === '1'){
                    this.$axios.get(`categories/${this.$data.cascader_value[2]}/attributes?sel=many`)
                    .then(res => {
                        const data = res.data.data;
                        const meta = res.data.meta;
                        if(meta.status === 200){
                            // 将获取的数据给商品参数
                            this.$data.tab_1_data = data;
                            // 将复选框数据变成数组形式
                            this.$data.tab_1_data.forEach(element => {
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
                // 选择商品属性
                else if(e.index === '2'){
                    this.$axios.get(`categories/${this.$data.cascader_value[2]}/attributes?sel=only`)
                    .then(res => {
                        const data = res.data.data;
                        const meta = res.data.meta;
                        if(meta.status === 200){
                            // 将获取的数据给商品属性
                            this.$data.tab_2_data = data;
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
            }
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

            // 上传的图片被删除时触发的事件
        fileRemove(file){
            // 删除当前移除的图片
            let index = this.$data.addGoodsData.pics.findIndex((item)=>{
                return item.pics === file.response.data.tmp_path
            })
            this.$data.addGoodsData.pics.splice(index,1);
        },

            // 上传图片成功时触发的事件
        filesuccess(file){
            // 将上传成功的图片的临时路径赋值
            this.$data.addGoodsData.pics.push({
                pic:file.data.tmp_path
            })
        },

        
    },
    created() {
        this.getGoodsClass();
    },

}
</script>

<style>
    .goodsAddCard {
        height: 100%;
    }
    .goodsAddSteps {
        margin-top: 20px;
        margin-bottom: 20px;
    }
    /* 富文本编辑器的样式 */
    .ql-editor {
        min-height: 300px;
    }
</style>