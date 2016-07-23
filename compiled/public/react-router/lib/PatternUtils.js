'use strict';

exports.__esModule = true;
exports.compilePattern = compilePattern;
exports.matchPattern = matchPattern;
exports.getParamNames = getParamNames;
exports.getParams = getParams;
exports.formatPattern = formatPattern;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function _compilePattern(pattern) {
  var regexpSource = '';
  var paramNames = [];
  var tokens = [];

  var match = void 0,
      lastIndex = 0,
      matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g;
  while (match = matcher.exec(pattern)) {
    if (match.index !== lastIndex) {
      tokens.push(pattern.slice(lastIndex, match.index));
      regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index));
    }

    if (match[1]) {
      regexpSource += '([^/]+)';
      paramNames.push(match[1]);
    } else if (match[0] === '**') {
      regexpSource += '(.*)';
      paramNames.push('splat');
    } else if (match[0] === '*') {
      regexpSource += '(.*?)';
      paramNames.push('splat');
    } else if (match[0] === '(') {
      regexpSource += '(?:';
    } else if (match[0] === ')') {
      regexpSource += ')?';
    }

    tokens.push(match[0]);

    lastIndex = matcher.lastIndex;
  }

  if (lastIndex !== pattern.length) {
    tokens.push(pattern.slice(lastIndex, pattern.length));
    regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length));
  }

  return {
    pattern: pattern,
    regexpSource: regexpSource,
    paramNames: paramNames,
    tokens: tokens
  };
}

var CompiledPatternsCache = {};

function compilePattern(pattern) {
  if (!(pattern in CompiledPatternsCache)) CompiledPatternsCache[pattern] = _compilePattern(pattern);

  return CompiledPatternsCache[pattern];
}

/**
 * Attempts to match a pattern on the given pathname. Patterns may use
 * the following special characters:
 *
 * - :paramName     Matches a URL segment up to the next /, ?, or #. The
 *                  captured string is considered a "param"
 * - ()             Wraps a segment of the URL that is optional
 * - *              Consumes (non-greedy) all characters up to the next
 *                  character in the pattern, or to the end of the URL if
 *                  there is none
 * - **             Consumes (greedy) all characters up to the next character
 *                  in the pattern, or to the end of the URL if there is none
 *
 *  The function calls callback(error, matched) when finished.
 * The return value is an object with the following properties:
 *
 * - remainingPathname
 * - paramNames
 * - paramValues
 */
function matchPattern(pattern, pathname) {
  // Ensure pattern starts with leading slash for consistency with pathname.
  if (pattern.charAt(0) !== '/') {
    pattern = '/' + pattern;
  }

  var _compilePattern2 = compilePattern(pattern);

  var regexpSource = _compilePattern2.regexpSource;
  var paramNames = _compilePattern2.paramNames;
  var tokens = _compilePattern2.tokens;

  if (pattern.charAt(pattern.length - 1) !== '/') {
    regexpSource += '/?'; // Allow optional path separator at end.
  }

  // Special-case patterns like '*' for catch-all routes.
  if (tokens[tokens.length - 1] === '*') {
    regexpSource += '$';
  }

  var match = pathname.match(new RegExp('^' + regexpSource, 'i'));
  if (match == null) {
    return null;
  }

  var matchedPath = match[0];
  var remainingPathname = pathname.substr(matchedPath.length);

  if (remainingPathname) {
    // Require that the match ends at a path separator, if we didn't match
    // the full path, so any remaining pathname is a new path segment.
    if (matchedPath.charAt(matchedPath.length - 1) !== '/') {
      return null;
    }

    // If there is a remaining pathname, treat the path separator as part of
    // the remaining pathname for properly continuing the match.
    remainingPathname = '/' + remainingPathname;
  }

  return {
    remainingPathname: remainingPathname,
    paramNames: paramNames,
    paramValues: match.slice(1).map(function (v) {
      return v && decodeURIComponent(v);
    })
  };
}

function getParamNames(pattern) {
  return compilePattern(pattern).paramNames;
}

function getParams(pattern, pathname) {
  var match = matchPattern(pattern, pathname);
  if (!match) {
    return null;
  }

  var paramNames = match.paramNames;
  var paramValues = match.paramValues;

  var params = {};

  paramNames.forEach(function (paramName, index) {
    params[paramName] = paramValues[index];
  });

  return params;
}

/**
 * Returns a version of the given pattern with params interpolated. Throws
 * if there is a dynamic segment of the pattern for which there is no param.
 */
function formatPattern(pattern, params) {
  params = params || {};

  var _compilePattern3 = compilePattern(pattern);

  var tokens = _compilePattern3.tokens;

  var parenCount = 0,
      pathname = '',
      splatIndex = 0;

  var token = void 0,
      paramName = void 0,
      paramValue = void 0;
  for (var i = 0, len = tokens.length; i < len; ++i) {
    token = tokens[i];

    if (token === '*' || token === '**') {
      paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;

      !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Missing splat #%s for path "%s"', splatIndex, pattern) : (0, _invariant2.default)(false) : void 0;

      if (paramValue != null) pathname += encodeURI(paramValue);
    } else if (token === '(') {
      parenCount += 1;
    } else if (token === ')') {
      parenCount -= 1;
    } else if (token.charAt(0) === ':') {
      paramName = token.substring(1);
      paramValue = params[paramName];

      !(paramValue != null || parenCount > 0) ? process.env.NODE_ENV !== 'production' ? (0, _invariant2.default)(false, 'Missing "%s" parameter for path "%s"', paramName, pattern) : (0, _invariant2.default)(false) : void 0;

      if (paramValue != null) pathname += encodeURIComponent(paramValue);
    } else {
      pathname += token;
    }
  }

  return pathname.replace(/\/+/g, '/');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvbGliL1BhdHRlcm5VdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxRQUFRLFVBQVIsR0FBcUIsSUFBckI7QUFDQSxRQUFRLGNBQVIsR0FBeUIsY0FBekI7QUFDQSxRQUFRLFlBQVIsR0FBdUIsWUFBdkI7QUFDQSxRQUFRLGFBQVIsR0FBd0IsYUFBeEI7QUFDQSxRQUFRLFNBQVIsR0FBb0IsU0FBcEI7QUFDQSxRQUFRLGFBQVIsR0FBd0IsYUFBeEI7O0FBRUEsSUFBSSxhQUFhLFFBQVEsV0FBUixDQUFqQjs7QUFFQSxJQUFJLGNBQWMsdUJBQXVCLFVBQXZCLENBQWxCOztBQUVBLFNBQVMsc0JBQVQsQ0FBZ0MsR0FBaEMsRUFBcUM7QUFBRSxTQUFPLE9BQU8sSUFBSSxVQUFYLEdBQXdCLEdBQXhCLEdBQThCLEVBQUUsU0FBUyxHQUFYLEVBQXJDO0FBQXdEOztBQUUvRixTQUFTLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEI7QUFDNUIsU0FBTyxPQUFPLE9BQVAsQ0FBZSxxQkFBZixFQUFzQyxNQUF0QyxDQUFQO0FBQ0Q7O0FBRUQsU0FBUyxlQUFULENBQXlCLE9BQXpCLEVBQWtDO0FBQ2hDLE1BQUksZUFBZSxFQUFuQjtBQUNBLE1BQUksYUFBYSxFQUFqQjtBQUNBLE1BQUksU0FBUyxFQUFiOztBQUVBLE1BQUksUUFBUSxLQUFLLENBQWpCO0FBQUEsTUFDSSxZQUFZLENBRGhCO0FBQUEsTUFFSSxVQUFVLDRDQUZkO0FBR0EsU0FBTyxRQUFRLFFBQVEsSUFBUixDQUFhLE9BQWIsQ0FBZixFQUFzQztBQUNwQyxRQUFJLE1BQU0sS0FBTixLQUFnQixTQUFwQixFQUErQjtBQUM3QixhQUFPLElBQVAsQ0FBWSxRQUFRLEtBQVIsQ0FBYyxTQUFkLEVBQXlCLE1BQU0sS0FBL0IsQ0FBWjtBQUNBLHNCQUFnQixhQUFhLFFBQVEsS0FBUixDQUFjLFNBQWQsRUFBeUIsTUFBTSxLQUEvQixD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TUFPQTtBQUNMLGtCQUFZLEtBQVo7QUFDRDtBQUNGOztBQUVELFNBQU8sU0FBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCLEdBQXpCLENBQVA7QUFDRCIsImZpbGUiOiJQYXR0ZXJuVXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5leHBvcnRzLmNvbXBpbGVQYXR0ZXJuID0gY29tcGlsZVBhdHRlcm47XG5leHBvcnRzLm1hdGNoUGF0dGVybiA9IG1hdGNoUGF0dGVybjtcbmV4cG9ydHMuZ2V0UGFyYW1OYW1lcyA9IGdldFBhcmFtTmFtZXM7XG5leHBvcnRzLmdldFBhcmFtcyA9IGdldFBhcmFtcztcbmV4cG9ydHMuZm9ybWF0UGF0dGVybiA9IGZvcm1hdFBhdHRlcm47XG5cbnZhciBfaW52YXJpYW50ID0gcmVxdWlyZSgnaW52YXJpYW50Jyk7XG5cbnZhciBfaW52YXJpYW50MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2ludmFyaWFudCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpO1xufVxuXG5mdW5jdGlvbiBfY29tcGlsZVBhdHRlcm4ocGF0dGVybikge1xuICB2YXIgcmVnZXhwU291cmNlID0gJyc7XG4gIHZhciBwYXJhbU5hbWVzID0gW107XG4gIHZhciB0b2tlbnMgPSBbXTtcblxuICB2YXIgbWF0Y2ggPSB2b2lkIDAsXG4gICAgICBsYXN0SW5kZXggPSAwLFxuICAgICAgbWF0Y2hlciA9IC86KFthLXpBLVpfJF1bYS16QS1aMC05XyRdKil8XFwqXFwqfFxcKnxcXCh8XFwpL2c7XG4gIHdoaWxlIChtYXRjaCA9IG1hdGNoZXIuZXhlYyhwYXR0ZXJuKSkge1xuICAgIGlmIChtYXRjaC5pbmRleCAhPT0gbGFzdEluZGV4KSB7XG4gICAgICB0b2tlbnMucHVzaChwYXR0ZXJuLnNsaWNlKGxhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSBlc2NhcGVSZWdFeHAocGF0dGVybi5zbGljZShsYXN0SW5kZXgsIG1hdGNoLmluZGV4KSk7XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoWzFdKSB7XG4gICAgICByZWdleHBTb3VyY2UgKz0gJyhbXi9dKyknO1xuICAgICAgcGFyYW1OYW1lcy5wdXNoKG1hdGNoWzFdKTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoWzBdID09PSAnKionKSB7XG4gICAgICByZWdleHBTb3VyY2UgKz0gJyguKiknO1xuICAgICAgcGFyYW1OYW1lcy5wdXNoKCdzcGxhdCcpO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hbMF0gPT09ICcqJykge1xuICAgICAgcmVnZXhwU291cmNlICs9ICcoLio/KSc7XG4gICAgICBwYXJhbU5hbWVzLnB1c2goJ3NwbGF0Jyk7XG4gICAgfSBlbHNlIGlmIChtYXRjaFswXSA9PT0gJygnKSB7XG4gICAgICByZWdleHBTb3VyY2UgKz0gJyg/Oic7XG4gICAgfSBlbHNlIGlmIChtYXRjaFswXSA9PT0gJyknKSB7XG4gICAgICByZWdleHBTb3VyY2UgKz0gJyk/JztcbiAgICB9XG5cbiAgICB0b2tlbnMucHVzaChtYXRjaFswXSk7XG5cbiAgICBsYXN0SW5kZXggPSBtYXRjaGVyLmxhc3RJbmRleDtcbiAgfVxuXG4gIGlmIChsYXN0SW5kZXggIT09IHBhdHRlcm4ubGVuZ3RoKSB7XG4gICAgdG9rZW5zLnB1c2gocGF0dGVybi5zbGljZShsYXN0SW5kZXgsIHBhdHRlcm4ubGVuZ3RoKSk7XG4gICAgcmVnZXhwU291cmNlICs9IGVzY2FwZVJlZ0V4cChwYXR0ZXJuLnNsaWNlKGxhc3RJbmRleCwgcGF0dGVybi5sZW5ndGgpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcGF0dGVybjogcGF0dGVybixcbiAgICByZWdleHBTb3VyY2U6IHJlZ2V4cFNvdXJjZSxcbiAgICBwYXJhbU5hbWVzOiBwYXJhbU5hbWVzLFxuICAgIHRva2VuczogdG9rZW5zXG4gIH07XG59XG5cbnZhciBDb21waWxlZFBhdHRlcm5zQ2FjaGUgPSB7fTtcblxuZnVuY3Rpb24gY29tcGlsZVBhdHRlcm4ocGF0dGVybikge1xuICBpZiAoIShwYXR0ZXJuIGluIENvbXBpbGVkUGF0dGVybnNDYWNoZSkpIENvbXBpbGVkUGF0dGVybnNDYWNoZVtwYXR0ZXJuXSA9IF9jb21waWxlUGF0dGVybihwYXR0ZXJuKTtcblxuICByZXR1cm4gQ29tcGlsZWRQYXR0ZXJuc0NhY2hlW3BhdHRlcm5dO1xufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIG1hdGNoIGEgcGF0dGVybiBvbiB0aGUgZ2l2ZW4gcGF0aG5hbWUuIFBhdHRlcm5zIG1heSB1c2VcbiAqIHRoZSBmb2xsb3dpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzOlxuICpcbiAqIC0gOnBhcmFtTmFtZSAgICAgTWF0Y2hlcyBhIFVSTCBzZWdtZW50IHVwIHRvIHRoZSBuZXh0IC8sID8sIG9yICMuIFRoZVxuICogICAgICAgICAgICAgICAgICBjYXB0dXJlZCBzdHJpbmcgaXMgY29uc2lkZXJlZCBhIFwicGFyYW1cIlxuICogLSAoKSAgICAgICAgICAgICBXcmFwcyBhIHNlZ21lbnQgb2YgdGhlIFVSTCB0aGF0IGlzIG9wdGlvbmFsXG4gKiAtICogICAgICAgICAgICAgIENvbnN1bWVzIChub24tZ3JlZWR5KSBhbGwgY2hhcmFjdGVycyB1cCB0byB0aGUgbmV4dFxuICogICAgICAgICAgICAgICAgICBjaGFyYWN0ZXIgaW4gdGhlIHBhdHRlcm4sIG9yIHRvIHRoZSBlbmQgb2YgdGhlIFVSTCBpZlxuICogICAgICAgICAgICAgICAgICB0aGVyZSBpcyBub25lXG4gKiAtICoqICAgICAgICAgICAgIENvbnN1bWVzIChncmVlZHkpIGFsbCBjaGFyYWN0ZXJzIHVwIHRvIHRoZSBuZXh0IGNoYXJhY3RlclxuICogICAgICAgICAgICAgICAgICBpbiB0aGUgcGF0dGVybiwgb3IgdG8gdGhlIGVuZCBvZiB0aGUgVVJMIGlmIHRoZXJlIGlzIG5vbmVcbiAqXG4gKiAgVGhlIGZ1bmN0aW9uIGNhbGxzIGNhbGxiYWNrKGVycm9yLCBtYXRjaGVkKSB3aGVuIGZpbmlzaGVkLlxuICogVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogLSByZW1haW5pbmdQYXRobmFtZVxuICogLSBwYXJhbU5hbWVzXG4gKiAtIHBhcmFtVmFsdWVzXG4gKi9cbmZ1bmN0aW9uIG1hdGNoUGF0dGVybihwYXR0ZXJuLCBwYXRobmFtZSkge1xuICAvLyBFbnN1cmUgcGF0dGVybiBzdGFydHMgd2l0aCBsZWFkaW5nIHNsYXNoIGZvciBjb25zaXN0ZW5jeSB3aXRoIHBhdGhuYW1lLlxuICBpZiAocGF0dGVybi5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgIHBhdHRlcm4gPSAnLycgKyBwYXR0ZXJuO1xuICB9XG5cbiAgdmFyIF9jb21waWxlUGF0dGVybjIgPSBjb21waWxlUGF0dGVybihwYXR0ZXJuKTtcblxuICB2YXIgcmVnZXhwU291cmNlID0gX2NvbXBpbGVQYXR0ZXJuMi5yZWdleHBTb3VyY2U7XG4gIHZhciBwYXJhbU5hbWVzID0gX2NvbXBpbGVQYXR0ZXJuMi5wYXJhbU5hbWVzO1xuICB2YXIgdG9rZW5zID0gX2NvbXBpbGVQYXR0ZXJuMi50b2tlbnM7XG5cblxuICBpZiAocGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgcmVnZXhwU291cmNlICs9ICcvPyc7IC8vIEFsbG93IG9wdGlvbmFsIHBhdGggc2VwYXJhdG9yIGF0IGVuZC5cbiAgfVxuXG4gIC8vIFNwZWNpYWwtY2FzZSBwYXR0ZXJucyBsaWtlICcqJyBmb3IgY2F0Y2gtYWxsIHJvdXRlcy5cbiAgaWYgKHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV0gPT09ICcqJykge1xuICAgIHJlZ2V4cFNvdXJjZSArPSAnJCc7XG4gIH1cblxuICB2YXIgbWF0Y2ggPSBwYXRobmFtZS5tYXRjaChuZXcgUmVnRXhwKCdeJyArIHJlZ2V4cFNvdXJjZSwgJ2knKSk7XG4gIGlmIChtYXRjaCA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgbWF0Y2hlZFBhdGggPSBtYXRjaFswXTtcbiAgdmFyIHJlbWFpbmluZ1BhdGhuYW1lID0gcGF0aG5hbWUuc3Vic3RyKG1hdGNoZWRQYXRoLmxlbmd0aCk7XG5cbiAgaWYgKHJlbWFpbmluZ1BhdGhuYW1lKSB7XG4gICAgLy8gUmVxdWlyZSB0aGF0IHRoZSBtYXRjaCBlbmRzIGF0IGEgcGF0aCBzZXBhcmF0b3IsIGlmIHdlIGRpZG4ndCBtYXRjaFxuICAgIC8vIHRoZSBmdWxsIHBhdGgsIHNvIGFueSByZW1haW5pbmcgcGF0aG5hbWUgaXMgYSBuZXcgcGF0aCBzZWdtZW50LlxuICAgIGlmIChtYXRjaGVkUGF0aC5jaGFyQXQobWF0Y2hlZFBhdGgubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgaXMgYSByZW1haW5pbmcgcGF0aG5hbWUsIHRyZWF0IHRoZSBwYXRoIHNlcGFyYXRvciBhcyBwYXJ0IG9mXG4gICAgLy8gdGhlIHJlbWFpbmluZyBwYXRobmFtZSBmb3IgcHJvcGVybHkgY29udGludWluZyB0aGUgbWF0Y2guXG4gICAgcmVtYWluaW5nUGF0aG5hbWUgPSAnLycgKyByZW1haW5pbmdQYXRobmFtZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcmVtYWluaW5nUGF0aG5hbWU6IHJlbWFpbmluZ1BhdGhuYW1lLFxuICAgIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMsXG4gICAgcGFyYW1WYWx1ZXM6IG1hdGNoLnNsaWNlKDEpLm1hcChmdW5jdGlvbiAodikge1xuICAgICAgcmV0dXJuIHYgJiYgZGVjb2RlVVJJQ29tcG9uZW50KHYpO1xuICAgIH0pXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldFBhcmFtTmFtZXMocGF0dGVybikge1xuICByZXR1cm4gY29tcGlsZVBhdHRlcm4ocGF0dGVybikucGFyYW1OYW1lcztcbn1cblxuZnVuY3Rpb24gZ2V0UGFyYW1zKHBhdHRlcm4sIHBhdGhuYW1lKSB7XG4gIHZhciBtYXRjaCA9IG1hdGNoUGF0dGVybihwYXR0ZXJuLCBwYXRobmFtZSk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBwYXJhbU5hbWVzID0gbWF0Y2gucGFyYW1OYW1lcztcbiAgdmFyIHBhcmFtVmFsdWVzID0gbWF0Y2gucGFyYW1WYWx1ZXM7XG5cbiAgdmFyIHBhcmFtcyA9IHt9O1xuXG4gIHBhcmFtTmFtZXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW1OYW1lLCBpbmRleCkge1xuICAgIHBhcmFtc1twYXJhbU5hbWVdID0gcGFyYW1WYWx1ZXNbaW5kZXhdO1xuICB9KTtcblxuICByZXR1cm4gcGFyYW1zO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSB2ZXJzaW9uIG9mIHRoZSBnaXZlbiBwYXR0ZXJuIHdpdGggcGFyYW1zIGludGVycG9sYXRlZC4gVGhyb3dzXG4gKiBpZiB0aGVyZSBpcyBhIGR5bmFtaWMgc2VnbWVudCBvZiB0aGUgcGF0dGVybiBmb3Igd2hpY2ggdGhlcmUgaXMgbm8gcGFyYW0uXG4gKi9cbmZ1bmN0aW9uIGZvcm1hdFBhdHRlcm4ocGF0dGVybiwgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IHBhcmFtcyB8fCB7fTtcblxuICB2YXIgX2NvbXBpbGVQYXR0ZXJuMyA9IGNvbXBpbGVQYXR0ZXJuKHBhdHRlcm4pO1xuXG4gIHZhciB0b2tlbnMgPSBfY29tcGlsZVBhdHRlcm4zLnRva2VucztcblxuICB2YXIgcGFyZW5Db3VudCA9IDAsXG4gICAgICBwYXRobmFtZSA9ICcnLFxuICAgICAgc3BsYXRJbmRleCA9IDA7XG5cbiAgdmFyIHRva2VuID0gdm9pZCAwLFxuICAgICAgcGFyYW1OYW1lID0gdm9pZCAwLFxuICAgICAgcGFyYW1WYWx1ZSA9IHZvaWQgMDtcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRva2Vucy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgaWYgKHRva2VuID09PSAnKicgfHwgdG9rZW4gPT09ICcqKicpIHtcbiAgICAgIHBhcmFtVmFsdWUgPSBBcnJheS5pc0FycmF5KHBhcmFtcy5zcGxhdCkgPyBwYXJhbXMuc3BsYXRbc3BsYXRJbmRleCsrXSA6IHBhcmFtcy5zcGxhdDtcblxuICAgICAgIShwYXJhbVZhbHVlICE9IG51bGwgfHwgcGFyZW5Db3VudCA+IDApID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSwgJ01pc3Npbmcgc3BsYXQgIyVzIGZvciBwYXRoIFwiJXNcIicsIHNwbGF0SW5kZXgsIHBhdHRlcm4pIDogKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlKSA6IHZvaWQgMDtcblxuICAgICAgaWYgKHBhcmFtVmFsdWUgIT0gbnVsbCkgcGF0aG5hbWUgKz0gZW5jb2RlVVJJKHBhcmFtVmFsdWUpO1xuICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICcoJykge1xuICAgICAgcGFyZW5Db3VudCArPSAxO1xuICAgIH0gZWxzZSBpZiAodG9rZW4gPT09ICcpJykge1xuICAgICAgcGFyZW5Db3VudCAtPSAxO1xuICAgIH0gZWxzZSBpZiAodG9rZW4uY2hhckF0KDApID09PSAnOicpIHtcbiAgICAgIHBhcmFtTmFtZSA9IHRva2VuLnN1YnN0cmluZygxKTtcbiAgICAgIHBhcmFtVmFsdWUgPSBwYXJhbXNbcGFyYW1OYW1lXTtcblxuICAgICAgIShwYXJhbVZhbHVlICE9IG51bGwgfHwgcGFyZW5Db3VudCA+IDApID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/ICgwLCBfaW52YXJpYW50Mi5kZWZhdWx0KShmYWxzZSwgJ01pc3NpbmcgXCIlc1wiIHBhcmFtZXRlciBmb3IgcGF0aCBcIiVzXCInLCBwYXJhbU5hbWUsIHBhdHRlcm4pIDogKDAsIF9pbnZhcmlhbnQyLmRlZmF1bHQpKGZhbHNlKSA6IHZvaWQgMDtcblxuICAgICAgaWYgKHBhcmFtVmFsdWUgIT0gbnVsbCkgcGF0aG5hbWUgKz0gZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtVmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXRobmFtZSArPSB0b2tlbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGF0aG5hbWUucmVwbGFjZSgvXFwvKy9nLCAnLycpO1xufSJdfQ==