(function() {
    angular.module('myApp')
      .directive('navDir', ['$timeout', '$interval', 'setCardButton', 'parseDataService', navDir]);

    function navDir($timeout, $interval, setCardButton, parseDataService ) {
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
            scope.activeTab = 'all';
            scope.$apply();
          });
        tabOnline.bind('click', function() {
          scope.activeTab = 'online';
          scope.$apply();
        });
        tabOffline.bind('click', function() {
          scope.activeTab = 'offline';
          scope.$apply();
        });

      }
    }
  }

})();
