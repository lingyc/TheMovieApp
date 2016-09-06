'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignUpDrop = function (_React$Component) {
  _inherits(SignUpDrop, _React$Component);

  function SignUpDrop(props) {
    _classCallCheck(this, SignUpDrop);

    var _this = _possibleConstructorReturn(this, (SignUpDrop.__proto__ || Object.getPrototypeOf(SignUpDrop)).call(this, props));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcERyb3AuanMiXSwibmFtZXMiOlsiU2lnblVwRHJvcCIsInByb3BzIiwic3RhdGUiLCJmaWxlcyIsImV2ZW50IiwiZmQiLCJyZWZzIiwiZmlsZSIsImdldERPTU5vZGUiLCIkIiwiYWpheCIsInVybCIsImRhdGEiLCJwcm9jZXNzRGF0YSIsImNvbnRlbnRUeXBlIiwidHlwZSIsInN1Y2Nlc3MiLCJjb25zb2xlIiwibG9nIiwicHJldmVudERlZmF1bHQiLCJ1cGxvYWRGaWxlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsVTs7O0FBQ0osc0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx3SEFDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU87QUFESSxLQUFiO0FBSGlCO0FBTWxCOzs7OytCQUVVQyxLLEVBQU87QUFDaEIsVUFBSUMsTUFBTSxRQUFRLEtBQUtDLElBQUwsQ0FBVUMsSUFBVixDQUFlQyxVQUFmLEdBQTRCRCxJQUE1QixDQUFpQyxDQUFqQyxDQUFkLENBQUo7O0FBRUFFLFFBQUVDLElBQUYsQ0FBTztBQUNMQyxhQUFLLDhCQURBO0FBRUxDLGNBQU1QLEVBRkQ7QUFHTFEscUJBQWEsS0FIUjtBQUlMQyxxQkFBYSxLQUpSO0FBS0xDLGNBQU0sTUFMRDtBQU1MQyxpQkFBUyxpQkFBU0osSUFBVCxFQUFlO0FBQ3RCSyxrQkFBUUMsR0FBUixDQUFZTixJQUFaO0FBQ0Q7QUFSSSxPQUFQO0FBVUFSLFlBQU1lLGNBQU47QUFDRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBTSxLQUFJLFlBQVYsRUFBdUIsV0FBVSxVQUFqQyxFQUE0QyxTQUFRLHFCQUFwRDtBQUNFLHlDQUFPLEtBQUksTUFBWCxFQUFrQixNQUFLLE1BQXZCLEVBQThCLE1BQUssTUFBbkMsRUFBMEMsV0FBVSxhQUFwRCxHQURGO0FBRUUseUNBQU8sTUFBSyxRQUFaLEVBQXFCLEtBQUksUUFBekIsRUFBa0MsT0FBTSxRQUF4QyxFQUFpRCxTQUFTLEtBQUtDLFVBQS9EO0FBRkY7QUFERixPQURGO0FBUUQ7Ozs7RUFsQ3NCQyxNQUFNQyxTOztBQXNDL0JDLE9BQU92QixVQUFQLEdBQW9CQSxVQUFwQiIsImZpbGUiOiJTaWduVXBEcm9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2lnblVwRHJvcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIFxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgZmlsZXM6IFtdXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgdXBsb2FkRmlsZShldmVudCkge1xyXG4gICAgdmFyIGZkID0gKCdmaWxlJywgdGhpcy5yZWZzLmZpbGUuZ2V0RE9NTm9kZSgpLmZpbGVbMF0pO1xyXG5cclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9VcGxvYWQnLFxyXG4gICAgICBkYXRhOiBmZCxcclxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgIHR5cGU6ICdQT1NUJyxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgPGZvcm0gcmVmPSd1cGxvYWRGb3JtJyBjbGFzc05hbWU9J3VwbG9hZGVyJyBlbmNUeXBlPSdtdWx0aXBhcnQvZm9ybS1kYXRhJz5cclxuICAgICAgICAgIDxpbnB1dCByZWY9J2ZpbGUnIHR5cGU9J2ZpbGUnIG5hbWU9J2ZpbGUnIGNsYXNzTmFtZT0ndXBsb2FkLWZpbGUnIC8+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZT0nYnV0dG9uJyByZWY9J2J1dHRvbicgdmFsdWU9J1VwbG9hZCcgb25DbGljaz17dGhpcy51cGxvYWRGaWxlfSAvPlxyXG4gICAgICAgIDwvZm9ybT5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5TaWduVXBEcm9wID0gU2lnblVwRHJvcDsiXX0=