<template>
<!-- 面包屑组件 -->
    <el-breadcrumb class="users-breadcrumb" separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{first}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{second}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    props:['first','second']
}
</script>

<style>
    .users-breadcrumb {
        margin-bottom: 20px;
    }
</style>