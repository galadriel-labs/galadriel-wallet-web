<!-- wallet -->
<template>
    <div class="wallet-container">
        <div class="wallet-content">
            <div class="wallet-left">
                <div class="left-item active">
                    <router-link :to="{ path: '/wallet' }">My Wallet</router-link>
                </div>
                <div class="left-item">
                     <router-link :to="{ path: '/audit' }">Audit</router-link>
                </div>
                <!-- <div class="left-item">Account</div> -->
            </div>
            <div class="wallet-right">
                <div class="title">
                    <div class="name">My Wallet</div>
                    <div class="add-msg">
                        <div class="address">{{galadrielAddress | getAccount}}</div>
                        <img class="copy" @click="copy" src="../../assets/wallet/copy.png" alt="">
                        <img @click="makeQrcode" src="../../assets/wallet/qrcode.png" alt="">
                    </div>
                    <div class="load" @click="load">load other wallet</div>
                  
                </div>
                <div class="token-list">
                    <div class="token-item" v-for="item in token" v-bind:key='item.name'>
                        <div class="token-name-content">
                            <div class="token-name">
                                <!-- <img src="../../assets/wallet/usdt.png" alt=""> -->
                                <span>{{item.tokenName}}</span>
                            </div>
                            <div class="token-balance">{{item.balance / 100}}</div>
                        </div>
                        <div class="token-operation">
                            <div class="send" @click="send(item)">Send</div>
                            <div class="deposit" @click="deposit(item)">Deposit</div>
                            <div class="withdraw" @click="withdraw(item)">Withdraw</div>
                            <!-- <div class="more">learn more</div> -->
                        </div>
                    </div>
                </div>
                <div class="title-transactions">
                    <div class="name">Transactions</div>
                    <div class="txs-content" >
                        <div class="txs-item" v-for="item in txData" v-bind:key='item.hash'>
                            <div class="txs-hash">
                                <div class="item-name">TxHash</div>
                                <a class="hash" style="text-decoration: underline;" :href="'https://blockscout.scroll.io/tx/' + item.hash" target="_blank">{{item.hash| getAccount}}</a>
                                <a class="hash-web" style="text-decoration: underline;" :href="'https://blockscout.scroll.io/tx/' + item.hash" target="_blank">{{item.hash}}</a>
                            </div>
                            <div class="txs-time">
                                <div class="item-name">Time</div>
                                {{item.time}}</div>
                            <div class="txs-balance">
                                 <div class="item-name">tokenName</div>
                                {{item.tokenName}}</div>
                            <div class="txs-balance">
                                 <div class="item-name">Amount</div>
                                {{item.Amount/100}}</div>
                            <div class="txs-balance">
                                 <div class="item-name">Type</div>
                                {{item.type}}</div>
                        </div>
                    </div>
                </div>
            </div>
       </div>
       <el-dialog title="Send Asset" :visible.sync="dialogSendVisible" class="wallet-modal">
            <div class="content">
                <div class="title">
                    <img src="../../assets/wallet/usdt.png" alt="">
                    <span>{{sendItem.tokenName}}</span>
                </div>
                <div class="trade">
                    <div class="amount">
                        <div class="amount-title">Amount</div>
                        <el-input v-model="amount" @blur="()=>{amount=keepTwoDecimalFull(amount)}"   type="number" placeholder="" ></el-input>
                        <div class="balance">Balance: {{sendItem.balance / 100}}</div>
                    </div>
                    <div class="amount">
                        <div class="amount-title">Receiver address</div>
                        <el-input v-model="receiverAddress" type="text" placeholder="" ></el-input>
                    </div>
                </div>
                <div class="comfirm-content">
                    <div class="comfirm" @click="sendComfirm" >Comfirm</div>
                    <!-- <div class="comfirm" @click="approve(depositItem.token)" v-if="allowanceAmount==0">Approve</div> -->
                </div>
            </div>
        </el-dialog>
        <el-dialog title="Deposit" :visible.sync="dialogDepositVisible" class="wallet-modal">
            <div class="content">
                <div class="title">
                    <!-- <img src="../../assets/wallet/usdt.png" alt=""> -->
                    <span v-if="depositItem.tokenName === 'gETH'">Deposit Goerli ETH to get {{depositItem.tokenName}}</span>
                    <span v-else>Deposit Goerli {{depositItem ? depositItem.tokenName.substr(1): ''}} to get {{depositItem.tokenName}}</span>
                </div>
                <div class="trade">
                    <div class="amount">
                        <div class="amount-title">Amount</div>
                        <el-input v-model="depositAmount" @blur="()=>{depositAmount=keepTwoDecimalFull(depositAmount)}" type="number" placeholder="" suffix='ETH'></el-input>
                        <div class="balance">Goerli {{depositItem ? depositItem.tokenName.substr(1): ''}} Balance: {{balance}}</div>
                    </div>
                </div>
                <div class="comfirm-content">
                    <div class="comfirm" @click="depositComfirm" v-if="allowanceAmount>0 || depositItem.token == '0x0000000000000000000000000000000000000000' ">Comfirm</div>
                    <div class="comfirm" @click="approve(depositItem.token)" v-if="allowanceAmount==0 && depositItem.token != '0x0000000000000000000000000000000000000000'">Approve</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="Withdraw" :visible.sync="dialogWithdrawVisible" class="wallet-modal">
            <div class="content">
                <div class="title">
                    <img src="../../assets/wallet/usdt.png" alt="">
                    <span>{{withdrawItem.tokenName}}</span>
                </div>
                <div class="comfirm-content">
                    <div class="comfirm" @click="withdrawComfirm" >Comfirm</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="" @open='open' :visible.sync="dialogCodeVisible" class="wallet-modal">
            <div class="qrcode" ref="qrcode"></div>
        </el-dialog>
    </div>
</template>
<script>
import Qrcode from 'qrcodejs2'
import PGC from '@/contract/pgc.js'
import ERC20 from '@/contract/erc20.js'
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import {depositdatagen, getAccountInfo, transferdatagen, burndatagen, txs} from '@/api/index.js'
import cfg from '../../contract/abiConfig.js'
import {getTransactionHashData, decrypt} from '@/utils/index.js'
const pgc = new PGC()
const signer = pgc.signer
export default {
    components: {
    },
    mounted() {
            this.getWalletInfo()
            this.interval = setInterval(() => {
                this.getWalletInfo()
            }, 5000)
            
    },
    filters: {
      getAccount(account) {
          return account.substr(0, 6) + '...' +  account.substr(48);
      }
    },
    data () {
        return {
            galadrielAddress: localStorage.getItem('galadrielPubkey'),
            ethAddress: localStorage.getItem('address'),
            dialogSendVisible: false,
            dialogDepositVisible: false,
            dialogWithdrawVisible: false,
            dialogCodeVisible: false,
            amount:'',
            receiverAddress: '',
            depositAmount: '',
            token: [],
            depositItem: '',
            sendItem: '',
            withdrawItem: '',
            balance: '',
            allowanceAmount: 0,
            qrcode: '',
            txData: []
        }
    },
    destroyed() {
      clearInterval(this.intervalID)
      clearInterval(this.interval)
    },
    
    methods: {
        keepTwoDecimalFull(num) {
    var result = parseFloat(num)
    if (isNaN(result)) {
      return ''
    }
    result = Math.round(num * 100) / 100
    var s_x = result.toString()
    var pos_decimal = s_x.indexOf('.')
    if (pos_decimal < 0) {
      pos_decimal = s_x.length
      s_x += '.'
    }
    while (s_x.length <= pos_decimal + 2) {
      s_x += '0'
    }
    return  s_x
  },
        valueChange(e){
                e.target.value = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
                const reg = /[^\d.]/g;

                // 只能是数字和小数点，不能是其他输入
                e.target.value = e.target.value.replace(reg, "");

                // 保证第一位只能是数字，不能是点
                e.target.value = e.target.value.replace(/^\./g, "");
                // 小数只能出现1位
                e.target.value = e.target.value
                .replace(".", "$#$")
                .replace(/\./g, "")
                .replace("$#$", ".");
                // 小数点后面保留2位
                e.target.value = e.target.value.replace(
                /^(\-)*(\d+)\.(\d\d).*$/,
                "$1$2.$3"
                );
        },
        load() {
            localStorage.clear()
            this.$router.push('/')
        },
        copy() {
            this.$copyText(this.galadrielAddress).then(res =>{
                this.$notify({
                    title: 'Copy successfully',
                    message: '',
                    type: 'success'
                });
            })
        },
         makeQrcode(){
            this.dialogCodeVisible = true
        },
        open() {
            this.$nextTick(()=>{
                this.$refs.qrcode.innerHTML = ''
                new Qrcode(this.$refs.qrcode,{
                    // text 需要转二维码的内容 可以是文本也可以是一个链接 是链接会直接跳走
                    text:this.galadrielAddress,
                    width:200,
                    height:200,
                    colorDark:'#fff',//二维码颜色
                    colorLight:'#333',//二维码背景颜色
                    correctLevel:Qrcode.CorrectLevel.L//容错率,L/M/H
                })
            })
            
        },
        getWalletInfo(){
            let key = decrypt(localStorage.getItem('encKey'), localStorage.getItem('password'))//'2457be602dfba18d0c06399f89bd619ffbb06e0351fa985691d7b7b1945c2f50'
            let tokenlist = [
                '0x0000000000000000000000000000000000000000',
                '0xEF66655F7FF4b1B67Af052d88caeEEC31620C55E'
            ]
            getAccountInfo(key, tokenlist).then(res => {
                // console.log(res)
                this.token = res.list
            })
            txs(key, 100, 1).then(res => {
                console.log(res)
                this.txData = res
            })
        },
       send(item) {
            this.dialogSendVisible = true
            this.sendItem = item 
       },
       async deposit(item) {
            this.dialogDepositVisible = true
            this.depositItem = item 
            const pgc = new PGC()
            const signer = pgc.signer
            if (item.token === '0x0000000000000000000000000000000000000000') {
                signer.getBalance().then(res => {
                    console.log(res)
                    this.balance = formatEther(res)
                })
            } else {
                this.allowance(item.token)
                this.intervalID = setInterval(() => {
                    this.allowance(item.token)
                }, 3000)
                const erctoken = new ERC20(item.token, item.tokenName)
                this.balance = await erctoken.displayedBalanceOf(this.ethAddress)
            }
            
       },
       withdraw(item) {
        this.dialogWithdrawVisible = true
        this.withdrawItem = item 
       },
       depositComfirm() {
            const pgc = new PGC()
            const signer = pgc.signer
            let galadrielPubkey = localStorage.getItem('galadrielPubkey')
            let tokenAddress = this.depositItem.token
            let amount = this.depositItem.token === '0x0000000000000000000000000000000000000000'? 
            String(this.depositAmount * 100) :
            String(parseEther(String(this.depositAmount)) ) 
            depositdatagen(galadrielPubkey, tokenAddress, amount).then(res => {
                console.log(res)
                let params
                let depositData = res
                if (this.depositItem.token === '0x0000000000000000000000000000000000000000') {
                     params = {
                        to: cfg['pgc'].address,
                        value: parseEther(this.depositAmount),
                        data: depositData
                    }
                } else {
                     params = {
                        to: cfg['pgc'].address,
                        data: depositData
                    }
                }
                this.txResult = ''
                signer.sendTransaction(params).then(res1 => {
                    console.log(res1)
                    this.dialogDepositVisible = false
                    const interval = setInterval(async () => {
                    this.txResult = await getTransactionHashData(res1.hash)
                        if (this.txResult) {
                            clearInterval(interval)
                            this.$notify({
                                title: 'Transaction Success',
                                dangerouslyUseHTMLString: true,
                                message: ``,
                                type: 'success',
                                duration: 3 * 1000
                            });
                        }
                    }, 2000)
                    this.$notify({
                        title: 'Sending transaction in progress, please wait...',
                        dangerouslyUseHTMLString: true,
                        message: ``,
                        type: 'success',
                        duration: 3 * 1000
                    });
                })
            })
       },
       sendComfirm() {
            const pgc = new PGC()
            const signer = pgc.signer
            let privateKey = decrypt(localStorage.getItem('encKey'), localStorage.getItem('password'))
            let toGaladrielPubkey = this.receiverAddress
            let tokenAddress = this.sendItem.token
            let amount = String(this.amount * 100) 
            transferdatagen(toGaladrielPubkey, tokenAddress, amount, privateKey).then(res => {
                console.log(res)
                let params = {
                    to: cfg['pgc'].address,
                    data: res
                }
                this.txResult = ''
                signer.sendTransaction(params).then(res1 => {
                    console.log(res1)
                    this.dialogSendVisible = false
                    const interval = setInterval(async () => {
                    this.txResult = await getTransactionHashData(res1.hash)
                        if (this.txResult) {
                            clearInterval(interval)
                            this.$notify({
                                title: 'Transaction Success',
                                dangerouslyUseHTMLString: true,
                                message: ``,
                                type: 'success',
                                duration: 3 * 1000
                            });
                        }
                    }, 2000)
                    this.$notify({
                        title: 'Sending transaction in progress, please wait...',
                        dangerouslyUseHTMLString: true,
                        message: ``,
                        type: 'success',
                        duration: 3 * 1000
                    });
                })
            })
       },
       withdrawComfirm() {
        const pgc = new PGC()
        const signer = pgc.signer
        let privateKey = decrypt(localStorage.getItem('encKey'), localStorage.getItem('password'))
        let tokenAddress = this.withdrawItem.token
        let to = this.ethAddress
        burndatagen(tokenAddress, to, privateKey).then(res => {
                console.log(res)
                let params = {
                    to: cfg['pgc'].address,
                    data: res
                }
                this.txResult = ''
                signer.sendTransaction(params).then(res1 => {
                    console.log(res1)
                    this.dialogWithdrawVisible = false
                    const interval = setInterval(async () => {
                    this.txResult = await getTransactionHashData(res1.hash)
                        if (this.txResult) {
                            clearInterval(interval)
                            this.$notify({
                                title: 'Transaction Success',
                                dangerouslyUseHTMLString: true,
                                message: ``,
                                type: 'success',
                                duration: 3 * 1000
                            });
                        }
                    }, 2000)
                    this.$notify({
                        title: 'Sending transaction in progress, please wait...',
                        dangerouslyUseHTMLString: true,
                        message: ``,
                        type: 'success',
                        duration: 3 * 1000
                    });
                })
            })
       },
       async allowance(address) {
            const erc20 = new ERC20(address)
            let allowanceAmount = await erc20.allowance(this.ethAddress, cfg['pgc'].address)
            this.allowanceAmount = Number(allowanceAmount)
       },
       async approve(address) {
        const APPROVE_AMOUNT = ethers.constants.MaxUint256;
        const erc20 = new ERC20(address)
        this.txResult = ''
        try {
          let result
            result = await erc20.approve(cfg['pgc'].address, APPROVE_AMOUNT)
            const interval = setInterval(async () => {
                    this.txResult = await getTransactionHashData(result.hash)
                    if (this.txResult) {
                        clearInterval(interval)
                         this.$notify({
                            title: 'Approve Success',
                            dangerouslyUseHTMLString: true,
                            message: ``,
                            type: 'success',
                            duration: 3 * 1000
                        });
                    }
                }, 2000)
                this.$notify({
                    title: 'Sending transaction in progress, please wait...',
                    dangerouslyUseHTMLString: true,
                    message: ``,
                    type: 'success',
                    duration: 3 * 1000
                });
            } catch (error) {
                console.log(error)
            }
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
.wallet-container {
    min-height: 100vh;
    padding: 0 sn(30);
    padding-top: sn(100);
    .wallet-content {
        display: flex;
        position: relative;
        flex-direction: column;
        .wallet-left {
            // width: sn(339);
            // padding-left: sn(48);
            // position: fixed;
            min-height: 100%;
            display: flex;
            .left-item {
                font-size: sn(30);
                font-weight: 400;
                // line-height: sn(27);
                color: #B7A5FF;
                cursor: pointer;
                margin-bottom: sn(35);
                margin-right: sn(40);
                &:hover {
                    color: #FFFFFF;
                }
                &.active {
                    color: #FFFFFF;
                }
            }
        }
        .wallet-right {
            width: 100%;
            // padding-right: sn(147);
            // margin-left: sn(339);
            .title {
                display: flex;
                flex-direction: column;
                // align-items: flex-end;
                &.transactions {
                    margin-top: sn(85);
                }
                .name {
                    font-size: sn(24);
                    font-weight: 600;
                    color: #FFFFFF;
                }
                .add-msg {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: sn(15);
                }
                .address {
                    font-size: sn(16);
                    font-weight: 400;
                    line-height: sn(24);
                    color: #41FFD0;
                    // margin-left: sn(38);
                    display: flex;
                    flex-wrap: wrap;
                }
                img {
                    width: sn(20);
                    height: sn(20);
                    margin-left: sn(10);
                    cursor: pointer;
                }
                .copy {
                    margin-left: sn(17);
                }
                .load {
                    width: sn(162);
                    height: sn(42);
                    background: linear-gradient(145deg, #7358E4 0%, #6278CB 32%, #637DCB 55%, #70C2CB 81%, #41DBB6 100%);
                    border-radius: sn(22);
                    font-size: sn(14);
                    font-family: MiSans;
                    font-weight: 400;
                    line-height: sn(27);
                    color: #FFFFFF;
                    text-shadow: 0px 3px 6px rgba(0,0,0,0.16);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    // margin-left: sn(72);
                    cursor: pointer;
                    position: relative;
                    margin-top: sn(10);
                }
            }
            .token-list {
                margin-top: sn(25);
                // max-height: 52%;
                overflow: scroll;
                .token-item {
                    display: flex;
                    // align-items: center;
                    flex-direction: column;
                    height: sn(148);
                    border-top: 1px solid #3F345C;
                    padding-left: sn(10);
                    .token-name-content {
                        display: flex;
                        align-items: center;
                        height: sn(80);
                    }
                    .token-name {
                        font-size: sn(20);
                        font-weight: 600;
                        line-height: sn(27);
                        color: #FFFFFF;
                        width: 40%;
                        display: flex;
                        align-items: center;
                        img {
                            width: sn(24);
                            height: sn(24);
                            margin-right: sn(10);
                        }
                    }
                    .token-balance{
                        font-size: sn(20);
                        font-weight: 400;
                        line-height: sn(27);
                        color: #FFFFFF;
                        width: 40%;
                    }
                    .token-operation {
                        display: flex;
                        // flex-direction: column;
                        .send {
                            width: sn(106);
                            // height: sn(65);
                            padding: 6px 12px;
                            border: sn(1) solid #57B59C;
                            border-radius: sn(16);
                            font-size: sn(16);
                            font-weight: 400;
                            color: #6AB39C;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            cursor: pointer;
                            //   margin-top: sn(14);
                        }
                        .deposit {
                            width: sn(106);
                            // height: sn(65);
                            padding: 6px 12px;
                            background: linear-gradient(145deg, #7358E4 0%, #6278CB 30%, #637DCB 53%, #70C2CB 75%, #41DBB6 100%);
                            border-radius: sn(16);
                            font-size: sn(16);
                            font-weight: 400;
                            color: #fff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-left: sn(10);
                            cursor: pointer;
                            //  margin-top: sn(14);
                        }
                        .withdraw {
                            width: sn(106);
                            // height: sn(65);
                             padding: 6px 12px;
                            border: sn(1) solid #57B59C;
                            border-radius: sn(16);
                            font-size: sn(16);
                            font-weight: 400;
                            color: #6AB39C;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-left: sn(10);
                            cursor: pointer;
                            // margin-top: sn(14);
                        }
                        .more {
                            width: sn(181);
                            height: sn(65);
                            border: sn(1) solid #57B59C;
                            border-radius: sn(63);
                            font-size: sn(20);
                            font-family: MiSans;
                            font-weight: 400;
                            color: #6AB39C;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-left: sn(20);
                            cursor: pointer;
                        }
                    }
                }
            }
            .title-transactions {
                 margin-top: sn(55);
                .name {
                    font-size: sn(32);
                    font-weight: 600;
                    color: #FFFFFF;
                }
            }
            .txs-content {
                margin-top: sn(55);
                width: 100%;
                .txs-item {
                    display: flex;
                    // align-items: center;
                    flex-direction: column;
                    width: 100%;
                    // height: sn(127);
                    border-top: 1px solid #3F345C;
                    padding-left: sn(10);
                    color: #FFFFFF;
                    padding: 10px 0;
                    // justify-content: space-between;
                    .item-name {
                        
                    }
                    .txs-hash {
                        font-size: sn(16);
                        // font-weight: 600;
                        line-height: sn(27);
                        color: #FFFFFF;
                        // width: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        .hash-web {
                            display: none;
                        }
                    }
                    .txs-time {
                        font-size: sn(16);
                        // font-weight: 600;
                        line-height: sn(27);
                        color: #FFFFFF;
                        // width: 10%;
                        display: flex;
                        align-items: center;
                         justify-content: space-between;
                    }
                    .txs-balance{
                        font-size: sn(16);
                        font-weight: 400;
                        line-height: sn(27);
                        color: #FFFFFF;
                        // width: 5%;
                        display: flex;
                        align-items: center;
                         justify-content: space-between;
                    }
                    
                }
            }
            
        }
    }
    .wallet-modal {
        .qrcode {
           display: flex;
           justify-content: center;
           margin-top: 20px;
           margin-bottom: 20px;
        }
        .el-dialog {
            width: 90%;
            // height: sn(852);
            border: sn(1) solid #7CC2C7;
            background: linear-gradient(153deg, #211554 0%, #290E3D 41%, #021F1B 92%, #011F24 100%);
            border-radius: sn(12);
        }
        .el-dialog__title {
            font-size: sn(32);
            font-family: MiSans;
            font-weight: 600;
            line-height: 51px;
            color: #FFFFFF;
        }
        .content {
            .title {
                font-size: sn(20);
                font-family: MiSans;
                font-weight: 600;
                line-height: sn(27);
                color: #FFFFFF;
                width: 40%;
                display: flex;
                align-items: center;
                height: sn(127);
                width: 100%;
                border-top: 1px solid #3F345C;
                border-bottom: 1px solid #3F345C;
                padding-left: sn(20);
                img {
                    width: sn(24);
                    height: sn(24);
                    margin-right: sn(10);
                }
            }
            .trade {
                padding-left: sn(10);
                .amount-title {
                    font-size: sn(20);
                    font-family: MiSans;
                    font-weight: 500;
                    line-height: sn(27);
                    color: #DAAFFF;
                    margin-top: sn(40);
                    margin-bottom: sn(10);
                }
                .el-input__inner {
                    background: rgba(68,42,103,0.39);
                    border: none;
                    height: sn(80);
                    font-size: sn(20);
                    font-family: MiSans;
                    font-weight: 400;
                    line-height: sn(27);
                    color: #ECD6FF;
                }
                .balance {
                    font-size: sn(18);
                    font-family: MiSans;
                    font-weight: 500;
                    line-height: sn(27);
                    color: #fff;
                    margin-top: sn(16);
                }
            }
            .comfirm-content {
                width: 100%;
                display: flex;
                justify-content: end;
                margin-top: sn(57);
                .comfirm {
                    width: sn(180);
                    height: sn(52);
                    background: linear-gradient(145deg, #7358E4 0%, #6278CB 30%, #637DCB 53%, #70C2CB 75%, #41DBB6 100%);
                    border-radius: sn(63);
                    font-size: sn(20);
                    font-family: MiSans;
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
    }
}
}
@media (min-width: 959.95px){
.wallet-container {
    padding-top: fn(159);
    min-height: 100vh;
    .wallet-content {
        display: flex;
        position: relative;
        .wallet-left {
            width: fn(339);
            padding-left: fn(48);
            position: fixed;
            min-height: 100%;
            .left-item {
                font-size: fn(20);
                font-family: MiSans;
                font-weight: 400;
                line-height: fn(27);
                color: #B7A5FF;
                cursor: pointer;
                margin-bottom: fn(35);
                &:hover {
                    color: #FFFFFF;
                }
            }
        }
        .wallet-right {
            width: 100%;
            padding-right: fn(147);
            margin-left: fn(339);
            .title {
                display: flex;
                align-items: flex-end;
                &.transactions {
                    margin-top: fn(85);
                }
                .name {
                    font-size: fn(38);
                    font-family: MiSans;
                    font-weight: 600;
                    color: #FFFFFF;
                }
                .add-msg {
                    display: flex;
                }
                .address {
                    font-size: fn(18);
                    font-family: MiSans;
                    font-weight: 400;
                    line-height: fn(24);
                    color: #41FFD0;
                    margin-left: fn(38);
                }
                img {
                    width: fn(24);
                    height: fn(24);
                    margin-left: fn(10);
                    cursor: pointer;
                }
                .copy {
                    margin-left: fn(17);
                }
                .load {
                    width: fn(202);
                    height: fn(42);
                    background: linear-gradient(145deg, #7358E4 0%, #6278CB 32%, #637DCB 55%, #70C2CB 81%, #41DBB6 100%);
                    border-radius: fn(22);
                    font-size: fn(18);
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
                }
            }
            .token-list {
                margin-top: fn(55);
                // max-height: 52%;
                overflow: scroll;
                .token-item {
                    display: flex;
                    align-items: center;
                    height: fn(127);
                    border-top: 1px solid #3F345C;
                    padding-left: fn(10);
                     .token-name-content {
                        display: flex;
                        align-items: center;
                        height: sn(80);
                        width: 70%;
                    }
                    .token-name {
                        font-size: fn(20);
                        font-family: MiSans;
                        font-weight: 600;
                        line-height: fn(27);
                        color: #FFFFFF;
                        width: 40%;
                        display: flex;
                        align-items: center;
                        img {
                            width: fn(24);
                            height: fn(24);
                            margin-right: fn(10);
                        }
                    }
                    .token-balance{
                        font-size: fn(20);
                        font-family: MiSans;
                        font-weight: 400;
                        line-height: fn(27);
                        color: #FFFFFF;
                        width: 12%;
                    }
                    .token-operation {
                        display: flex;
                        .send {
                            width: fn(136);
                            height: fn(65);
                            border: fn(1) solid #57B59C;
                            border-radius: fn(63);
                            font-size: fn(20);
                            font-family: MiSans;
                            font-weight: 400;
                            color: #6AB39C;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            cursor: pointer;
                        }
                        .deposit {
                            width: fn(136);
                            height: fn(65);
                            background: linear-gradient(145deg, #7358E4 0%, #6278CB 30%, #637DCB 53%, #70C2CB 75%, #41DBB6 100%);
                            border-radius: fn(63);
                            font-size: fn(20);
                            font-family: MiSans;
                            font-weight: 400;
                            color: #fff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-left: fn(20);
                            cursor: pointer;
                        }
                        .withdraw {
                            width: fn(136);
                            height: fn(65);
                            border: fn(1) solid #57B59C;
                            border-radius: fn(63);
                            font-size: fn(20);
                            font-family: MiSans;
                            font-weight: 400;
                            color: #6AB39C;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-left: fn(20);
                            cursor: pointer;
                        }
                        .more {
                            width: fn(181);
                            height: fn(65);
                            border: fn(1) solid #57B59C;
                            border-radius: fn(63);
                            font-size: fn(20);
                            font-family: MiSans;
                            font-weight: 400;
                            color: #6AB39C;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-left: fn(20);
                            cursor: pointer;
                        }
                    }
                }
            }
            .title-transactions {
                 margin-top: fn(85);
                .name {
                    font-size: fn(38);
                    font-family: MiSans;
                    font-weight: 600;
                    color: #FFFFFF;
                }
            }
            .txs-content {
                margin-top: fn(55);
                width: 100%;
                .txs-item {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: fn(127);
                    border-top: 1px solid #3F345C;
                    padding-left: fn(10);
                    color: #FFFFFF;
                    justify-content: space-between;
                    .item-name {
                        display: none;
                    }
                    .txs-hash {
                        font-size: fn(20);
                        // font-weight: 600;
                        line-height: fn(27);
                        color: #FFFFFF;
                        width: 50%;
                        display: flex;
                        align-items: center;
                        .hash {
                            display: none;
                        }
                    }
                    .txs-time {
                        font-size: fn(20);
                        // font-weight: 600;
                        line-height: fn(27);
                        color: #FFFFFF;
                        width: 10%;
                        display: flex;
                        align-items: center;
                    }
                    .txs-balance{
                        font-size: fn(20);
                        font-family: MiSans;
                        font-weight: 400;
                        line-height: fn(27);
                        color: #FFFFFF;
                        width: 5%;
                    }
                    
                }
            }
            
        }
    }
    .wallet-modal {
        .qrcode {
           display: flex;
           justify-content: center;
           margin-top: 20px;
           margin-bottom: 20px;
        }
        .el-dialog {
            width: fn(786);
            // height: fn(852);
            border: fn(1) solid #7CC2C7;
            background: linear-gradient(153deg, #211554 0%, #290E3D 41%, #021F1B 92%, #011F24 100%);
            border-radius: fn(12);
        }
        .el-dialog__title {
            font-size: fn(38);
            font-family: MiSans;
            font-weight: 600;
            line-height: 51px;
            color: #FFFFFF;
        }
        .content {
            .title {
                font-size: fn(20);
                font-family: MiSans;
                font-weight: 600;
                line-height: fn(27);
                color: #FFFFFF;
                width: 40%;
                display: flex;
                align-items: center;
                height: fn(127);
                width: 100%;
                border-top: 1px solid #3F345C;
                border-bottom: 1px solid #3F345C;
                padding-left: fn(20);
                img {
                    width: fn(24);
                    height: fn(24);
                    margin-right: fn(10);
                }
            }
            .trade {
                padding-left: fn(10);
                .amount-title {
                    font-size: fn(20);
                    font-family: MiSans;
                    font-weight: 500;
                    line-height: fn(27);
                    color: #DAAFFF;
                    margin-top: fn(40);
                    margin-bottom: fn(10);
                }
                .el-input__inner {
                    background: rgba(68,42,103,0.39);
                    border: none;
                    height: fn(80);
                    font-size: fn(20);
                    font-family: MiSans;
                    font-weight: 400;
                    line-height: fn(27);
                    color: #ECD6FF;
                }
                .balance {
                    font-size: fn(18);
                    font-family: MiSans;
                    font-weight: 500;
                    line-height: fn(27);
                    color: #fff;
                    margin-top: fn(16);
                }
            }
            .comfirm-content {
                width: 100%;
                display: flex;
                justify-content: end;
                margin-top: fn(57);
                .comfirm {
                    width: fn(246);
                    height: fn(81);
                    background: linear-gradient(145deg, #7358E4 0%, #6278CB 30%, #637DCB 53%, #70C2CB 75%, #41DBB6 100%);
                    border-radius: fn(63);
                    font-size: fn(20);
                    font-family: MiSans;
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
    }
}
}
</style>
