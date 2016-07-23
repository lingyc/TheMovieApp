"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loopAsync = loopAsync;
exports.mapAsync = mapAsync;
function loopAsync(turns, work, callback) {
  var currentTurn = 0,
      isDone = false;
  var sync = false,
      hasNext = false,
      doneArgs = void 0;

  function done() {
    isDone = true;
    if (sync) {
      // Iterate instead of recursing if possible.
      doneArgs = [].concat(Array.prototype.slice.call(arguments));
      return;
    }

    callback.apply(this, arguments);
  }

  function next() {
    if (isDone) {
      return;
    }

    hasNext = true;
    if (sync) {
      // Iterate instead of recursing if possible.
      return;
    }

    sync = true;

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false;
      work.call(this, currentTurn++, next, done);
    }

    sync = false;

    if (isDone) {
      // This means the loop finished synchronously.
      callback.apply(this, doneArgs);
      return;
    }

    if (currentTurn >= turns && hasNext) {
      isDone = true;
      callback();
    }
  }

  next();
}

function mapAsync(array, work, callback) {
  var length = array.length;
  var values = [];

  if (length === 0) return callback(null, values);

  var isDone = false,
      doneCount = 0;

  function done(index, error, value) {
    if (isDone) return;

    if (error) {
      isDone = true;
      callback(error);
    } else {
      values[index] = value;

      isDone = ++doneCount === length;

      if (isDone) callback(null, values);
    }
  }

  array.forEach(function (item, index) {
    work(item, index, function (error, value) {
      done(index, error, value);
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9yZWFjdC1yb3V0ZXIvZXM2L0FzeW5jVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0IsUyxHQUFBLFM7UUFxREEsUSxHQUFBLFE7QUFyRFQsU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLElBQTFCLEVBQWdDLFFBQWhDLEVBQTBDO0FBQy9DLE1BQUksY0FBYyxDQUFsQjtBQUFBLE1BQ0ksU0FBUyxLQURiO0FBRUEsTUFBSSxPQUFPLEtBQVg7QUFBQSxNQUNJLFVBQVUsS0FEZDtBQUFBLE1BRUksV0FBVyxLQUFLLENBRnBCOztBQUlBLFdBQVMsSUFBVCxHQUFnQjtBQUNkLGFBQVMsSUFBVDtBQUNBLFFBQUksSUFBSixFQUFVO0FBQ1I7QUFDQSxpQkFBVyxHQUFHLE1BQUgsQ0FBVSxNQUFNLFNBQU4sQ0FBZ0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsU0FBM0IsQ0FBVixDQUFYO0FBQ0E7QUFDRDs7QUFFRCxhQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCO0FBQ0Q7O0FBRUQsV0FBUyxJQUFULEdBQWdCO0FBQ2QsUUFBSSxNQUFKLEVBQVk7QUFDVjtBQUNEOztBQUVELGNBQVUsSUFBVjtBQUNBLFFBQUksSUFBSixFQUFVO0FBQ1I7QUFDQTtBQUNEOztBQUVELFdBQU8sSUFBUDs7QUFFQSxXQUFPLENBQUMsTUFBRCxJQUFXLGNBQWMsS0FBekIsSUFBa0MsT0FBekMsRUFBa0Q7QUFDaEQsZ0JBQVUsS0FBVjtBQUNBLFdBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsYUFBaEIsRUFBK0IsSUFBL0IsRUFBcUMsSUFBckM7QUFDRDs7QUFFRCxXQUFPLEtBQVA7O0FBRUEsUUFBSSxNQUFKLEVBQVk7QUFDVjtBQUNBLGVBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsUUFBckI7QUFDQTtBQUNEOztBQUVELFFBQUksZUFBZSxLQUFmLElBQXdCLE9BQTVCLEVBQXFDO0FBQ25DLGVBQVMsSUFBVDtBQUNBO0FBQ0Q7QUFDRjs7QUFFRDtBQUNEOztBQUVNLFNBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QixJQUF6QixFQUErQixRQUEvQixFQUF5QztBQUM5QyxNQUFJLFNBQVMsTUFBTSxNQUFuQjtBQUNBLE1BQUksU0FBUyxFQUFiOztBQUVBLE1BQUksV0FBVyxDQUFmLEVBQWtCLE9BQU8sU0FBUyxJQUFULEVBQWUsTUFBZixDQUFQOztBQUVsQixNQUFJLFNBQVMsS0FBYjtBQUFBLE1BQ0ksWUFBWSxDQURoQjs7QUFHQSxXQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DO0FBQ2pDLFFBQUksTUFBSixFQUFZOztBQUVaLFFBQUksS0FBSixFQUFXO0FBQ1QsZUFBUyxJQUFUO0FBQ0EsZUFBUyxLQUFUO0FBQ0QsS0FIRCxNQUdPO0FBQ0wsYUFBTyxLQUFQLElBQWdCLEtBQWhCOztBQUVBLGVBQVMsRUFBRSxTQUFGLEtBQWdCLE1BQXpCOztBQUVBLFVBQUksTUFBSixFQUFZLFNBQVMsSUFBVCxFQUFlLE1BQWY7QUFDYjtBQUNGOztBQUVELFFBQU0sT0FBTixDQUFjLFVBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QjtBQUNuQyxTQUFLLElBQUwsRUFBVyxLQUFYLEVBQWtCLFVBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QjtBQUN4QyxXQUFLLEtBQUwsRUFBWSxLQUFaLEVBQW1CLEtBQW5CO0FBQ0QsS0FGRDtBQUdELEdBSkQ7QUFLRCIsImZpbGUiOiJBc3luY1V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGxvb3BBc3luYyh0dXJucywgd29yaywgY2FsbGJhY2spIHtcbiAgdmFyIGN1cnJlbnRUdXJuID0gMCxcbiAgICAgIGlzRG9uZSA9IGZhbHNlO1xuICB2YXIgc3luYyA9IGZhbHNlLFxuICAgICAgaGFzTmV4dCA9IGZhbHNlLFxuICAgICAgZG9uZUFyZ3MgPSB2b2lkIDA7XG5cbiAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICBpc0RvbmUgPSB0cnVlO1xuICAgIGlmIChzeW5jKSB7XG4gICAgICAvLyBJdGVyYXRlIGluc3RlYWQgb2YgcmVjdXJzaW5nIGlmIHBvc3NpYmxlLlxuICAgICAgZG9uZUFyZ3MgPSBbXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgaWYgKGlzRG9uZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGhhc05leHQgPSB0cnVlO1xuICAgIGlmIChzeW5jKSB7XG4gICAgICAvLyBJdGVyYXRlIGluc3RlYWQgb2YgcmVjdXJzaW5nIGlmIHBvc3NpYmxlLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN5bmMgPSB0cnVlO1xuXG4gICAgd2hpbGUgKCFpc0RvbmUgJiYgY3VycmVudFR1cm4gPCB0dXJucyAmJiBoYXNOZXh0KSB7XG4gICAgICBoYXNOZXh0ID0gZmFsc2U7XG4gICAgICB3b3JrLmNhbGwodGhpcywgY3VycmVudFR1cm4rKywgbmV4dCwgZG9uZSk7XG4gICAgfVxuXG4gICAgc3luYyA9IGZhbHNlO1xuXG4gICAgaWYgKGlzRG9uZSkge1xuICAgICAgLy8gVGhpcyBtZWFucyB0aGUgbG9vcCBmaW5pc2hlZCBzeW5jaHJvbm91c2x5LlxuICAgICAgY2FsbGJhY2suYXBwbHkodGhpcywgZG9uZUFyZ3MpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChjdXJyZW50VHVybiA+PSB0dXJucyAmJiBoYXNOZXh0KSB7XG4gICAgICBpc0RvbmUgPSB0cnVlO1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH1cblxuICBuZXh0KCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBBc3luYyhhcnJheSwgd29yaywgY2FsbGJhY2spIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiBjYWxsYmFjayhudWxsLCB2YWx1ZXMpO1xuXG4gIHZhciBpc0RvbmUgPSBmYWxzZSxcbiAgICAgIGRvbmVDb3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gZG9uZShpbmRleCwgZXJyb3IsIHZhbHVlKSB7XG4gICAgaWYgKGlzRG9uZSkgcmV0dXJuO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICBpc0RvbmUgPSB0cnVlO1xuICAgICAgY2FsbGJhY2soZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG5cbiAgICAgIGlzRG9uZSA9ICsrZG9uZUNvdW50ID09PSBsZW5ndGg7XG5cbiAgICAgIGlmIChpc0RvbmUpIGNhbGxiYWNrKG51bGwsIHZhbHVlcyk7XG4gICAgfVxuICB9XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHtcbiAgICB3b3JrKGl0ZW0sIGluZGV4LCBmdW5jdGlvbiAoZXJyb3IsIHZhbHVlKSB7XG4gICAgICBkb25lKGluZGV4LCBlcnJvciwgdmFsdWUpO1xuICAgIH0pO1xuICB9KTtcbn0iXX0=