/**
 * 附件
 * 2018-9-5 李红媛
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
} from 'react-native';

import Server from '../../core/Server';
import screen from "../../common/screen";
class FileItem extends Component<Props> {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    itemClick(data) {
        //跳转文件打开页面 /APP_PORT.AppPortServ.do    APP_PORT.downloadFile.do
        if(Platform.OS === 'ios'){
            let url =Server.root +'/file/'+data.ID +  '?act=open';
            debugger;
            this.props.param.navigation.navigate('WebViewCont',{data:url,
                title:data.NAME});
        }else{
            //Android
            let url =Server.root+'/APP_PORT.downloadFile.do?FILE_ID='+data.ID;
            debugger;
            fetch(url).then((res) => {
                console.log(res);
                if(res.url.endsWith('?act=open') === true){
                    this.props.param.navigation.navigate('WebViewCont',{data:res.url.replace('?act=open', ''),
                        title:data.NAME});
                } else{
                    this.props.param.navigation.navigate('WebViewCont',{data:res.url, title:data.NAME});
                }
            });
        }
       /* this.props.param.navigation.navigate('WebViewCont',{data:"",
            title:data.NAME});*/
    }

    renderListItem = ({item, index}) => {
        let name = '';
        if(index === 0) {
            name = this.props.name;
        }
        //doc，pdf，xls，docx，jpg，png，zip
        let image ;
        if(item.TYPE === 'doc' || item.TYPE === 'docx') {
            image = require('../../images/icon_word.png');
        } else if(item.TYPE === 'pdf') {
            image = require('../../images/icon_pdf.png');
        }else if(item.TYPE === 'xls') {
            image = require('../../images/icon_excel.png');
        }else if(item.TYPE === 'jpg' || item.TYPE === 'png') {
            image = require('../../images/icon_jpg.png');
        }else if(item.TYPE === 'txt') {
            image = require('../../images/icon_txt.png');
        }
        return(
            <TouchableOpacity onPress={() => {this.itemClick(item)}} key={index}>
                <View style={{height:1, backgroundColor: '#e8e8e8'}}/>
                <View style={{flexDirection:'row',minHeight:48,paddingLeft:15,paddingRight:15}}>
                    <View style={{flex:0.25,flexDirection:'row',alignItems :'center'}}>
                        <Text style={{fontSize:15,color:'#333333',}}>{name}</Text>
                    </View>
                    <View style={{flex:0.75,marginLeft:20,justifyContent :'flex-end',alignItems:'center',flexDirection:'row'}}>
                        <Image style = {{height:16,width:15}} source = {image}/>
                        <Text numberOfLines={1} style={{fontSize:15,color:screen.comColor,textAlign:'right',marginLeft:8}}>{item.NAME}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
    render() {
        return (
            <View>
                <FlatList
                    data={this.props.value}
                    renderItem={this.renderListItem}
                />
            </View>
        );
    }
}

export default FileItem;