(()=>{
    angular.module('myApp')
        .service('menuService',menuService)
        .service('popupService',popupService)
        .service('parseDataService',parseDataService)
        .service('setCSS',setCSS);

        function menuService($http,$q) {

            const vm = this;

            vm.online = true;
            vm.offline = true;

            vm.setView = (boolOne,boolTwo) => {
                vm.online = boolOne;
                vm.offline = boolTwo;
            }
        }

        function popupService(){
            // this service is being injected into two instances of the popup controller to communicate via ng show values
            const vm = this;

            vm.showMe = false;

            vm.showPopup = (bool) => {
                vm.showMe = bool;
            }
        }

        function parseDataService(getTwitchData, $q) {

            const vm = this;
            const promises = getTwitchData.async();

        /*
         * Arrays to hows parsed card data used in templates
        */
            vm.channels = {
                online: [],
                offline: []
            }

        /*
         * Map and request stream and or channel for each
        */
            let P = $q.all(promises).then( response => {
                response.map( vm.checkOnline );
            }, reason => {
                console.log( 'default request failed', reason);
            });

            vm.checkOnline = obj => {
                const {data:{message:msg}} = obj;
                // if error
                if (msg) { return { valid:false, msg } }
                // destructure object
                const { data, data: {stream} } = obj;
                // if online
                if (stream) {
                    const { channel } = stream,
                    { display_name:name, game , status } = channel,
                     parsedInfo = vm.setDataOnline(stream);
                     vm.channels.online.push(parsedInfo);
                     return {valid:true} ;
                  }
                else {
                    // if offline
                    const {_links:{channel:url}} = data;
                    return getTwitchData.getChannel(url)
                        .then( data => {
                            // Parese Data for cards
                            const parsedInfo = vm.setDataOffline(data.data);
                            if ( !checkDuplicates(parsedInfo) ){
                                vm.channels.offline.push(parsedInfo);
                                return { valid:true };
                            } else {
                                return { duplicate:true };
                            }
                        });
                }
            }

            /*
             * Parse Data and Set To Cards Variable
            */
            vm.setDataOffline = data => {
                // channel object later used for ng repeat
                let ci = SetDataBoth(data);
                ci.live = false;
                ci.game = 'Offline';
                ci.frontAction = 'Go to channel';
                return ci;
            }
            vm.setDataOnline = stream => {
                // channel object later used for ng repeat
                const { channel, live, game, viewers, preview:{large} } = stream;

                let ci = SetDataBoth(channel);

                ci.live = true;
                ci.game = game;
                ci.viewers = abbreviateNumber(viewers);
                console.log('live viewers',ci.viewers);
                ci.previewImg = large;
                ci.strmDscr = concatDscr(status);
                ci.frontAction = 'Watch Now';
                return ci;
            }
            function SetDataBoth(channel){
                // channel object later used for ng repeat
                const { display_name:name, followers, url, status } = channel;
                // construct object using const variables above
                return {
                    name,
                    followers: abbreviateNumber(followers),
                    url,
                    status: concatDscr(status)
                };
            }

            /*
             * Check for Duplicates
            */
            function checkDuplicates( parsedData ) {
                let match = false;

                const {name} = parsedData;
                const {online, offline} = vm.channels;
                const allChannels = online.concat(offline);

                allChannels.map(function compare( newChannelObj ) {
                    const {name:existingName} = newChannelObj;
                    if(name.toLowerCase() === existingName.toLowerCase()) {
                        match = true;
                    }
                });


                return match;
            }


            /*
             * further manipulate certain data...
             */
            // abbreviate number
            function abbreviateNumber(value) {
                var newValue = value.toString();

                if (value >= 1000){
                    if ( value < 1000000 ){
                        return `${Math.floor(newValue / 1000)}k`;
                    }
                    else {
                        let n = newValue / 1000000;
                        let s = n.toString();
                        n = `${s.slice(0, s.indexOf('.')+2)}m`;
                        if(n.slice(2,-1) === '0'){
                            return `${n.slice(0,1)}m`;
                        } else return n;
                    }
                }
                return newValue;
            }
            // concat the status
            function concatDscr(str) {
                if (str === null) {return ''}
                return  `${str.slice(0,30)} ...`;
            }
        }
        function setCSS() {
            const vm = this;
            const page = $(".pageContent");

            vm.bind = function() {
                $( window ).resize( vm.checkPageWidth );
            }

            vm.checkPageWidth = function() {
                const pWidth = window.innerWidth;
                console.log(pWidth);

                if (pWidth > 414) {
                  console.log('not mobile ');
                  page.css({
                      width:`${pWidth - 200}px`
                  });
                } else {
                  page.css({
                      "width":"100%"
                  });
                }
            }
        }
})();
