class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      currentList: null
    };
  }

  render() {
    return (
      <div>
        <Nav />
        <div className="col-md-7">
          <GroceryList 
          />
        </div>
        <div className="col-md-5">
          HI
        </div>
      </div>
    );
  }
}

window.App = App;
