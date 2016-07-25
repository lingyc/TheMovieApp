'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignUpDrop = function (_React$Component) {
  _inherits(SignUpDrop, _React$Component);

  function SignUpDrop(props) {
    _classCallCheck(this, SignUpDrop);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SignUpDrop).call(this, props));

    _this.state = {
      files: []
    };
    return _this;
  }

  _createClass(SignUpDrop, [{
    key: 'uploadFile',
    value: function uploadFile(event) {
      var fd = ('file', this.refs.file.getDOMNode().file[0]);

      $.ajax({
        url: 'http://127.0.0.1:3000/Upload',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        success: function success(data) {
          console.log(data);
        }
      });
      event.preventDefault();
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'form',
          { ref: 'uploadForm', className: 'uploader', encType: 'multipart/form-data' },
          React.createElement('input', { ref: 'file', type: 'file', name: 'file', className: 'upload-file' }),
          React.createElement('input', { type: 'button', ref: 'button', value: 'Upload', onClick: this.uploadFile })
        )
      );
    }
  }]);

  return SignUpDrop;
}(React.Component);

window.SignUpDrop = SignUpDrop;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcERyb3AuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLFU7OztBQUNKLHNCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw4RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGFBQU87QUFESSxLQUFiO0FBSGlCO0FBTWxCOzs7OytCQUVVLEssRUFBTztBQUNoQixVQUFJLE1BQU0sUUFBUSxLQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsVUFBZixHQUE0QixJQUE1QixDQUFpQyxDQUFqQyxDQUFkLENBQUo7O0FBRUEsUUFBRSxJQUFGLENBQU87QUFDTCxhQUFLLDhCQURBO0FBRUwsY0FBTSxFQUZEO0FBR0wscUJBQWEsS0FIUjtBQUlMLHFCQUFhLEtBSlI7QUFLTCxjQUFNLE1BTEQ7QUFNTCxpQkFBUyxpQkFBUyxJQUFULEVBQWU7QUFDdEIsa0JBQVEsR0FBUixDQUFZLElBQVo7QUFDRDtBQVJJLE9BQVA7QUFVQSxZQUFNLGNBQU47QUFDRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBTSxLQUFJLFlBQVYsRUFBdUIsV0FBVSxVQUFqQyxFQUE0QyxTQUFRLHFCQUFwRDtBQUNFLHlDQUFPLEtBQUksTUFBWCxFQUFrQixNQUFLLE1BQXZCLEVBQThCLE1BQUssTUFBbkMsRUFBMEMsV0FBVSxhQUFwRCxHQURGO0FBRUUseUNBQU8sTUFBSyxRQUFaLEVBQXFCLEtBQUksUUFBekIsRUFBa0MsT0FBTSxRQUF4QyxFQUFpRCxTQUFTLEtBQUssVUFBL0Q7QUFGRjtBQURGLE9BREY7QUFRRDs7OztFQWxDc0IsTUFBTSxTOztBQXNDL0IsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6IlNpZ25VcERyb3AuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaWduVXBEcm9wIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGZpbGVzOiBbXVxuICAgIH07XG4gIH1cblxuICB1cGxvYWRGaWxlKGV2ZW50KSB7XG4gICAgdmFyIGZkID0gKCdmaWxlJywgdGhpcy5yZWZzLmZpbGUuZ2V0RE9NTm9kZSgpLmZpbGVbMF0pO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9VcGxvYWQnLFxuICAgICAgZGF0YTogZmQsXG4gICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGZvcm0gcmVmPSd1cGxvYWRGb3JtJyBjbGFzc05hbWU9J3VwbG9hZGVyJyBlbmNUeXBlPSdtdWx0aXBhcnQvZm9ybS1kYXRhJz5cbiAgICAgICAgICA8aW5wdXQgcmVmPSdmaWxlJyB0eXBlPSdmaWxlJyBuYW1lPSdmaWxlJyBjbGFzc05hbWU9J3VwbG9hZC1maWxlJyAvPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPSdidXR0b24nIHJlZj0nYnV0dG9uJyB2YWx1ZT0nVXBsb2FkJyBvbkNsaWNrPXt0aGlzLnVwbG9hZEZpbGV9IC8+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxufVxuXG53aW5kb3cuU2lnblVwRHJvcCA9IFNpZ25VcERyb3A7Il19