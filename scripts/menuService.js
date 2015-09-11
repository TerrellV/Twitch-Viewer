(()=>{
    angular.module('myApp')
        .service('menuService',menuService);

        function menuService($http,$q) {

            const menu = this;

            menu.online = true;
            menu.offline = true;

            menu.setView = (boolOne,boolTwo) => {
                menu.online = boolOne;
                menu.offline = boolTwo;
            console.log(menu.online,menu.offline);
            }
        }
})()
