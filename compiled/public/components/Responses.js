"use strict";

var Responses = function Responses(props) {
  console.log('props.movie', props.movie);
  if (props.movie !== null) {
    return React.createElement(
      "div",
      { className: "Reponses collection-item row" },
      React.createElement(
        "div",
        { className: "col s3" },
        React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
      ),
      React.createElement(
        "div",
        { className: "response col s9" },
        React.createElement(
          "div",
          { className: "responseMsg" },
          props.responsesInfo,
          " said ",
          props.responseAnswer,
          " to your ",
          props.responseType,
          " request to watch ",
          props.movie,
          "!",
          React.createElement(
            "a",
            { className: "waves-effect waves-light btn", onClick: function onClick() {
                return props.remove(props.responsesInfo, props.self, props.movie);
              } },
            "Got it"
          )
        )
      )
    );
  } else {
    return React.createElement(
      "div",
      { className: "Reponses collection-item row" },
      React.createElement(
        "div",
        { className: "col s3" },
        React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
      ),
      React.createElement(
        "div",
        { className: "response col s9" },
        React.createElement(
          "div",
          { className: "responseMsg" },
          props.responsesInfo,
          " said ",
          props.responseAnswer,
          " to your ",
          props.responseType,
          " request!"
        ),
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn", onClick: function onClick() {
              return props.remove(props.responsesInfo, props.self, null);
            } },
          "Got it"
        )
      )
    );
  }
};

window.Responses = Responses;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1Jlc3BvbnNlcy5qcyJdLCJuYW1lcyI6WyJSZXNwb25zZXMiLCJwcm9wcyIsImNvbnNvbGUiLCJsb2ciLCJtb3ZpZSIsInJlc3BvbnNlc0luZm8iLCJyZXNwb25zZUFuc3dlciIsInJlc3BvbnNlVHlwZSIsInJlbW92ZSIsInNlbGYiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsWUFBWSxTQUFaQSxTQUFZLENBQUNDLEtBQUQsRUFBVztBQUN6QkMsVUFBUUMsR0FBUixDQUFZLGFBQVosRUFBMkJGLE1BQU1HLEtBQWpDO0FBQ0EsTUFBSUgsTUFBTUcsS0FBTixLQUFnQixJQUFwQixFQUEwQjtBQUN4QixXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsOEJBQWY7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDRSxxQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsT0FERjtBQUlFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFBOEJILGdCQUFNSSxhQUFwQztBQUFBO0FBQXlESixnQkFBTUssY0FBL0Q7QUFBQTtBQUF3RkwsZ0JBQU1NLFlBQTlGO0FBQUE7QUFBOEhOLGdCQUFNRyxLQUFwSTtBQUFBO0FBQ0E7QUFBQTtBQUFBLGNBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEsdUJBQUlILE1BQU1PLE1BQU4sQ0FBYVAsTUFBTUksYUFBbkIsRUFBa0NKLE1BQU1RLElBQXhDLEVBQThDUixNQUFNRyxLQUFwRCxDQUFKO0FBQUEsZUFBckQ7QUFBQTtBQUFBO0FBREE7QUFERjtBQUpGLEtBREY7QUFZRCxHQWJELE1BYU87QUFDTCxXQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsOEJBQWY7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFFBQWY7QUFDRSxxQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsT0FERjtBQUtFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFBOEJILGdCQUFNSSxhQUFwQztBQUFBO0FBQXlESixnQkFBTUssY0FBL0Q7QUFBQTtBQUF3RkwsZ0JBQU1NLFlBQTlGO0FBQUE7QUFBQSxTQURGO0FBRUU7QUFBQTtBQUFBLFlBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEscUJBQUlOLE1BQU1PLE1BQU4sQ0FBYVAsTUFBTUksYUFBbkIsRUFBa0NKLE1BQU1RLElBQXhDLEVBQThDLElBQTlDLENBQUo7QUFBQSxhQUFyRDtBQUFBO0FBQUE7QUFGRjtBQUxGLEtBREY7QUFZRDtBQUNGLENBN0JEOztBQStCQUMsT0FBT1YsU0FBUCxHQUFtQkEsU0FBbkIiLCJmaWxlIjoiUmVzcG9uc2VzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFJlc3BvbnNlcyA9IChwcm9wcykgPT4ge1xyXG4gIGNvbnNvbGUubG9nKCdwcm9wcy5tb3ZpZScsIHByb3BzLm1vdmllKVxyXG4gIGlmIChwcm9wcy5tb3ZpZSAhPT0gbnVsbCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJSZXBvbnNlcyBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cclxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2UgY29sIHM5XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlTXNnXCI+e3Byb3BzLnJlc3BvbnNlc0luZm99IHNhaWQge3Byb3BzLnJlc3BvbnNlQW5zd2VyfSB0byB5b3VyIHtwcm9wcy5yZXNwb25zZVR5cGV9IHJlcXVlc3QgdG8gd2F0Y2gge3Byb3BzLm1vdmllfSEgIFxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpPT5wcm9wcy5yZW1vdmUocHJvcHMucmVzcG9uc2VzSW5mbywgcHJvcHMuc2VsZiwgcHJvcHMubW92aWUpfT5Hb3QgaXQ8L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiUmVwb25zZXMgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XHJcbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZSBjb2wgczlcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzcG9uc2VNc2dcIj57cHJvcHMucmVzcG9uc2VzSW5mb30gc2FpZCB7cHJvcHMucmVzcG9uc2VBbnN3ZXJ9IHRvIHlvdXIge3Byb3BzLnJlc3BvbnNlVHlwZX0gcmVxdWVzdCE8L2Rpdj5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKT0+cHJvcHMucmVtb3ZlKHByb3BzLnJlc3BvbnNlc0luZm8sIHByb3BzLnNlbGYsIG51bGwpfT5Hb3QgaXQ8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn07XHJcblxyXG53aW5kb3cuUmVzcG9uc2VzID0gUmVzcG9uc2VzOyJdfQ==