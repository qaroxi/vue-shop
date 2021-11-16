<template>
    <el-container class="home">
        <!-- 头部标题 -->
        <el-header class="header" height="80px">
            <el-row class="header_row">
                <el-col class="header_row_col" :span="3"><img src="../../assets/img/log.jpg" alt="图片加载中..."></el-col>
                <el-col class="header_row_col" :span="18"><h2>电商后台管理系统</h2></el-col>
                <el-col class="header_row_col" :span="3"><a @click.prevent="loginOut" href="#">退出</a></el-col>
            </el-row>
        </el-header>

        <el-container>
            <!-- 左部侧边导航栏栏 -->
            <el-aside class="aside" width="250px">
                <el-menu class="el-menu-vertical-demo" :unique-opened="true" :router="true">
                    <!-- 动态菜单栏(根据登录的用户的权限显示该用户可以使用的菜单列表) -->
                    <el-submenu :index="menu1.order+''" v-for="(menu1,index) of menus" :key="index">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{menu1.authName}}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item v-for="(menu2,index) of menu1.children" :key="index" :index="menu2.path">
                                <i class="el-icon-menu"></i>
                                <span>{{menu2.authName}}</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>

                <!-- 静态菜单栏 -->
                    <!-- 用户管理 -->
                    <!-- <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/users">
                                <i class="el-icon-menu"></i>
                                <span>用户列表</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu> -->

                    <!-- 权限管理 -->
                    <!-- <el-submenu index="2">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>权限管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/roles">
                                <i class="el-icon-menu"></i>
                                <span>角色列表</span>
                            </el-menu-item>
                            <el-menu-item index="/rights">
                                <i class="el-icon-menu"></i>
                                <span>权限列表</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu> -->

                    <!-- 商品管理 -->
                    <!-- <el-submenu index="3">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>商品管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/goods">
                                <i class="el-icon-menu"></i>
                                <span>商品列表</span>
                            </el-menu-item>
                            <el-menu-item index="/params">
                                <i class="el-icon-menu"></i>
                                <span>分类参数</span>
                            </el-menu-item>
                            <el-menu-item index="/categories">
                                <i class="el-icon-menu"></i>
                                <span>商品分类</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu> -->

                    <!-- 订单管理 -->
                    <!-- <el-submenu index="4">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>订单管理</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/orders">
                                <i class="el-icon-menu"></i>
                                <span>订单列表</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu> -->

                    <!-- 数据统计 -->
                    <!-- <el-submenu index="5">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据统计</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item index="/reports">
                                <i class="el-icon-menu"></i>
                                <span>数据报表</span>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu> -->
                </el-menu>
            </el-aside>

            <!-- 右部主内容 -->
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 动态菜单栏数据
            menus:[]
        }
    },
    beforeCreate(){
        // 判断本地存储是否有token，没有则跳转至登录界面
        let token = localStorage.getItem('token');
        if(!token){
            this.$router.replace({name:'login'});
        }
    },
    created(){
        this.getMenus();
    },
    methods:{
        // 登出：清除token并跳转至登录界面
        loginOut(){
            localStorage.removeItem('token');
            this.$router.replace({name:'login'});
        },

        // 获取菜单栏(根据登录的用户判断菜单的使用权限)
        getMenus(){
            this.$axios.get('menus')
            .then(res => {
                const data = res.data.data;
                this.$data.menus = data;
            })
        }
    },
}
</script>

<style scoped>
    .home {
        height: 100%;
    }
    /* 头部样式 */
    .header_row,
    .header_row_col {
        height: 100%;
    }
    .header .header_row .header_row_col img {
        width: 100%;
        height: 100%;
    }
    .header .header_row .header_row_col a {
        text-decoration: none;
    }
    .header .header_row  .header_row_col{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>