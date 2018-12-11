/**
 * 详情页面
 * 2018-11-17 李红媛
 */

import React, { Component } from 'react';
import {
    Platform, StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
    ScrollView, Alert
} from 'react-native';

import Item from './component/TextItem';
import File from './component/FileItem';
import Title from '../common/component/TitleDetailLeft';
import Server from "../core/Server";
import LoadingView from '../common/component/LoadingView';

class DetailScreen extends Component<Props> {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data:{},
            loading : true,
        };
        this.item = this.props.navigation.state.params.data;
    }

    async componentDidMount() {
        //获取详情数据
        try {
            let ID = this.item.ML_ID;
            let result = await Server.getDetailDatas({ID});
            debugger;
            if(result.ok === '0'){
                this.setState({
                    data:result.DATA,
                });
            }
            this.setState({loading : false});
        }catch (e){
            console.log(e);
            Alert.alert('请求数据出错！');
            this.setState({loading : false});
        }
    }


    //ID	ZL_ID
    //标题	ZL_NAME
    //关键字	ZL_KEYWORD
    //内容摘要	ZL_ABSTRACT
    //编码	ZL_CODE
    //编制单位	ZL_BIAN_ZHI_DAN_WEI_ID__NAME
    //上传日期	ZL_RELEASE_DATE
   // FILES: {ID:’123444’,NAME:’用章申请’ ,TYPE:’word’//文件类型}//附件



    render() {
        let time = this.state.data.S_ATIME;
        if(time) {
            time = time.substring(0,19);
        }
        return (
            <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <Title param={this.props} title={'资料详情'} />
                {/*内容*/}
                <ScrollView style={{flex:1}}>
                    <Item name={'标题'} value={this.state.data.ZL_NAME}/>
                    <Item name={'关键字'} value={this.state.data.ZL_KEYWORD}/>
                    <View style={{height:1, backgroundColor: '#e8e8e8'}}/>
                    <View style={{flexDirection:'row',minHeight:48,padding:15}}>
                        <View style={{flex:0.25,flexDirection:'row',}}>
                            <Text style={{fontSize:15,color:'#333333'}}>内容摘要</Text>
                        </View>
                        <Text style={{flex:0.75,marginLeft:20,fontSize:15,color:'#999999'}}>{this.state.data.ZL_ABSTRACT}</Text>
                    </View>
                    <View style={{height:1, backgroundColor: '#e8e8e8'}}/>
                    <View style={{marginTop:11}}/>
                    <Item name={'编码'} value={this.state.data.ZL_CODE}/>
                    <Item name={'编制单位'} value={this.state.data.ZL_BIAN_ZHI_DAN_WEI_ID__NAME}/>
                    <Item name={'上传日期'} value={this.state.data.ZL_RELEASE_DATE}/>
                    <File name={'附件'} value={this.state.data.FILES} param={this.props}/>
                </ScrollView>
                {
                    this.state.loading && <LoadingView/>
                }
            </View>
        );
    }
}

export default DetailScreen;