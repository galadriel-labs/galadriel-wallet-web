<template>
    <div class="footer">
      <div class="line"></div>
           
        </div>
</template>

<script>
export default {
  name: 'Galadriel-footer',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@function fn($data){
  @return $data/1920*100 + vw;
}
@function sn($data){
  @return $data/414*100 + vw;
}
.footer {
      width: 100%;
      height: fn(390);
      background: #0D1036;
      .line {
        width: fn(1200);
        height: fn(2);
        background: linear-gradient(297deg, rgba(54,184,157,0) 0%, #8142F3 51%, rgba(54,184,157,0) 100%);
        margin: 0 auto;
      }
      ul.list {
          width: fn(1200);
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          li {
              height: 100%;
              padding-top: fn(74);
              margin-left: fn(60);
              div.title {
                  font-size: fn(20);
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #8142F3;
                  line-height: fn(28);
                  img {
                      width: fn(56);
                      height: fn(63);
                      vertical-align: middle;
                      margin-right: fn(23);
                  }
              }
              p {
                font-size: fn(16);
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #666666;
                line-height: fn(22);
                &:hover {
                  color: #FFFFFF;
                }
              }
              p.left {
                // font-size: fn(13);
              }
          }
      }
  }


</style>
