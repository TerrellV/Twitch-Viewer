'use strict';

(function () {
    angular.module('myApp').controller('popupController', popupController).directive('addcardDir', addcardDir);

    function popupController($scope, popupService, getTwitchData, parseDataService) {
        var vm = this;
        vm.service = popupService;
        vm.showPopup = popupService.showPopup;

        // passing input value to service to make httpRequest
        vm.makeRequest = function (stream) {
            if (stream.length > 1) {
                getTwitchData.getStream(stream).then(function (response) {
                    var ret = parseDataService.checkOnline(response);
                    vm.userText = "";
                    if (ret === true) {
                        animateSuccessResponse();
                    } else {
                        console.log(ret);
                        animateErrorResponse(stream);
                    }
                }, function (reason) {
                    console.log(stream + ' not a valid channel');
                    vm.userText = "";
                    animateErrorResponse(stream);
                });
            }
        };
        // animate check icon but allow it to be called multiple times
        function animateSuccessResponse() {
            vm.resultText = 'Channel Added';
            var check = document.getElementById('poly-check');
            var newCheck = check.cloneNode(true);

            check.classList.add('check-active');
            // 400 ms after animation finishes replace it with the original
            var timeout = window.setTimeout(function () {
                check.parentNode.replaceChild(newCheck, check);
                vm.resultText = "";
                $scope.$apply();
            }, 1500);
        }
        // animate x icon but allow it to be called multiple timesx
        function animateErrorResponse(enteredString) {
            vm.resultText = '\'' + enteredString + '\' not valid.';
            var xPaths = document.querySelectorAll('#xOne, #xTwo');
            var group = document.getElementById('x-group');
            var newGroup = group.cloneNode(true);

            var array = [xPaths[0], xPaths[1]];

            // give each path an active class;
            array.map(function (elem) {
                elem.classList.add('x-active');
            });

            var timeout = window.setTimeout(function () {
                group.parentNode.replaceChild(newGroup, group);
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
            link: function link(scope, element, attr, ctrl) {}
        };
    }
})();
//# sourceMappingURL=addCardDirective.js.map
