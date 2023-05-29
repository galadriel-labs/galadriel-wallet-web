<!-- homePage -->
<template>
    <div class="homePage-container">
        <div class="homePage-content">
            <div class="title">Welcome to the Galadriel Wallet demo page!</div>
            <!-- <div class="msg">We have not been able to detect an active GALADRIEL Wallet on your system.Loading exit wallet <br>if you already have one. Otherwise, goahead and set up a new Wallet.</div> -->
            <div class="msg">
                The Galadriel Wallet demo is currently running on Scroll 
Testnet, and will be available on other Layer 2 networks soon. 
The Galadriel Wallet has a separate keypair besides the 
existing Scroll Testnet address.<br>
<br>
Log in to your Galadriel Wallet if you already have one. 
Otherwise, please set up a new Galadriel Wallet to continue.<br>
<br>
How to get started:<br>
1. Connect to the Scroll Testnet with Metamask<br>
2. Follow the instructions in Docs in the navigation bar to get 
Scroll test tokens<br>
3. Create a new Galadriel Wallet keypair.<br>
4. Deposit your Galadriel Wallet.<br>
5. Transfer using Galadriel Wallet. Please refer to the Docs in 
the navigation bar above for more detailed instructions.<br>
<br>
We have not been able to detect an active Galadriel Wallet on 
your system.
            </div>
            <div class="btns">
                <div class="loading-btn" @click="loading">Loading exist Galadriel Wallet</div>
                <div class="set-btn" @click="goCreat">
                    <span>Set up a new Galadriel Wallet</span>
                    <img src="../../assets/home/allow.png" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {
    },
    mounted() {
        document.title = 'Galadriel'
        if (localStorage.getItem('encKey')) {
            this.$router.push('loading')
        }
        // var hash = window.location.hash;
        // var index = hash.lastIndexOf("#");
        // if (index != -1) {
        // var id = hash.substring(index + 1, hash.length + 1);
        // var div = document.getElementById(id);
        // if (div) {
        //     const targetElement = document.querySelector('#press');
        //     targetElement.scrollIntoView({ behavior: 'smooth' });

        // }
        //  }
    },
    data () {
        return {
            title: ''
        }
    },
    methods: {
        goCreat() {
            this.$router.push('creat')
        },
        loading() {
            this.$router.push('loading')
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
@media (max-width: 959.95px){
    .homePage-container {
        min-height: 100vh;
        padding: 0 30px;
        padding-bottom: 30px;
        .homePage-content {
            padding-top: sn(100);
            // padding-left: sn(40);
            .title {
                font-size: sn(32);
                font-weight: 600;
                color: #FFFFFF;
            }
            .msg {
                font-size: sn(18);
                font-weight: 400;
                // line-height: sn(27);
                color: #DAAFFF;
                margin-top: sn(20);
            }
            .btns {
                margin-top: sn(60);
                display: flex;
                flex-direction: column;
            }
            .loading-btn {
                width: sn(280);
                height: sn(60);
                border: sn(1) solid #57B59C;
                border-radius: sn(42);
                font-size: sn(16);
                font-weight: 400;
                // line-height: sn(27);
                color: #6AB39C;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
            .set-btn {
                width: sn(330);
                height: sn(60);
                background: linear-gradient(145deg, #7358E4 0%, #6278CB 32%, #637DCB 55%, #70C2CB 81%, #41DBB6 100%);
                border-radius: sn(42);
                font-size: sn(16);
                font-weight: 400;
                color: #FFFFFF;
                text-shadow: 0px 3px 6px rgba(0,0,0,0.16);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                position: relative;
                 margin-top: sn(20);
                img {
                    width: sn(43);
                    height: sn(43);
                    position: absolute;
                    right: sn(10);
                    top: sn(12);
                }
            }
        }
    }
  }

@media (min-width: 959.95px){
.homePage-container {
    height: 100vh;
    .homePage-content {
        padding-top: fn(180);
        padding-left: fn(240);
        .title {
            font-size: fn(50);
            font-family: MiSans;
            font-weight: 600;
            line-height: fn(66);
            color: #FFFFFF;
        }
        .msg {
            font-size: fn(22);
            font-family: MiSans;
            font-weight: 400;
            line-height: fn(27);
            color: #DAAFFF;
            margin-top: fn(40);
        }
        .btns {
            margin-top: fn(100);
            display: flex;
        }
        .loading-btn {
            width: fn(326);
            height: fn(81);
            border: fn(1) solid #57B59C;
            border-radius: fn(63);
            font-size: fn(20);
            font-family: MiSans;
            font-weight: 400;
            line-height: fn(27);
            color: #6AB39C;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .set-btn {
            width: fn(392);
            height: fn(81);
            background: linear-gradient(145deg, #7358E4 0%, #6278CB 32%, #637DCB 55%, #70C2CB 81%, #41DBB6 100%);
            border-radius: fn(63);
            font-size: fn(20);
            font-family: MiSans;
            font-weight: 400;
            line-height: fn(27);
            color: #FFFFFF;
            text-shadow: 0px 3px 6px rgba(0,0,0,0.16);
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: fn(72);
            cursor: pointer;
            position: relative;
            img {
                width: fn(43);
                height: fn(43);
                position: absolute;
                right: fn(10);
                top: fn(22);
            }
        }
    }
}
}

</style>
