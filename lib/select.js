import React, {Component} 	from "react"
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Modal,
    Dimensions
} from "react-native"

import OptionList from "./optionlist"
import Indicator from "./indicator"

const window = Dimensions.get('window')


export default class Select extends Component {
    static defaultProps = {
        defaultText : "Click To Select",
        multipleValuesText: "Multiple values selected",
        onSelect  : () => {},
        onDeselect: () => {},
        onClose: () => {},
        transparent : false,
        animationType : "none",
        indicator : "none",
        indicatorColor: "black",
        indicatorSize: 10,
        multiple: false,
        initialSelectedValues: [],
        forceUpdate: false,
        maxDefaultTextLength: null,
    };

    static propTypes = {
        style : View.propTypes.style,
        defaultText : React.PropTypes.string,
        multipleValuesText: React.PropTypes.string,
        onSelect : React.PropTypes.func,
        onDeselect : React.PropTypes.func,
        onClose: React.PropTypes.func,
        textStyle : Text.propTypes.style,
        backdropStyle : View.propTypes.style,
        optionListStyle : View.propTypes.style,
        selectedStyle: View.propTypes.style,
        indicator : React.PropTypes.string,
        indicatorColor : React.PropTypes.string,
        indicatorSize : React.PropTypes.number,
        indicatorStyle : View.propTypes.style,
        multiple: React.PropTypes.bool,
        initialSelectedValues: React.PropTypes.array,
        forceUpdate: React.PropTypes.bool,
        maxDefaultTextLength: React.PropTypes.number
    };

    constructor(props) {
        super(props);
        this.selected = this.props.selected;
        this.state = {
            modalVisible : false,
            defaultText : this.props.defaultText,
            selected : this.props.selected,
            multipleSelected: new Set(this.props.initialSelectedValues)
        }
    }

    componentWillReceiveProps (nextProps) {
        if ( (!this.props.multiple && (nextProps.selected == null || nextProps.forceUpdate)) || (this.props.multiple && !this.state.multipleSelected.size)){
            this.setState({
                defaultText: nextProps.defaultText
            })
        }
    }

    onSelect(label, value) {
        if ( this.props.multiple ){
            let newState = {
                multipleSelected: this.state.multipleSelected
            }
            const isOptionSelected = this.state.multipleSelected.has(value);
            if ( isOptionSelected ){
                this.props.onDeselect(value, label)
                this.state.multipleSelected.delete(value);
            } else {
                this.props.onSelect(value, label)
                this.state.multipleSelected.add(value);
            }
            if ( this.state.multipleSelected.size > 1 ){
                newState.defaultText = this.props.multipleValuesText;
            } else {
                newState.defaultText = label;
            }
            this.setState(newState);
        } else {
            this.props.onSelect(value, label)
            this.setState({
                modalVisible : false,
                defaultText : label
            })
        }
    }

    onClose() {
        this.setState({
            modalVisible: false
        }, this.props.onClose)
    }

    render() {
        let {style, textStyle, backdropStyle,
            optionListStyle, transparent, animationType,
            indicator, indicatorColor, indicatorSize, indicatorStyle,
            selectedStyle, selected} = this.props;

        return (
			<View>
				<TouchableWithoutFeedback onPress = {this.onPress.bind(this)}>
					<View style = {[styles.selectBox, style]}>
						<View style={styles.selectBoxContent}>
							<Text style = {textStyle}>{
							    this.props.maxDefaultTextLength !== null && this.props.maxDefaultTextLength < (this.state.defaultText || "").length?
                                    `${(this.state.defaultText || "").slice(0, this.props.maxDefaultTextLength)}...`:
							        this.state.defaultText
							}</Text>
							<Indicator direction={indicator} color={indicatorColor} size={indicatorSize} style={indicatorStyle} />
						</View>
					</View>
				</TouchableWithoutFeedback>

				<Modal
					transparent={transparent}
					animationType={animationType}
					visible={this.state.modalVisible}
					onRequestClose={this.onClose.bind(this)}
				>
					<TouchableWithoutFeedback onPress ={this.onModalPress.bind(this)}>
						<View style={[styles.modalOverlay, backdropStyle]}>
							<OptionList
								onSelect = {this.onSelect.bind(this)}
								selectedStyle = {selectedStyle}
								selected = {selected}
								multipleSelected = {this.state.multipleSelected}
								style = {[optionListStyle]}>
                                {this.props.children}
							</OptionList>
						</View>
					</TouchableWithoutFeedback>

				</Modal>
			</View>
        )
    }
    /*
        Fired when user clicks the button
     */
    onPress() {
        this.setState({
            modalVisible : !this.state.modalVisible
        })
    }

    /*
     Fires when user clicks on modal. primarily used to close
     the select box
     */

    onModalPress() {
        this.setState({
            modalVisible : false
        }, this.props.onClose)
    }

    setSelectedText(text){
        this.setState({
            defaultText: text
        })
    }
}

var styles = StyleSheet.create({
    selectBox : {
        borderWidth : 1,
        width  : 200,
        padding : 10,
        borderColor : "black"
    },
    selectBoxContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalOverlay : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center",
        width: window.width,
        height: window.height
    }
})
