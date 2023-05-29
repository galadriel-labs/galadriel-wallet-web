<!-- creat -->
<template>
    <div class="creat-container">
        <div class="creat-content">
           <div class="title">Welcome back</div>
           <div class="msg"  v-if="!encKey">Please enter your password for temp or select a different keystore</div>
           <div class="creat-form">
                <div class="creat-item" v-if="!encKey">
                    <div class="item-name">
                        <div class="name1">Keystore name</div>
                    </div>
                    <div class="item-input">
                        <!-- <el-input v-model="name" placeholder="" ></el-input> -->
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
                            <div class="bttn" slot="trigger" size="small" type="primary">Select File</div>
                        </el-upload>
                    </div>
                </div>
                <div class="creat-item ss">
                    <div class="item-name">
                        <div class="name1">Password</div>
                        <div class="name2">Enter password</div>
                    </div>
                    <div class="item-input">
                        <el-input v-model="password" placeholder="" type="password"></el-input>
                        <div class="error" v-show="isshow">wrong password</div>
                    </div>
                </div>
           </div>
           <div class="save" @click="save">Log In</div>
        </div>
    </div>
</template>
<script>
import { creatGen } from '@/api/index'
import {getTransactionHashData, decrypt} from '@/utils/index.js'
export default {
    components: {
    },
    mounted() {
       
    },
    data () {
        return {
            name: '',
            password: '',
            fileList: [],
            data: '',
            isshow: false,
            encKey: localStorage.getItem('encKey')
        }
    },
    methods: {
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
                    let document = JSON.parse(e.target.result)
                    console.log(document)
                    this.data = document
                } catch (error) {
                    this.$notify.error({
                        title: 'Error',
                        message: 'wrong file type'
                    });
                }
             }
             fileReader.readAsText(file.raw)
        },
        save() {
            console.log(this.fileList)
            if (this.encKey) {
                try {
                    let result = decrypt(this.encKey, this.password)
                    console.log(result)
                    localStorage.setItem('password', this.password)
                    this.$router.push('wallet')
                } catch (error) {
                    console.log(error)
                    this.isshow = true
                } 
            } else {
                console.log(123123)
                try {
                    let result = decrypt(this.data.encKey, this.password)
                    console.log(result)
                    localStorage.setItem('password', this.password)
                    localStorage.setItem('encKey', this.data.encKey)
                    localStorage.setItem('galadrielPubkey', this.data.galadrielPubkey)
                    this.$router.push('wallet')
                } catch (error) {
                    console.log(error)
                    this.isshow = true
                }
            }
            
            
            
            // creatGen(this.password).then(res => {
            //     console.log(res)
            // })
           
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
.creat-container {
    height: 100vh;
    .creat-content {
        padding-top: sn(100);
        padding-left: sn(30);
        padding-right: sn(30);
        .title {
            font-size: sn(32);
            font-weight: 600;
            color: #FFFFFF;
        }
        .msg {
            font-size: sn(20);
            font-weight: 400;
            color: #ECD6FF;
            margin-top: sn(22);
        }
       .creat-form {
        margin-top: sn(30);
            .creat-item {
                display: flex;
                &.ss {
                    margin-top: sn(52);
                }
                &.dd {
                    margin-top: sn(20);
                }
                .item-name {
                    width: sn(180);
                    .name1 {
                        font-size: sn(18);
                        font-weight: 500;
                        // line-height: sn(39);
                        color: #DAAFFF;
                    }
                    .name2 {
                        font-size: sn(14);
                        font-weight: 400;
                        // line-height: sn(27);
                        color: #ECD6FF;
                        margin-top: sn(8);
                    }
                    
                }
                .item-input {
                    width: sn(240);
                    position: relative;
                    .el-input__inner {
                        background: rgba(68,42,103,0.39);
                        border: none;
                        height: sn(52);
                        font-size: sn(18);
                        font-weight: 400;
                        line-height: sn(27);
                        color: #ECD6FF;
                    }
                    .error {
                        color: #f56c6c;
                        font-size: 12px;
                        line-height: 1;
                        padding-top: 4px;
                        position: absolute;
                        top: 100%;
                        left: 0;
                    }
                }
            }
       }
       .save {
            width: sn(180);
            height: sn(50);
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
            margin-top: sn(65);
       }
       .bttn {
            background: linear-gradient(145deg, #7358E4 0%, #6278CB 32%, #637DCB 55%, #70C2CB 81%, #41DBB6 100%);
            border-radius: sn(63);
            font-size: sn(16);
            font-weight: 400;
            // line-height: sn(27);
            color: #FFFFFF;
            text-shadow: 0px 3px 6px rgba(0,0,0,0.16);
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            position: relative;
            padding: 10px 20px;
            // margin-left: sn(20);
       }
    }
}
}

@media (min-width: 959.95px){
.creat-container {
    height: 100vh;
    .creat-content {
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
            font-size: fn(20);
            font-family: MiSans;
            font-weight: 400;
            line-height: fn(27);
            color: #ECD6FF;
            margin-top: fn(44);
        }
       .creat-form {
        margin-top: fn(37);
            .creat-item {
                display: flex;
                &.ss {
                    margin-top: fn(102);
                }
                &.dd {
                    margin-top: fn(20);
                }
                .item-name {
                    width: fn(380);
                    .name1 {
                        font-size: fn(30);
                        font-family: MiSans;
                        font-weight: 500;
                        line-height: fn(39);
                        color: #DAAFFF;
                    }
                    .name2 {
                        font-size: fn(20);
                        font-family: MiSans;
                        font-weight: 400;
                        line-height: fn(27);
                        color: #ECD6FF;
                        margin-top: fn(8);
                    }
                    
                }
                .item-input {
                    width: fn(489);
                    position: relative;
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
                    .error {
                        color: #f56c6c;
                        font-size: 12px;
                        line-height: 1;
                        padding-top: 4px;
                        position: absolute;
                        top: 100%;
                        left: 0;
                    }
                }
            }
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
       .bttn {
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
            padding: 10px 20px;
       }
    }
}
}
</style>
