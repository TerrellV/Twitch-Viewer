(() => {
    angular.module('myApp')
        .controller('popupController', ['$scope', 'popupService', 'getTwitchData', 'parseDataService', '$q', popupController])
        .directive('addcardDir',addcardDir );

        function popupController($scope, popupService, getTwitchData, parseDataService, $q) {
            const vm = this;
            vm.service = popupService;
            vm.showPopup = popupService.showPopup;
            vm.instructionText = "start typing...";
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
                            animateErrorResponse(stream, reason);
                        });
                }
            }
            // animate check icon but allow it to be called multiple times
            function animateSuccessResponse() {
                vm.instructionText = 'Channel Added';
                const check = document.getElementById('poly-check');
                const newCheck = check.cloneNode(true);
                const addIcon = document.getElementById('add-svg-icon');

                addIcon.style.opacity = "0";

                check.classList.add('check-active');
                // 400 ms after animation finishes replace it with the original
                const timeout = window.setTimeout(() => {
                    check.parentNode.replaceChild(newCheck, check);
                    vm.resultText = "";
                    vm.instructionText = "start typing...";
                    addIcon.style.opacity = "1";
                    $scope.$apply();
                }, 2500);

            }
            // animate x icon but allow it to be called multiple timesx
            function animateErrorResponse ( enteredString, reason ){
                if(reason.duplicate) {
                    vm.instructionText = `already added.`;
                } else if (!reason.valid) {
                    vm.instructionText = `not a channel`;
                }

                // add the class to all of them and set a delay for each...

                const errorIcon = document.getElementById('error-icon');
                const children = errorIcon.children;
                const newGroup = errorIcon.cloneNode(true);
                const addIcon = document.getElementById('add-svg-icon');

                addIcon.style.opacity = "0";

                for (let i = 0; i < children.length; i++) {
                  children[i].classList.add('error-active');
                }

                const timeout = window.setTimeout(()=>{
                    addIcon.style.opacity = "1";
                    errorIcon.parentNode.replaceChild(newGroup,errorIcon);
                    vm.resultText = "";
                    vm.instructionText = "start typing...";
                    $scope.$apply();
                }, 2500);

            }
        }

        function addcardDir() {

            return {
                controller: 'popupController',
                controllerAs: "card",
                templateUrl: 'app/build/partials/addCard.html',
                link: (scope, element, attr, ctrl) => {

                }
            }
        }
})();
