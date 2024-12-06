<template>
  <div className="container">
    <div className="left-side">
      <div className="top-left">
        <div className="greeting">
          <h2>欢迎您，{{ username }}</h2>
        </div>
        <div className="weather-box">
          <!--          <h3>今日天气</h3>-->
          <div className="weather-info">
            <p className="weather-temperature">{{ weatcherData.temperature }}°</p>
            <p className="weather-info-text">{{ weatcherData.weather }}</p>
            <p className="weather-city">{{ weatcherData.city }}</p>
          </div>
        </div>
        <div className="saying-box">
          <!--          <h3>今日好句</h3>-->
          <p>{{ saying }}</p>
        </div>
      </div>
      <div className="bottom-left">
        <h2>今日TODO</h2>
      </div>
    </div>

    <div className="right-side">
      <div className="top-right">
        <h2>系统用户情况</h2>
      </div>
      <div className="bottom-right">
        <h2>订单收益情况</h2>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "MainBack",
  data() {
    return {
      username: "", // 用于保存当前登录用户的用户名
      weatcherData: {
        city: "",
        temperature: 0,
        weather: "",
      },
      saying: "", // 用于保存从后端获取的句子
    };
  },
  mounted() {
    this.username = localStorage.getItem("userName"); // 获取当前登录用户
    this.getCity();
    this.fetchSaying();  // 调用 fetchSaying 方法
  },
  methods: {
    // 获取当前城市信息
    getCity() {
      let that = this;
      AMap.plugin("AMap.CitySearch", function () {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function (status, result) {
          if (status === "complete" && result.info === "OK") {
            that.getWeather(result.city);
          }
        });
      });
    },
    // 获取当前天气信息
    getWeather(city) {
      let that = this;
      AMap.plugin("AMap.Weather", function () {
        let weather = new AMap.Weather();
        weather.getLive(city, function (err, data) {
          if (data.info === "OK") {
            that.weatcherData = data;
          }
        });
      });
    },
    // 获取今日好句
    async fetchSaying() {
      try {
        const response = await axios.get('http://localhost:8889/saying/selectSaying');
        if (response.data.code === 200) {
          this.saying = response.data.data; // 直接赋值为字符串
        } else {
          this.$message.error(response.data.msg);
        }
      } catch (error) {
        console.error('Error fetching saying:', error);
        this.$message.error('发生错误，请稍后再试');
      }
    },
  }
};
</script>

<style scoped>
/* 外部容器 */
.container {
  display: flex;
  height: 85vh;
  margin: 0 auto;
  gap: 15px;
}

/* 左侧部分 */
.left-side {
  width: 50%;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;
}

/* top-left 部分 */
.top-left {
  height: 50%;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px; /* 每个模块之间的间距 */
}

/* 修改：天气信息横向排列 */
.weather-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 15px; /* 信息之间的间距 */
}

/* 字体样式 */
.weather-temperature {
  font-size: 18px;
  font-weight: bold;
}

.weather-info-text {
  font-size: 14px;
}

.weather-city {
  font-size: 16px;
}

/* 修改：展示句子的样式 */
.saying-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 下四分之三部分 */
.bottom-left {
  height: 50%;
  background-color: #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}

/* 右侧部分 */
.right-side {
  width: 50%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 右上部分 */
.top-right {
  flex: 1;
  background-color: #d0d0d0;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: auto;
}

/* 右下部分 */
.bottom-right {
  flex: 1;
  background-color: #b0b0b0;
  border-radius: 10px;
  padding: 20px;
  overflow: auto;
}
</style>
