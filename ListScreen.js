/**
 * 列表页面
 * 2018-9-4 李红媛
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    FlatList,Platform,ScrollView,
} from 'react-native';

import {screen,Cstyles} from "../common/index";
import Title from '../common/component/TitleList';
import Server from '../core/Server';
import LoadingView from '../common/component/LoadingView';
class ListScreen extends Component<Props> {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            loading : true,
            page:1,
            noMore:false,
            path:[{name:'知识库',type:'',id:'',repository:'1',index:0}],
        };
        this.type = ''; //知识库	（列表展示）	'ML'//目录（点击相关目录）
        this.id = ''; //当前需要查看的目录ID
        this.repository = '1'; //1（获取知识库），0（其他）
    }

    gotoSearch() {
        this.props.navigation.navigate('SearchScreen');
    }

    async componentDidMount() {
        this.setState({loading : true});
        this.getWorkList();
        this.setState({loading : false});
    }

    // 下拉刷新
    _renderRefresh = () => {
        this.setState({refreshing: true})//开始刷新
        //这里请求网络，拿到数据
        this.getWorkList();
        this.setState({refreshing: false});
    };

    //获取数据
    async getWorkList() {
        try {
            let id = this.id;
            let type = this.type;
            let repository = this.repository;
            let pageNum = 1;   //this.state.page
            let pageCount = 100;
            let result = await Server.getListDatas({repository,type,pageNum,pageCount,id});
            if(result.ok === '0'){
                this.setState({
                    data:result.DATA,
                    noMore:result.DATA.length < 100,
                });
            }else {
                Alert.alert(result._MSG_);
            }
        }catch (e){
            debugger;
            console.log(e);
            Alert.alert('请求数据出错！');
        }
    }

    itemClick(item) {
        this.id = item.ML_ID;
        this.type = item.TYPE;
        this.repository = '0';
        let index = parseInt(item.TIER);
        if(isNaN(index)) {
           Alert.alert("NAN value:"+item.TIER);
        }
        let newPath = {
            name:item.ML_NAME,type:item.TYPE,id:item.ML_ID,repository:'0',index:index
        };
        let tempPath = this.state.path;
        tempPath.push(newPath);
        this.setState({path:tempPath});

        this._renderRefresh();
    }
    //路径点击事件处理
    getPathData(item) {
        debugger;
        let tempPath = this.state.path;
        var num = tempPath.length - item.index;
        tempPath.splice(item.index+1,num);
        this.setState({
            path:tempPath,
        });

        this.id = item.id;
        this.type = item.type;
        this.repository = item.repository;
        this._renderRefresh();
    }

    detailClick(item) {
        this.props.navigation.navigate('DetailScreen',{data:item});
    }
    docClick(data){
        //跳转文件打开页面 /APP_PORT.AppPortServ.do    APP_PORT.downloadFile.do
        if(Platform.OS === 'ios'){
            let url =Server.root +'/file/'+data.ML_ID +  '?act=open';
            debugger;
            this.props.navigation.navigate('WebViewCont',{data:url,
                title:data.ML_NAME});
        }else{
            //Android
            let url =Server.root+'/APP_PORT.downloadFile.do?FILE_ID='+data.ML_ID;
            debugger;
            fetch(url).then((res) => {
                console.log(res);
                if(res.url.endsWith('?act=open') === true){
                    this.props.navigation.navigate('WebViewCont',{data:res.url.replace('?act=open', ''),
                        title:data.ML_NAME});
                } else{
                    this.props.navigation.navigate('WebViewCont',{data:res.url, title:data.ML_NAME});
                }
            });
        }
    }
    async onEndReached() {
        if(this.state.noMore)return;
        this.state.page++;
        try {
            let id = this.state.id;
            let type = this.state.type;
            let repository = this.state.repository;
            let pageNum = 1;   //this.state.page
            let pageCount = 100;
            let result = await Server.getListDatas({repository,type,pageNum,pageCount,id});
            if(result.ok === '0'){
                let datas = this.state.data;
                this.setState({
                    data:datas.concat(result.DATA),
                    noMore:result.DATA.length < 100,
                });
            }
        } catch (e) {
            this.state.page--;
            this.setState({noMore: true});
            Alert.alert('请求数据出错！');
        }
        this.setState({refreshing: false});
    }


    //ID		ML_ID
    //文件名称	ML_NAME
    //文件类型（文件夹、文件）	LEIXING	(0:目录，1:文档。)
    //TYPE	(ZSK:知识库，ML：目录，WD:文档。)
    //上传时间	S_MTIME
    //目录层级	ML_NAME_PATH

    renderListItem = ({item, index}) => {
        if(item.LEIXING === '0') {
            return (
                <TouchableOpacity onPress={() => {this.itemClick(item)}} key={index}>
                    <View style={Cstyles.TabListItem}>
                        <Image  source = {require('../images/file.png')}/>
                        <View style={{flex: 1, marginLeft: 20}}>
                            <View style={{flex: 1,flexDirection:'row',alignItems:'center',marginTop:8}}>
                                <Text numberOfLines={1} style={{color: '#333333', fontSize: 15,minHeight:16}}>{item.ML_NAME}</Text>
                            </View>
                            <View style={{flex: 1,marginTop:8,flexDirection:'row'}}>
                                <Text style={{flex: 0.6,color: '#666666', fontSize: 13,}}>{item.S_MTIME}</Text>
                            </View>
                        </View>
                        <Image  source = {require('../images/rightR.png')}/>
                    </View>
                </TouchableOpacity>
            );
        }else {
            let image ;
            if(item.DOCTYPE === 'doc' || item.TYPE === 'docx') {
                image = require('../images/icon_word.png');
            } else if(item.DOCTYPE === 'pdf') {
                image = require('../images/icon_pdf.png');
            }else if(item.DOCTYPE === 'xls') {
                image = require('../images/icon_excel.png');
            }else if(item.DOCTYPE === 'jpg' || item.TYPE === 'png') {
                image = require('../images/icon_jpg.png');
            }else if(item.DOCTYPE === 'txt') {
                image = require('../images/icon_txt.png');
            }
            return (
                    <View style={Cstyles.TabListItem}  key={index}>
                        <TouchableOpacity onPress={() => {this.docClick(item)}} style={{flex: 1,flexDirection:'row',alignItems : 'center',}}>
                            <Image  source = {image}/>
                            <View style={{flex: 1, marginLeft: 20,justifyContent : 'center',height:70,}}>
                                <View style={{flex: 1,flexDirection:'row',alignItems:'center',marginTop:8}}>
                                    <Text numberOfLines={1} style={{color: '#333333', fontSize: 15,minHeight:16}}>{item.ML_NAME}</Text>
                                </View>
                                <View style={{flex: 1,marginTop:8,flexDirection:'row'}}>
                                    <Text style={{flex: 0.6,color: '#666666', fontSize: 13,}}>{item.S_MTIME}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.detailClick(item)}} key={index}>
                            <Image  source = {require('../images/detail.png')}/>
                        </TouchableOpacity>
                    </View>

            );
        }
    }
    _scroll;
    render() {
        return (
            <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
                <Title param={this.props} title={'资料管理'} gotoSearch={this.gotoSearch.bind(this)}/>
                <View style={{height:40,justifyContent:'center'}}>
                    <ScrollView
                        ref={(scroll)=>this._scroll = scroll}
                        onContentSizeChange={() => { this._scroll.scrollToEnd({animated: true}); }}
                        horizontal={true} showsHorizontalScrollIndicator={true}
                        style={{flexDirection: 'row',paddingTop:10,paddingLeft:20,backgroundColor: '#F5F7F6'}}>
                        {this.state.path.map((item) => {
                            return (
                                this.state.path.length === item.index+1 ?
                                    <Text style={{color: '#999999', fontSize: 15}}>{item.name}</Text>
                                :
                                    <View style={{marginRight:10,flexDirection: 'row',}} key={item.id}>
                                        <TouchableOpacity
                                            underlayColor="rgba(34, 26, 38, 0.1)"
                                            onPress={ this.getPathData.bind(this,item)}>
                                            <Text style={{textDecorationLine:'underline',color: '#1A7DE3', fontSize: 15}}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                            <Text style={{marginLeft:1,fontSize: 15}}>  -></Text>
                                    </View>
                            )
                        })}
                    </ScrollView >
                </View>

                <View style={{height:1, backgroundColor: '#e8e8e8'}}/>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderListItem}
                    refreshing={this.state.refreshing}
                    onRefresh={this._renderRefresh}
                    style={{marginBottom:40}}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={20}
                />
                {
                    this.state.loading &&
                    <LoadingView/>
                }
            </View>
        );
    }
}

export default ListScreen;