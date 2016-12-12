import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import * as userActions from '../actions/UserActions'
import * as logActions from '../actions/LogActions'
import * as connActions from '../actions/ConnActions'
import * as historyActions from '../actions/historyActions'

import CallComponent from '../components/Call/CallComponent'

import { stopStream } from '../util'

class CallPage extends Component {

	constructor(props) {
		super(props);

		this.logMsg = this.props.logActions.addLog;
	}

	sendData = (data) => {
		let dconn = this.props.conn.peerConn.connect(this.props.conn.recipientName);
		dconn.on('open', () => {
			dconn.send(data);
			// this.props.historyActions.addConversationToHistory({
			// 	with: conn.peer,
			// 	type: data.type,
			// 	from: conn.peer,
			// 	text: data.text,
			// 	datetime: new Date()
			// });
		});
	}

	endCall = () => {
		this.logMsg('End call');
		browserHistory.goBack();
		stopStream(this.props.conn.localStream);
		this.sendData(
			{
				type: 'call',
				text: 'end-call'
			}
		);
	}

	render() {

		return (
			<CallComponent 
				conn={this.props.conn}
				endCall={this.endCall}
				/>
		);
	}
}

function mapStateToProps(state) {
	return {
		user: state.user,
		conn: state.conn
	}
}

function mapDispatchProps(dispatch) {
	return {
		userActions: bindActionCreators(userActions, dispatch),
		logActions: bindActionCreators(logActions, dispatch),
		connActions: bindActionCreators(connActions, dispatch),
		historyActions: bindActionCreators(historyActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchProps)(CallPage)