(()=>{
    angular.module('myApp')
        .service('menuService',menuService)
        .service('popupService',popupService)
        .service('setCSS',setCSS)
        .service('parseDataService',['getTwitchData','$q','setCardButton',parseDataService])
        .service('setRandomCover',setRandomCover);

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

        function parseDataService(getTwitchData, $q, setCardButton) {
            const vm = this;
            const promises = getTwitchData.async();
        /*
         * Arrays to hows parsed card data used in templates
        */
            vm.channels = {
                online: [],
                offline: []
            }

            vm.deleteChannel = function(ch,obj) {
              const chArr = vm.channels[ch];
              const chIndex = chArr.indexOf(obj);
              chArr.splice(chIndex,1);
            }

        /*
         * Map and request stream and or channel for each
        */
            vm.p = $q.all(promises).then( response => {
              let domSet = new Promise(function(res,rej){
                res( response.map( vm.checkOnline ) );
              }).then(function(){
                setCardButton.centerButton()
              })
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
                     const isDuplicate = checkDuplicates(parsedInfo);
                     if( isDuplicate ) {
                       return { duplicate:true };
                     }

                     vm.channels.online.push(parsedInfo);
                     return { valid:true };
                  }
                else {
                    // if offline
                    const {_links:{channel:url}} = data;
                    return getTwitchData.getChannel(url)
                        .then( data => {
                            // Parese Data for cards
                            const parsedInfo = vm.setDataOffline(data.data);
                            if ( checkDuplicates(parsedInfo) === false ){
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
                ci.game = concatDscr(game,20);
                ci.viewers = abbreviateNumber(viewers);
                ci.previewImg = setHttpProtocal(large);
                ci.frontAction = 'Watch Now';
                return ci;
            }
            function SetDataBoth(channel){
                // channel object later used for ng repeat
                const { display_name:name, followers, url, status } = channel;
                return {
                    name,
                    followers: abbreviateNumber(followers),
                    url,
                    status: concatDscr(status,20)
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

                allChannels.map(compare);

                function compare( newChannelObj ) {
                    const {name:existingName} = newChannelObj;
                    if(name.toLowerCase() === existingName.toLowerCase()) {
                        match = true;
                    }
                }

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
          function concatDscr(str,cutoff) {
              if (str === null) {return ''};
              return (str.length > cutoff )? `${str.slice(0,cutoff)} ...`: str;
          }

        }


        function setCSS() {
          const vm = this;
          const page = $(".pageContent");
          const search = $(".search-container");

          vm.bind = function() {
            $( window ).resize( vm.checkPageWidth );
          }

          vm.checkPageWidth = function() {

            const pWidth = window.innerWidth;
            const pHeight = window.innerHeight;

            if (pWidth > 414) {
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
        function setHttpProtocal(str){
          return str.replace(/(https?:){1}/,window.location.protocol);
        }
        function setRandomCover() {
          const vm = this;
          vm.get = () => {
            const options = ["Images/astroSpace.jpg","Images/csGO.jpg", "Images/marioIsland.jpg", "Images/LoL.jpg"];
            const n = Math.floor(Math.random() * options.length);
            return options[n];
          }
        }
})();
