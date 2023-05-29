<!-- wallet -->
<template>
    <div class="audit-container">
        <div class="wallet-content">
            <div class="wallet-left">
                <div class="left-item">
                    <router-link :to="{ path: '/wallet' }">My Wallet</router-link>
                </div>
                <div class="left-item active">
                     <router-link :to="{ path: '/audit' }">Audit</router-link>
                </div>
            </div>
            <div class="wallet-right">
                <div class="title">
                    <div class="name">Audit</div>
                </div>
                <div class="enter-content">
                    <div class="enter">Enter transaction hash</div>
                    <div class="input-content">
                        <el-input v-model="hash" placeholder="" ></el-input>
                        <el-upload
                            class="upload-demo"
                            ref="upload"    
                            action=""
                            :limit="1"
                            :on-change="changeFile"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :file-list="fileList"
                            :auto-upload="false">
                            <div class="superkey" slot="trigger">
                            <img src="../../assets/key.png" alt="">
                            SuperKey 
                        </div>
                        </el-upload>
                        <div class="download" @click="download">Download the SuperKey</div>
                    </div>
                    <div class="save" @click="comfirm">Comfirm</div>
                    <div class="txs" v-if="show">Transaction Amout : {{amount}}</div>
                </div>
            </div>
       </div>
        
    </div>
</template>
<script>
import Qrcode from 'qrcodejs2'
import PGC from '@/contract/pgc.js'
import ERC20 from '@/contract/erc20.js'
import { BigNumber, Contract, ethers, Overrides } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import {depositdatagen, getAccountInfo, transferdatagen, burndatagen, openproofgen} from '@/api/index.js'
import cfg from '../../contract/abiConfig.js'
import {getTransactionHashData, decrypt} from '@/utils/index.js'
const pgc = new PGC()
const signer = pgc.signer
export default {
    components: {
    },
    mounted() {
            
    },
    data () {
        return {
            hash: '',
            show: false,
             fileList: [],
             data: '',
             amount: ''
        }
    },
    destroyed() {
    },
    
    methods: {
        download() {
            this.exportFile('2f9c81c998eb30ab904117fd6c7248946b09d94f22eeccf9e9d8bda4c20dea4d', 'SuperKey')
        },
        exportFile (data, name) {
            let blob = new Blob([data])
            let reader = new FileReader()
            reader.readAsDataURL(blob) // onload当读取操作成功完成时调用
            reader.onload = (e) => {
                let aElement = document.createElement('a')
                aElement.setAttribute('download', name)
                aElement.href = e.target.result // 赋予文件下载地址
                document.body.appendChild(aElement) // a标签插至页面中
                aElement.click()
                document.body.removeChild(aElement)
            }
        },
          handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        changeFile(file, fileList) {
            console.log(file)
             let fileReader= new FileReader()
             fileReader.onload = async (e) => {
                try {
                    let document = (e.target.result)
                    console.log(document)
                    this.data = document
                } catch (error) {
                    console.log(error)
                    this.$notify.error({
                        title: 'Error',
                        message: 'wrong file type'
                    });
                }
             }
             fileReader.readAsText(file.raw)
        },
       async comfirm() {
        // let privateKey = decrypt(localStorage.getItem('encKey'), localStorage.getItem('password'))
        if(this.data && this.hash) {
            try {
               const res = await openproofgen(this.hash, this.data)
                // console.log(res)
                this.show = true
                this.amount = res.amount / 100
            } catch (error) {
                console.log(error)
                this.$notify.error({
                    title: 'Error',
                    message: 'Incorrect input parameters'
                });
            }
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
.audit-container {
     min-height: 100vh;
    padding: 0 sn(30);
    padding-top: sn(100);
    .wallet-content {
        display: flex;
        position: relative;
        flex-direction: column;
         .wallet-left {
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
            .title {
                display: flex;
                flex-direction: column;
                // align-items: flex-end;
                 border-bottom: 1px solid #3F345C;
                 padding-bottom: sn(46);
                &.transactions {
                    margin-top: sn(85);
                }
                .name {
                    font-size: sn(38);
                    font-weight: 600;
                    color: #FFFFFF;
                   
                }
                .address {
                    font-size: sn(18);
                    font-weight: 400;
                    line-height: sn(24);
                    color: #41FFD0;
                    margin-left: sn(38);
                }
                img {
                    width: sn(24);
                    height: sn(24);
                    margin-left: sn(10);
                    cursor: pointer;
                }
                .copy {
                    margin-left: sn(17);
                }
            }
            .enter-content {
                .enter {
                    font-size: sn(20);
                    font-weight: 400;
                    line-height: sn(27);
                    color: #ECD6FF;
                    margin-top: sn(32);
                    margin-bottom: sn(20);
                }
                .input-content {
                    display: flex;
                    // align-items: center;
                    flex-direction: column;
                    width: 90%;
                }
                .el-input__inner {
                    background: rgba(68,42,103,0.39);
                    border: none;
                    height: sn(80);
                    font-size: sn(20);
                    font-weight: 400;
                    line-height: sn(27);
                    color: #ECD6FF;
                    width: 300px;
                    margin-bottom: 20px;
                }
                .superkey {
                    width: sn(240);
                    height: sn(56);
                    background: #3D2654;
                    border-radius: sn(63);
                    font-size: sn(20);
                    font-weight: 400;
                    color: #DAAFFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    img {
                        width: sn(22);
                        margin-right: sn(10);
                    }
                }
                .download {
                     font-size: sn(18);
                    font-weight: 400;
                    color: #DAAFFF;
                    // margin-left: fn(20);
                    width: 500px;
                    text-decoration: underline;
                    cursor: pointer;
                    margin-top: sn(20);
                }
                .save {
                        width: sn(180);
                        height: sn(52);
                        background: linear-gradient(145deg, #7358E4 0%, #6278CB 32%, #637DCB 55%, #70C2CB 81%, #41DBB6 100%);
                        border-radius: sn(63);
                        font-size: sn(20);
                        font-weight: 400;
                        line-height: sn(27);
                        color: #FFFFFF;
                        text-shadow: 0px 3px 6px rgba(0,0,0,0.16);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        position: relative;
                        margin-top: sn(55);
                }
                .txs {
                     margin-top: sn(55);
                    font-size: 20px;
                    font-weight: 500;
                    color: #5BFCFF;
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
@media (min-width: 959.95px){
.audit-container {
    padding-top: fn(159);
    height: 100vh;
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
                 border-bottom: 1px solid #3F345C;
                 padding-bottom: fn(46);
                &.transactions {
                    margin-top: fn(85);
                }
                .name {
                    font-size: fn(38);
                    font-family: MiSans;
                    font-weight: 600;
                    color: #FFFFFF;
                   
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
            }
            .enter-content {
                .enter {
                    font-size: fn(20);
                    font-family: MiSans;
                    font-weight: 400;
                    line-height: fn(27);
                    color: #ECD6FF;
                    margin-top: fn(32);
                    margin-bottom: fn(20);
                }
                .input-content {
                    display: flex;
                    align-items: center;
                    width: 1000px;
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
                    width: 400px;
                }
                .superkey {
                    width: fn(240);
                    height: fn(56);
                    background: #3D2654;
                    border-radius: fn(63);
                    font-size: fn(20);
                    font-weight: 400;
                    color: #DAAFFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    img {
                        width: fn(22);
                        margin-right: fn(10);
                    }
                }
                .download {
                     font-size: fn(20);
                    font-weight: 400;
                    color: #DAAFFF;
                    margin-left: fn(20);
                    width: 500px;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .save {
                        width: fn(246);
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
                        cursor: pointer;
                        position: relative;
                        margin-top: fn(55);
                }
                .txs {
                     margin-top: fn(55);
                    font-size: 28px;
                    font-family: MiSans-Medium, MiSans;
                    font-weight: 500;
                    color: #5BFCFF;
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
