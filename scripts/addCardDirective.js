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
                            let ret = parseDataService.checkOnline( response );
                            vm.userText="";
                            if( ret === true ) {
                                animateSuccessResponse();
                            } else {
                                console.log(ret);
                                animateErrorResponse(stream);
                            }
                        }, reason => {
                            console.log(`${stream} not a valid channel`);
                            vm.userText="";
                            animateErrorResponse(stream);
                        });
                }
            }
            // animate check icon but allow it to be called multiple times
            function animateSuccessResponse() {
                vm.resultText = 'Channel Added';
                const check = document.getElementById('poly-check');
                const newCheck = check.cloneNode(true);

                check.classList.add('check-active');
                // 400 ms after animation finishes replace it with the original
                const timeout = window.setTimeout(() => {
                    check.parentNode.replaceChild(newCheck, check);
                    vm.resultText = "";
                    $scope.$apply();
                }, 1500);

            }
            // animate x icon but allow it to be called multiple timesx
            function animateErrorResponse ( enteredString ){
                vm.resultText = `'${enteredString}' not valid.`
                const xPaths = document.querySelectorAll('#xOne, #xTwo');
                const group = document.getElementById('x-group');
                const newGroup = group.cloneNode(true);

                const array = [ xPaths[0], xPaths[1] ];

                // give each path an active class;
                array.map( elem => {
                    elem.classList.add('x-active')
                });

                const timeout = window.setTimeout(()=>{
                    group.parentNode.replaceChild(newGroup,group);
                    vm.resultText = "";
                    $scope.$apply();
                }, 1500);

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
