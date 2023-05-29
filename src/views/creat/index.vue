<!-- creat -->
<template>
    <div class="index-container">
        <div class="creat-content">
           <div class="title">Setting up Galadriel wallet</div>
           <div class="creat-form">
                <div class="creat-item">
                    <div class="item-name">
                        <div class="name1">Name keystore file</div>
                        <div class="name2">Please name your keystore below.</div>
                    </div>
                    <div class="item-input">
                        <el-input v-model="name" placeholder="name" ></el-input>
                        <div class="error" v-show="!name">name is required</div>
                    </div>
                </div>
                <div class="creat-item ss">
                    <div class="item-name">
                        <div class="name1">Keystore password</div>
                        <div class="name2">Enter password</div>
                    </div>
                    <div class="item-input">
                        <el-input v-model="password" type="password" placeholder="password" ></el-input>
                        <div class="error" v-show="!password">password is required</div>
                    </div>
                </div>
                <div class="creat-item dd">
                    <div class="item-name">
                        <div class="name2">Re-enter password</div>
                    </div>
                    <div class="item-input">
                        <el-input v-model="repassword" type="password" placeholder="password" ></el-input>
                        <div class="error" v-show="!repassword || password !== repassword">{{repasswordName ? repasswordName : 'please enter password again'}}</div>
                    </div>
                </div>
           </div>
           <div class="save" @click="save">Save</div>
        </div>
    </div>
</template>
<script>
import { creatGen } from '@/api/index'

export default {
    components: {
    },
    mounted() {
       
    },
    data () {
        return {
            name: '',
            password: '',
            repassword: '',
            repasswordName: ''
        }
    },
    methods: {
        save() {
            if (!this.repassword) {
                this.repasswordName = 'please enter password again'
                return
            }
            if (this.password !== this.repassword) {
                this.repasswordName = 'Passwords do not match'
                return
            }
            if (!this.name || !this.repassword || !this.repassword) {
                return
            }
            creatGen(this.password).then(res => {
                console.log(res)
                localStorage.setItem('name', this.name)
                localStorage.setItem('encKey', res.encKey)
                localStorage.setItem('galadrielPubkey', res.galadrielPubkey)
                localStorage.setItem('password', this.password)
                let data = {
                    name: this.name,
                    galadrielPubkey: res.galadrielPubkey,
                    encKey: res.encKey,
                }
                this.$router.push('wallet')
                this.exportFile(JSON.stringify(data), this.name)
            })
            // this.exportFile('123', 'ss')

        },
        // 导出文件
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
.index-container {
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
.index-container {
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
