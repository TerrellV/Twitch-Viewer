(function() {
    angular.module('myApp')
      .directive('navDir', ['$timeout', '$interval', 'setGridSystem', 'parseDataService', navDir]);

    function navDir($timeout, $interval, setGridSystem, parseDataService ) {
      return {
        templateUrl: 'app/build/partials/nav.html',
        controller: 'navController',
        link: function(scope, element, attr) {

          var tabAll = element.find('#tab-all'),
            tabOnline = element.find("#tab-online"),
            tabOffline = element.find("#tab-offline");

          init('all'); //starting tab to show

          function init(str) {
            scope.activeTab = str;
            const loadCh = parseDataService;
          }

          tabAll.bind('click', function() {
            window.setTimeout(setGridSystem.setMargins, 1);
            scope.activeTab = 'all';
            scope.$apply();
          });
        tabOnline.bind('click', function() {
          window.setTimeout(setGridSystem.setMargins, 1);
          scope.activeTab = 'online';
          scope.$apply();
        });
        tabOffline.bind('click', function() {
          window.setTimeout(setGridSystem.setMargins, 1);
          scope.activeTab = 'offline';
          scope.$apply();
        });

      }
    }
  }

})();
