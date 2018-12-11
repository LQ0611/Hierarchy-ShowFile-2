/**
 * 详情数据项组件-纯文本
 * 2018-9-4 李红媛
 */

import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';

class TextItem extends Component<Props> {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                    <View style={{height:1, backgroundColor: '#e8e8e8'}}/>
                    <View style={{flexDirection:'row',minHeight:48,paddingLeft:15,paddingRight:15}}>
                        <View style={{flex:0.25,flexDirection:'row',alignItems :'center'}}>
                            <Text style={{fontSize:15,color:'#333333',}}>{this.props.name}</Text>
                        </View>
                        <View style={{flex:0.75,marginLeft:20,justifyContent :'center'}}>
                            <Text style={{fontSize:15,color:'#999999',textAlign:'right'}}>{this.props.value}</Text>
                        </View>

                    </View>
            </View>
        );
    }
}

export default TextItem;