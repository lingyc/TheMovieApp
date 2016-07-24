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
    return (
      <div onClick={()=>console.log(that.props)}>
        <h2 className='nh'>Inbox</h2>
        List of people who've sent you requests:<br/>
        {this.props.pplWhoWantToBeFriends.map(friend =>
          <InboxEntry
            accept={that.props.accept}
            decline={that.props.decline}
            inboxName={friend[0]}
            requestType={friend[1]}
            requestMovie={friend[2]}
          />
        )}
        Request Responses:
        {this.props.responsesAnswered.map((unit) =>
          <Responses
            responsesInfo={unit.requestee} 
            responseAnswer={unit.response} 
            responseType={unit.requestTyp} 
            self={unit.requestor}
            remove={that.props.remove}
          />
        )}
      </div>
    );
  }
}

window.Inbox = Inbox;
