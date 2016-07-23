'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compilePattern = compilePattern;
exports.matchPattern = matchPattern;
exports.getParamNames = getParamNames;
exports.getParams = getParams;
exports.formatPattern = formatPattern;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L1BhdHRlcm5VdGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQXVEZ0IsYyxHQUFBLGM7UUEwQkEsWSxHQUFBLFk7UUFtREEsYSxHQUFBLGE7UUFJQSxTLEdBQUEsUztRQXNCQSxhLEdBQUEsYTs7QUE5SmhCOzs7Ozs7QUFFQSxTQUFTLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEI7QUFDNUIsU0FBTyxPQUFPLE9BQVAsQ0FBZSxxQkFBZixFQUFzQyxNQUF0QyxDQUFQO0FBQ0Q7O0FBRUQsU0FBUyxlQUFULENBQXlCLE9BQXpCLEVBQWtDO0FBQ2hDLE1BQUksZUFBZSxFQUFuQjtBQUNBLE1BQUksYUFBYSxFQUFqQjtBQUNBLE1BQUksU0FBUyxFQUFiOztBQUVBLE1BQUksUUFBUSxLQUFLLENBQWpCO0FBQUEsTUFDSSxZQUFZLENBRGhCO0FBQUEsTUFFSSxVQUFVLDRDQUZkO0FBR0EsU0FBTyxRQUFRLFFBQVEsSUFBUixDQUFhLE9BQWIsQ0FBZixFQUFzQztBQUNwQyxRQUFJLE1BQU0sS0FBTixLQUFnQixTQUFwQixFQUErQjtBQUM3QixhQUFPLElBQVAsQ0FBWSxRQUFRLEtBQVIsQ0FBYyxTQUFkLEVBQXlCLE1BQU0sS0FBL0IsQ0FBWjtBQUNBLHNCQUFnQixhQUFhLFFBQVEsS0FBUixDQUFjLFNBQWQsRUFBeUIsTUFBTSxLQUEvQixDQUFiLENBQWhCO0FBQ0Q7O0FBRUQsUUFBSSxNQUFNLENBQU4sQ0FBSixFQUFjO0FBQ1osc0JBQWdCLFNBQWhCO0FBQ0EsaUJBQVcsSUFBWCxDQUFnQixNQUFNLENBQU4sQ0FBaEI7QUFDRCxLQUhELE1BR08sSUFBSSxNQUFNLENBQU4sTUFBYSxJQUFqQixFQUF1QjtBQUM1QixzQkFBZ0IsTUFBaEI7QUFDQSxpQkFBVyxJQUFYLENBQWdCLE9BQWhCO0FBQ0QsS0FITSxNQUdBLElBQUksTUFBTSxDQUFOLE1BQWEsR0FBakIsRUFBc0I7QUFDM0Is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LENBQXhDLEdBQW1ILHlCQUFVLEtBQVYsQ0FBN0osR0FBZ0wsS0FBSyxDQUFyTDs7QUFFQSxVQUFJLGNBQWMsSUFBbEIsRUFBd0IsWUFBWSxVQUFVLFVBQVYsQ0FBWjtBQUN6QixLQU5ELE1BTU8sSUFBSSxVQUFVLEdBQWQsRUFBbUI7QUFDeEIsb0JBQWMsQ0FBZDtBQUNELEtBRk0sTUFFQSxJQUFJLFVBQVUsR0FBZCxFQUFtQjtBQUN4QixvQkFBYyxDQUFkO0FBQ0QsS0FGTSxNQUVBLElBQUksTUFBTSxNQUFOLENBQWEsQ0FBYixNQUFvQixHQUF4QixFQUE2QjtBQUNsQyxrQkFBWSxNQUFNLFNBQU4sQ0FBZ0IsQ0FBaEIsQ0FBWjtBQUNBLG1CQUFhLE9BQU8sU0FBUCxDQUFiOztBQUVBLFFBQUUsY0FBYyxJQUFkLElBQXNCLGFBQWEsQ0FBckMsSUFBMEMsUUFBUSxHQUFSLENBQVksUUFBWixLQUF5QixZQUF6QixHQUF3Qyx5QkFBVSxLQUFWLEVBQWlCLHNDQUFqQixFQUF5RCxTQUF6RCxFQUFvRSxPQUFwRSxDQUF4QyxHQUF1SCx5QkFBVSxLQUFWLENBQWpLLEdBQW9MLEtBQUssQ0FBekw7O0FBRUEsVUFBSSxjQUFjLElBQWxCLEVBQXdCLFlBQVksbUJBQW1CLFVBQW5CLENBQVo7QUFDekIsS0FQTSxNQU9BO0FBQ0wsa0JBQVksS0FBWjtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUIsR0FBekIsQ0FBUDtBQUNEIiwiZmlsZSI6IlBhdHRlcm5VdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbnZhcmlhbnQgZnJvbSAnaW52YXJpYW50JztcblxuZnVuY3Rpb24gZXNjYXBlUmVnRXhwKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCAnXFxcXCQmJyk7XG59XG5cbmZ1bmN0aW9uIF9jb21waWxlUGF0dGVybihwYXR0ZXJuKSB7XG4gIHZhciByZWdleHBTb3VyY2UgPSAnJztcbiAgdmFyIHBhcmFtTmFtZXMgPSBbXTtcbiAgdmFyIHRva2VucyA9IFtdO1xuXG4gIHZhciBtYXRjaCA9IHZvaWQgMCxcbiAgICAgIGxhc3RJbmRleCA9IDAsXG4gICAgICBtYXRjaGVyID0gLzooW2EtekEtWl8kXVthLXpBLVowLTlfJF0qKXxcXCpcXCp8XFwqfFxcKHxcXCkvZztcbiAgd2hpbGUgKG1hdGNoID0gbWF0Y2hlci5leGVjKHBhdHRlcm4pKSB7XG4gICAgaWYgKG1hdGNoLmluZGV4ICE9PSBsYXN0SW5kZXgpIHtcbiAgICAgIHRva2Vucy5wdXNoKHBhdHRlcm4uc2xpY2UobGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgcmVnZXhwU291cmNlICs9IGVzY2FwZVJlZ0V4cChwYXR0ZXJuLnNsaWNlKGxhc3RJbmRleCwgbWF0Y2guaW5kZXgpKTtcbiAgICB9XG5cbiAgICBpZiAobWF0Y2hbMV0pIHtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSAnKFteL10rKSc7XG4gICAgICBwYXJhbU5hbWVzLnB1c2gobWF0Y2hbMV0pO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hbMF0gPT09ICcqKicpIHtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSAnKC4qKSc7XG4gICAgICBwYXJhbU5hbWVzLnB1c2goJ3NwbGF0Jyk7XG4gICAgfSBlbHNlIGlmIChtYXRjaFswXSA9PT0gJyonKSB7XG4gICAgICByZWdleHBTb3VyY2UgKz0gJyguKj8pJztcbiAgICAgIHBhcmFtTmFtZXMucHVzaCgnc3BsYXQnKTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoWzBdID09PSAnKCcpIHtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSAnKD86JztcbiAgICB9IGVsc2UgaWYgKG1hdGNoWzBdID09PSAnKScpIHtcbiAgICAgIHJlZ2V4cFNvdXJjZSArPSAnKT8nO1xuICAgIH1cblxuICAgIHRva2Vucy5wdXNoKG1hdGNoWzBdKTtcblxuICAgIGxhc3RJbmRleCA9IG1hdGNoZXIubGFzdEluZGV4O1xuICB9XG5cbiAgaWYgKGxhc3RJbmRleCAhPT0gcGF0dGVybi5sZW5ndGgpIHtcbiAgICB0b2tlbnMucHVzaChwYXR0ZXJuLnNsaWNlKGxhc3RJbmRleCwgcGF0dGVybi5sZW5ndGgpKTtcbiAgICByZWdleHBTb3VyY2UgKz0gZXNjYXBlUmVnRXhwKHBhdHRlcm4uc2xpY2UobGFzdEluZGV4LCBwYXR0ZXJuLmxlbmd0aCkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwYXR0ZXJuOiBwYXR0ZXJuLFxuICAgIHJlZ2V4cFNvdXJjZTogcmVnZXhwU291cmNlLFxuICAgIHBhcmFtTmFtZXM6IHBhcmFtTmFtZXMsXG4gICAgdG9rZW5zOiB0b2tlbnNcbiAgfTtcbn1cblxudmFyIENvbXBpbGVkUGF0dGVybnNDYWNoZSA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tcGlsZVBhdHRlcm4ocGF0dGVybikge1xuICBpZiAoIShwYXR0ZXJuIGluIENvbXBpbGVkUGF0dGVybnNDYWNoZSkpIENvbXBpbGVkUGF0dGVybnNDYWNoZVtwYXR0ZXJuXSA9IF9jb21waWxlUGF0dGVybihwYXR0ZXJuKTtcblxuICByZXR1cm4gQ29tcGlsZWRQYXR0ZXJuc0NhY2hlW3BhdHRlcm5dO1xufVxuXG4vKipcbiAqIEF0dGVtcHRzIHRvIG1hdGNoIGEgcGF0dGVybiBvbiB0aGUgZ2l2ZW4gcGF0aG5hbWUuIFBhdHRlcm5zIG1heSB1c2VcbiAqIHRoZSBmb2xsb3dpbmcgc3BlY2lhbCBjaGFyYWN0ZXJzOlxuICpcbiAqIC0gOnBhcmFtTmFtZSAgICAgTWF0Y2hlcyBhIFVSTCBzZWdtZW50IHVwIHRvIHRoZSBuZXh0IC8sID8sIG9yICMuIFRoZVxuICogICAgICAgICAgICAgICAgICBjYXB0dXJlZCBzdHJpbmcgaXMgY29uc2lkZXJlZCBhIFwicGFyYW1cIlxuICogLSAoKSAgICAgICAgICAgICBXcmFwcyBhIHNlZ21lbnQgb2YgdGhlIFVSTCB0aGF0IGlzIG9wdGlvbmFsXG4gKiAtICogICAgICAgICAgICAgIENvbnN1bWVzIChub24tZ3JlZWR5KSBhbGwgY2hhcmFjdGVycyB1cCB0byB0aGUgbmV4dFxuICogICAgICAgICAgICAgICAgICBjaGFyYWN0ZXIgaW4gdGhlIHBhdHRlcm4sIG9yIHRvIHRoZSBlbmQgb2YgdGhlIFVSTCBpZlxuICogICAgICAgICAgICAgICAgICB0aGVyZSBpcyBub25lXG4gKiAtICoqICAgICAgICAgICAgIENvbnN1bWVzIChncmVlZHkpIGFsbCBjaGFyYWN0ZXJzIHVwIHRvIHRoZSBuZXh0IGNoYXJhY3RlclxuICogICAgICAgICAgICAgICAgICBpbiB0aGUgcGF0dGVybiwgb3IgdG8gdGhlIGVuZCBvZiB0aGUgVVJMIGlmIHRoZXJlIGlzIG5vbmVcbiAqXG4gKiAgVGhlIGZ1bmN0aW9uIGNhbGxzIGNhbGxiYWNrKGVycm9yLCBtYXRjaGVkKSB3aGVuIGZpbmlzaGVkLlxuICogVGhlIHJldHVybiB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gKlxuICogLSByZW1haW5pbmdQYXRobmFtZVxuICogLSBwYXJhbU5hbWVzXG4gKiAtIHBhcmFtVmFsdWVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXRjaFBhdHRlcm4ocGF0dGVybiwgcGF0aG5hbWUpIHtcbiAgLy8gRW5zdXJlIHBhdHRlcm4gc3RhcnRzIHdpdGggbGVhZGluZyBzbGFzaCBmb3IgY29uc2lzdGVuY3kgd2l0aCBwYXRobmFtZS5cbiAgaWYgKHBhdHRlcm4uY2hhckF0KDApICE9PSAnLycpIHtcbiAgICBwYXR0ZXJuID0gJy8nICsgcGF0dGVybjtcbiAgfVxuXG4gIHZhciBfY29tcGlsZVBhdHRlcm4yID0gY29tcGlsZVBhdHRlcm4ocGF0dGVybik7XG5cbiAgdmFyIHJlZ2V4cFNvdXJjZSA9IF9jb21waWxlUGF0dGVybjIucmVnZXhwU291cmNlO1xuICB2YXIgcGFyYW1OYW1lcyA9IF9jb21waWxlUGF0dGVybjIucGFyYW1OYW1lcztcbiAgdmFyIHRva2VucyA9IF9jb21waWxlUGF0dGVybjIudG9rZW5zO1xuXG5cbiAgaWYgKHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgIHJlZ2V4cFNvdXJjZSArPSAnLz8nOyAvLyBBbGxvdyBvcHRpb25hbCBwYXRoIHNlcGFyYXRvciBhdCBlbmQuXG4gIH1cblxuICAvLyBTcGVjaWFsLWNhc2UgcGF0dGVybnMgbGlrZSAnKicgZm9yIGNhdGNoLWFsbCByb3V0ZXMuXG4gIGlmICh0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdID09PSAnKicpIHtcbiAgICByZWdleHBTb3VyY2UgKz0gJyQnO1xuICB9XG5cbiAgdmFyIG1hdGNoID0gcGF0aG5hbWUubWF0Y2gobmV3IFJlZ0V4cCgnXicgKyByZWdleHBTb3VyY2UsICdpJykpO1xuICBpZiAobWF0Y2ggPT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIG1hdGNoZWRQYXRoID0gbWF0Y2hbMF07XG4gIHZhciByZW1haW5pbmdQYXRobmFtZSA9IHBhdGhuYW1lLnN1YnN0cihtYXRjaGVkUGF0aC5sZW5ndGgpO1xuXG4gIGlmIChyZW1haW5pbmdQYXRobmFtZSkge1xuICAgIC8vIFJlcXVpcmUgdGhhdCB0aGUgbWF0Y2ggZW5kcyBhdCBhIHBhdGggc2VwYXJhdG9yLCBpZiB3ZSBkaWRuJ3QgbWF0Y2hcbiAgICAvLyB0aGUgZnVsbCBwYXRoLCBzbyBhbnkgcmVtYWluaW5nIHBhdGhuYW1lIGlzIGEgbmV3IHBhdGggc2VnbWVudC5cbiAgICBpZiAobWF0Y2hlZFBhdGguY2hhckF0KG1hdGNoZWRQYXRoLmxlbmd0aCAtIDEpICE9PSAnLycpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIGEgcmVtYWluaW5nIHBhdGhuYW1lLCB0cmVhdCB0aGUgcGF0aCBzZXBhcmF0b3IgYXMgcGFydCBvZlxuICAgIC8vIHRoZSByZW1haW5pbmcgcGF0aG5hbWUgZm9yIHByb3Blcmx5IGNvbnRpbnVpbmcgdGhlIG1hdGNoLlxuICAgIHJlbWFpbmluZ1BhdGhuYW1lID0gJy8nICsgcmVtYWluaW5nUGF0aG5hbWU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJlbWFpbmluZ1BhdGhuYW1lOiByZW1haW5pbmdQYXRobmFtZSxcbiAgICBwYXJhbU5hbWVzOiBwYXJhbU5hbWVzLFxuICAgIHBhcmFtVmFsdWVzOiBtYXRjaC5zbGljZSgxKS5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgIHJldHVybiB2ICYmIGRlY29kZVVSSUNvbXBvbmVudCh2KTtcbiAgICB9KVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW1OYW1lcyhwYXR0ZXJuKSB7XG4gIHJldHVybiBjb21waWxlUGF0dGVybihwYXR0ZXJuKS5wYXJhbU5hbWVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYW1zKHBhdHRlcm4sIHBhdGhuYW1lKSB7XG4gIHZhciBtYXRjaCA9IG1hdGNoUGF0dGVybihwYXR0ZXJuLCBwYXRobmFtZSk7XG4gIGlmICghbWF0Y2gpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBwYXJhbU5hbWVzID0gbWF0Y2gucGFyYW1OYW1lcztcbiAgdmFyIHBhcmFtVmFsdWVzID0gbWF0Y2gucGFyYW1WYWx1ZXM7XG5cbiAgdmFyIHBhcmFtcyA9IHt9O1xuXG4gIHBhcmFtTmFtZXMuZm9yRWFjaChmdW5jdGlvbiAocGFyYW1OYW1lLCBpbmRleCkge1xuICAgIHBhcmFtc1twYXJhbU5hbWVdID0gcGFyYW1WYWx1ZXNbaW5kZXhdO1xuICB9KTtcblxuICByZXR1cm4gcGFyYW1zO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSB2ZXJzaW9uIG9mIHRoZSBnaXZlbiBwYXR0ZXJuIHdpdGggcGFyYW1zIGludGVycG9sYXRlZC4gVGhyb3dzXG4gKiBpZiB0aGVyZSBpcyBhIGR5bmFtaWMgc2VnbWVudCBvZiB0aGUgcGF0dGVybiBmb3Igd2hpY2ggdGhlcmUgaXMgbm8gcGFyYW0uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRQYXR0ZXJuKHBhdHRlcm4sIHBhcmFtcykge1xuICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG5cbiAgdmFyIF9jb21waWxlUGF0dGVybjMgPSBjb21waWxlUGF0dGVybihwYXR0ZXJuKTtcblxuICB2YXIgdG9rZW5zID0gX2NvbXBpbGVQYXR0ZXJuMy50b2tlbnM7XG5cbiAgdmFyIHBhcmVuQ291bnQgPSAwLFxuICAgICAgcGF0aG5hbWUgPSAnJyxcbiAgICAgIHNwbGF0SW5kZXggPSAwO1xuXG4gIHZhciB0b2tlbiA9IHZvaWQgMCxcbiAgICAgIHBhcmFtTmFtZSA9IHZvaWQgMCxcbiAgICAgIHBhcmFtVmFsdWUgPSB2b2lkIDA7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0b2tlbnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgIGlmICh0b2tlbiA9PT0gJyonIHx8IHRva2VuID09PSAnKionKSB7XG4gICAgICBwYXJhbVZhbHVlID0gQXJyYXkuaXNBcnJheShwYXJhbXMuc3BsYXQpID8gcGFyYW1zLnNwbGF0W3NwbGF0SW5kZXgrK10gOiBwYXJhbXMuc3BsYXQ7XG5cbiAgICAgICEocGFyYW1WYWx1ZSAhPSBudWxsIHx8IHBhcmVuQ291bnQgPiAwKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdNaXNzaW5nIHNwbGF0ICMlcyBmb3IgcGF0aCBcIiVzXCInLCBzcGxhdEluZGV4LCBwYXR0ZXJuKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG5cbiAgICAgIGlmIChwYXJhbVZhbHVlICE9IG51bGwpIHBhdGhuYW1lICs9IGVuY29kZVVSSShwYXJhbVZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHRva2VuID09PSAnKCcpIHtcbiAgICAgIHBhcmVuQ291bnQgKz0gMTtcbiAgICB9IGVsc2UgaWYgKHRva2VuID09PSAnKScpIHtcbiAgICAgIHBhcmVuQ291bnQgLT0gMTtcbiAgICB9IGVsc2UgaWYgKHRva2VuLmNoYXJBdCgwKSA9PT0gJzonKSB7XG4gICAgICBwYXJhbU5hbWUgPSB0b2tlbi5zdWJzdHJpbmcoMSk7XG4gICAgICBwYXJhbVZhbHVlID0gcGFyYW1zW3BhcmFtTmFtZV07XG5cbiAgICAgICEocGFyYW1WYWx1ZSAhPSBudWxsIHx8IHBhcmVuQ291bnQgPiAwKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdNaXNzaW5nIFwiJXNcIiBwYXJhbWV0ZXIgZm9yIHBhdGggXCIlc1wiJywgcGFyYW1OYW1lLCBwYXR0ZXJuKSA6IGludmFyaWFudChmYWxzZSkgOiB2b2lkIDA7XG5cbiAgICAgIGlmIChwYXJhbVZhbHVlICE9IG51bGwpIHBhdGhuYW1lICs9IGVuY29kZVVSSUNvbXBvbmVudChwYXJhbVZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGF0aG5hbWUgKz0gdG9rZW47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhdGhuYW1lLnJlcGxhY2UoL1xcLysvZywgJy8nKTtcbn0iXX0=