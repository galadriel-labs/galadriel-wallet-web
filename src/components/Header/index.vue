<template>
   <div class="galadriel-header">
    <div class="galadriel-header-content">
      <div class="section" >
          <img @click="cclick('/')" src="../../assets/about/logo.png" alt="" class="logo">
          <a class="doc" href="https://galadriel.gitbook.io/galadriel/" target="_blank">Docs</a>
      </div>
      <div class="connect" @click="connect" v-if="!account">Connect Metamask</div>
      <div class="connect account" v-else>{{account}}</div>
    </div>
  </div>
</template>

<script>
import { hexValue } from 'ethers/lib/utils';
// import storage from 'store'
export default {
  name: 'Galadriel-header',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    toggleClick: {
      type: Function,
      default: null
    }
  },
  watch: {
    "$route.path": {
        immediate: true, 
        handler(new_value, old_value) {
            // 
            this.active = new_value
        },
    },
  },
  filters: {
      getAccount(account) {
          return account.substr(0, 6) + '...' +  account.substr(38);
      }
    },
  data() {
    return {
      active: '/',
      account: '',
    }
  },
  async mounted() {
     await this.check()
      this.connect()
        setInterval(() => {
            this.connect()
        }, 5000);
  },
  methods: {
    cclick(active) {
      this.active = active
      if (localStorage.getItem('encKey')) {
            this.$router.push('wallet')
        } else {
          this.$router.push('/')
        }
    },
    async connect() {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        // if(ethereum.chainId !== hexValue(config.chainId) ) {
        //     this.account = 'Network Error'
        //     return
        // }
        this.account = accounts[0].substr(0, 6) + '...' +  accounts[0].substr(38);
        localStorage.setItem('address', accounts[0])
        // this.$store.commit('SET_ACCOUNT', accounts[0])
        // storage.set('account', accounts[0])
      },
      async check() {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexValue(534353) }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: hexValue(534353),
                    chainName: 'Scroll Testnet',
                    nativeCurrency: {
                      name: 'GoerliETH',
                      symbol: 'ETH', // 2-6 characters long
                      decimals: 18
                    },
                    rpcUrls: ['https://alpha-rpc.scroll.io/l2'],
                    blockExplorerUrls: ['https://blockscout.scroll.io/']
                  },
                ],
              });
            } catch (addError) {
              // handle "add" error
            }
          }
          // handle other "switch" errors
        }
      },
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
@media (max-width: 959.95px){
  .galadriel-header {
    width: sn(414);
    height: sn(60);
    display: flex;
    align-items: center;
    background: rgba(6, 8, 40, 0.38);
    top: 0;
    position: fixed;
    z-index: 1;
    .galadriel-header-content {
      display: flex;
      margin: 0 auto;
      width: 100%;
      padding-left: sn(20);
      padding-right: sn(10);
    }
    .section {
      display: flex;
      align-items: center;
      justify-content: start;
      width: 100%;
      cursor: pointer;
      .logo {
        width: sn(150);
        // height: sn(15);
      }
      .doc {
        font-size: sn(16);
        font-weight: 400;
        color: #B7A5FF;
        margin-left: sn(20);
      }
    } 
    .section-desc {
        height: sn(25);
        margin-top: sn(11);
        font-size: sn(18);
        color: #A6A6A6;
        font-weight: 600;
    }
    .connect {
      width: sn(240);
      height: sn(40);
      background: linear-gradient(130deg, #442A67 0%, #064B6F 100%);
      border-radius: sn(24);
      font-size: sn(14);
      font-weight: 400;
      color: #FFFFFF;
      text-shadow: 0px 3px 6px rgba(0,0,0,0.16);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
@media (min-width: 959.95px){
  .galadriel-header {
    width: fn(1920);
    height: fn(100);
    display: flex;
    align-items: center;
    // background: rgba(6, 8, 40, 0.88);
    top: 0;
    position: fixed;
    z-index: 1;
    .galadriel-header-content {
      display: flex;
      margin: 0 auto;
      width: 100%;
      padding-left: fn(50);
      padding-right: fn(140);
    }
    .section {
      display: flex;
      align-items: center;
      justify-content: start;
      width: 100%;
      cursor: pointer;
      .logo {
        width: fn(180);
        height: fn(29);
      }
      .doc {
        font-size: fn(20);
        font-family: MiSans;
        font-weight: 400;
        line-height: fn(22);
        color: #B7A5FF;
        margin-left: 40px;
      }
    } 
    .section-desc {
        height: fn(25);
        margin-top: fn(11);
        font-size: fn(18);
        color: #A6A6A6;
        font-weight: 600;
    }
    .connect {
      width: fn(192);
      height: fn(50);
      background: linear-gradient(130deg, #442A67 0%, #064B6F 100%);
      border-radius: fn(25);
      font-size: fn(16);
      font-family: MiSans;
      font-weight: 400;
      line-height: fn(22);
      color: #FFFFFF;
      text-shadow: 0px 3px 6px rgba(0,0,0,0.16);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
