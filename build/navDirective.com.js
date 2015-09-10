'use strict';

(function () {
  angular.module('myApp').directive('navDir', ['$timeout', '$interval', navDir]);

  function navDir() {
    return {
      templateUrl: '/partials/nav.html',

      link: function link(scope, element, attr) {

        var tabAll = element.find('#tab-all'),
            tabOnline = element.find("#tab-online"),
            tabOffline = element.find("#tab-offline");

        init('all'); //starting tab to show

        function init(str) {
          scope.activeTab = str;
        }

        tabAll.bind('click', function () {
          scope.activeTab = 'all';
          scope.$apply();
        });
        tabOnline.bind('click', function () {
          scope.activeTab = 'online';
          scope.$apply();
        });
        tabOffline.bind('click', function () {
          scope.activeTab = 'offline';
          scope.$apply();
        });
      }
    };
  }
})();
//# sourceMappingURL=navDirective.com.js.map
