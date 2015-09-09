(function() {
    angular.module('myApp', ["ngAnimate","factories"])
        .controller('slider', slider);

        function slider($scope) {

            btn = $(".slide-btn");
            grid = $('.live-card-grid');

            btn.bind('click', function(){
                console.log('should move');
                slideRight();

            })

            var distance = 1320;
            var slideCounter = distance;

            function slideRight() {
                grid.css({
                    "transform":"translateX(-"+slideCounter+"px)"
                });
                slideCounter+= distance;
            }

        }


})()
