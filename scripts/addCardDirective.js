(() => {
    angular.module('myApp')
        .controller('popupController', popupController)
        .directive('addcardDir', addcardDir );

        function popupController($scope, popupService, getTwitchData, parseDataService, $q) {
            const vm = this;
            vm.service = popupService;
            vm.showPopup = popupService.showPopup;

            vm.checkEnter = (event, input) => {
                if (event.charCode === 13 ) {
                    vm.makeRequest(input);
                }
            }


            // passing input value to service to make httpRequest
            vm.makeRequest = stream => {
                if (stream.length > 1 ) {
                    getTwitchData.getStream( stream )
                        .then(response => {
                            vm.userText="";
                            const res = parseDataService.checkOnline(response);
                            // this response needs to be a promise even if...
                            // the response is not; i.e if stream is online;
                            $q.when(res).then(function(data){
                                if (data.duplicate) {
                                    animateErrorResponse(stream, data);
                                }
                                if (data.valid){
                                    animateSuccessResponse();
                                } else {
                                    animateErrorResponse(stream, data);
                                }
                            })
                        }, reason => {
                            console.log(`${stream} not a valid channel`);
                            vm.userText="";
                            animateErrorResponse(stream, returnedObj);
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
            function animateErrorResponse ( enteredString, reason ){
                if(reason.duplicate) {
                    vm.resultText = `"${enteredString}" Already Added.`;
                } else if (!reason.valid) {
                    vm.resultText = `"${enteredString}" not valid.`;
                }

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
