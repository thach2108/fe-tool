var Services = (function($) {
  var _is = function(selecter) {
    return $(selecter).length != 0;
  };



  return {
    is: _is
  };

}(jQuery));
