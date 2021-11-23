<template>
    <el-card class="reportsCard">
        <!-- 面包屑 -->
        <MyBread first="数据统计" second="数据报表"></MyBread>
        
        <!-- 数据报表 -->
        <div id="main" style="width: 100%;height:550px;"></div>
    </el-card>
</template>

<script>
import MyBread from '@/components/crumbs/myBread.vue'
const echarts = require('echarts');
export default {
    components:{MyBread,echarts},
    methods:{
        async useEchart(){
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            const res = await this.$axios.get('reports/type/1')
            var option2 = res.data.data;

            // 指定图表的配置项和数据
            var option1 = {
                title: {
                    text:'堆叠区域图'
                },

                tooltip: {
                    trigger:'axis',
                    axisPointer: {
                        type:'cross',
                        label: {
                            backgroundColor:'#6a7985'
                        }
                    }
                },

                toolbox: {
                    feature: {
                        saveAsImage:{}
                    }
                },

                grid: {
                    left:'3%',
                    right:'4%',
                    bottom:'3%',
                    containLabel:true
                }
            };


            let option = {...option1,...option2}
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
    },
    mounted() {
        this.useEchart();
    },

}
</script>

<style>
    .reportsCard {
        height: 100%;
    }
</style>