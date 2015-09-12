(() => {
    angular.module('myApp')
        .controller('popupController', popupController)
        .directive('addcardDir', addcardDir );

        function popupController($scope, popupService, getTwitchData, parseDataService) {
            const vm = this;
            vm.service = popupService;
            vm.showPopup = popupService.showPopup;

            // passing input value to service to make httpRequest
            vm.makeRequest = stream => {
                if (stream.length > 1 ) {
                    getTwitchData.getStream( stream )
                        .then(response => {
                            parseDataService.checkOnline( response )
                            console.log(stream);
                            vm.userText="";
                        })
                }
            }
        }

        function addcardDir() {

            return {
                controller: 'popupController',
                controllerAs: "card",
                templateUrl: 'partials/addCard.html',
                link: (scope, element, attr, ctrl) => {

                }
            }
        }
})()
