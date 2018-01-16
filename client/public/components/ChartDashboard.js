import React from 'react';
// import styles from '../css/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from 'material-ui/Toolbar';

import FlatButton from 'material-ui/FlatButton';

import TopicList from './TopicList';
import Chart from './Chart';
import TopicHeader from './TopicHeader';

import styles from '../css/app.css';

class ChartDashboard extends React.Component {
  constructor(props){
    super(props);

    this.handleOnClick = this.handleOnClick.bind(this);

    this.state = {
      timeInterval: 'day',
      minDate: null,
      maxDate: null
    }
  }

  componentWillReceiveProps(nextProps){

  }

  handleOnClick(e, value){
    console.log(e.currentTarget.value);

    const timeInterval = e.currentTarget.value;

    this.setState({
      timeInterval: timeInterval
    }, () => {
      console.log('Time Interval set to: ', this.state.timeInterval);
    })

  }

  render(){

    return (
      <div>
        <Toolbar>
          {
            this.props.topics.topic === undefined ?
              <div>Select a Topic!</div> :

            <ToolbarGroup>
              <ToolbarTitle text={this.props.topics.topic.name} />
              <FlatButton
                label='Minute'
                value='minute'
                onClick={this.handleOnClick}
              />
              <FlatButton
                label='Hour'
                value='hour'
                onClick={this.handleOnClick}/>
              <FlatButton
                label='Day'
                value='day'
                onClick={this.handleOnClick}/>
              <FlatButton
                label='Week'
                value='week'
                onClick={this.handleOnClick}/>
            </ToolbarGroup>
          }
        </Toolbar>
        <div className={styles.chartDashboard}>
          <div>
            <TopicList/>
          </div>
          <div className={styles.responsiveContainer}>
            <Chart
              timeInterval={this.state.timeInterval}
              minDate={this.state.minDate}
              maxDate={this.state.maxDate}
            />
          </div>
        </div>
      </div>)
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user,
    topics: state.topics
  }
}

const mapDispatchToProps = dispatch => {
  return {
    // userRegister: bindActionCreators(userRegister, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartDashboard);
