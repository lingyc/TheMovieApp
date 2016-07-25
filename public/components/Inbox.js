// var Inbox = (props) => (
 
//   <div>
//  <h2 className='nh'>Inbox</h2>

//  List of people who've sent you requests:<br/>


// {props.pplWhoWantToBeFriends.map(function(friend){ return (<InboxEntry accept={props.accept} decline={props.decline} 
//   inboxName={friend[0]} requestType={friend[1]} requestMovie={friend[2]} /> )})}

// Request Responses:
// {props.responsesAnswered.map(function(unit){ return <Responses 
//   responsesInfo={unit.requestee} 
//   responseAnswer={unit.response} 
//   responseType={unit.requestTyp} 
//   self={unit.requestor}
//   remove={props.remove}
// />})}

// </div>


// );

class Inbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      requests: null
    };
  }

  render() {




    let that = this;
    var empty = this.props.pplWhoWantToBeFriends.length === 0 ? "No pending requests" : "";
    var empty2 = this.props.responsesAnswered.length === 0 ? "No request responses" : "";

    return (
      <div className='notification collection'>
        <div className='header'>Inbox</div>

        <div className="notificationLable">your pending requests</div>
        <div className="updateMsg">{empty}</div>
        {this.props.pplWhoWantToBeFriends.map(friend =>
          <InboxEntry
            accept={that.props.accept}
            decline={that.props.decline}
            inboxName={friend[0]}
            requestType={friend[1]}
            requestMovie={friend[2]}
            messageInfo={friend[3]}
          />
        )}

        <div className="notificationLable">request responses</div>
        <div className="updateMsg">{empty2}</div>
        {this.props.responsesAnswered.map((unit) =>
          <Responses
            responsesInfo={unit.requestee} 
            responseAnswer={unit.response} 
            responseType={unit.requestTyp} 
            movie={unit.movie}
            self={unit.requestor}
            remove={that.props.remove}
          />
        )}
      </div>
    );
  }
}

window.Inbox = Inbox;
