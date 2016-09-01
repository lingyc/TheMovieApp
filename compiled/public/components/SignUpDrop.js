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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcERyb3AuanMiXSwibmFtZXMiOlsiU2lnblVwRHJvcCIsInByb3BzIiwic3RhdGUiLCJmaWxlcyIsImV2ZW50IiwiZmQiLCJyZWZzIiwiZmlsZSIsImdldERPTU5vZGUiLCIkIiwiYWpheCIsInVybCIsImRhdGEiLCJwcm9jZXNzRGF0YSIsImNvbnRlbnRUeXBlIiwidHlwZSIsInN1Y2Nlc3MiLCJjb25zb2xlIiwibG9nIiwicHJldmVudERlZmF1bHQiLCJ1cGxvYWRGaWxlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsVTs7O0FBQ0osc0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx3SEFDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU87QUFESSxLQUFiO0FBSGlCO0FBTWxCOzs7OytCQUVVQyxLLEVBQU87QUFDaEIsVUFBSUMsTUFBTSxRQUFRLEtBQUtDLElBQUwsQ0FBVUMsSUFBVixDQUFlQyxVQUFmLEdBQTRCRCxJQUE1QixDQUFpQyxDQUFqQyxDQUFkLENBQUo7O0FBRUFFLFFBQUVDLElBQUYsQ0FBTztBQUNMQyxhQUFLLDhCQURBO0FBRUxDLGNBQU1QLEVBRkQ7QUFHTFEscUJBQWEsS0FIUjtBQUlMQyxxQkFBYSxLQUpSO0FBS0xDLGNBQU0sTUFMRDtBQU1MQyxpQkFBUyxpQkFBU0osSUFBVCxFQUFlO0FBQ3RCSyxrQkFBUUMsR0FBUixDQUFZTixJQUFaO0FBQ0Q7QUFSSSxPQUFQO0FBVUFSLFlBQU1lLGNBQU47QUFDRDs7OzZCQUVRO0FBQ1AsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBTSxLQUFJLFlBQVYsRUFBdUIsV0FBVSxVQUFqQyxFQUE0QyxTQUFRLHFCQUFwRDtBQUNFLHlDQUFPLEtBQUksTUFBWCxFQUFrQixNQUFLLE1BQXZCLEVBQThCLE1BQUssTUFBbkMsRUFBMEMsV0FBVSxhQUFwRCxHQURGO0FBRUUseUNBQU8sTUFBSyxRQUFaLEVBQXFCLEtBQUksUUFBekIsRUFBa0MsT0FBTSxRQUF4QyxFQUFpRCxTQUFTLEtBQUtDLFVBQS9EO0FBRkY7QUFERixPQURGO0FBUUQ7Ozs7RUFsQ3NCQyxNQUFNQyxTOztBQXNDL0JDLE9BQU92QixVQUFQLEdBQW9CQSxVQUFwQiIsImZpbGUiOiJTaWduVXBEcm9wLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2lnblVwRHJvcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIFxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBmaWxlczogW11cbiAgICB9O1xuICB9XG5cbiAgdXBsb2FkRmlsZShldmVudCkge1xuICAgIHZhciBmZCA9ICgnZmlsZScsIHRoaXMucmVmcy5maWxlLmdldERPTU5vZGUoKS5maWxlWzBdKTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAvVXBsb2FkJyxcbiAgICAgIGRhdGE6IGZkLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxmb3JtIHJlZj0ndXBsb2FkRm9ybScgY2xhc3NOYW1lPSd1cGxvYWRlcicgZW5jVHlwZT0nbXVsdGlwYXJ0L2Zvcm0tZGF0YSc+XG4gICAgICAgICAgPGlucHV0IHJlZj0nZmlsZScgdHlwZT0nZmlsZScgbmFtZT0nZmlsZScgY2xhc3NOYW1lPSd1cGxvYWQtZmlsZScgLz5cbiAgICAgICAgICA8aW5wdXQgdHlwZT0nYnV0dG9uJyByZWY9J2J1dHRvbicgdmFsdWU9J1VwbG9hZCcgb25DbGljaz17dGhpcy51cGxvYWRGaWxlfSAvPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn1cblxud2luZG93LlNpZ25VcERyb3AgPSBTaWduVXBEcm9wOyJdfQ==