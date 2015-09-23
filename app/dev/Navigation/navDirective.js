(function(){
    angular.module('myApp')
        .directive('navDir', ['$timeout','$interval','setGridSystem',navDir]);

        function navDir($timeout,$interval, setGridSystem) {
            return {
                templateUrl: 'app/build/partials/nav.html',
                controller: 'navController',
                link: function(scope,element,attr) {

                  var tabAll = element.find('#tab-all'),
                      tabOnline = element.find("#tab-online"),
                      tabOffline = element.find("#tab-offline");

                  init('all'); //starting tab to show
                  scope.setGrid = setGridSystem;
                  function init(str){
                    scope.activeTab = str;
                  }

                  tabAll.bind('click', function(){
                    setGridSystem.setMargins()
                    scope.activeTab = 'all';
                    scope.$apply();
                  });
                  tabOnline.bind('click', function(){
                    setGridSystem.setMargins()
                    scope.activeTab = 'online';
                    scope.$apply();
                  });
                  tabOffline.bind('click', function(){
                    setGridSystem.setMargins()
                    scope.activeTab = 'offline';
                    scope.$apply();
                  });

                }
            }
        }

})();
