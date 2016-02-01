

// var portalForSearch;

(function () {
    'use strict';
    var locationPath = "/";

    define('angular', function () {
        if (angular) {
            return angular;
        }
        return {};
    });

    require({
        async: true,
        //aliases: [['text', 'dojo/text']],
        packages: [{
            name: 'controllers',
            location: locationPath + 'js/controllers'
        },
        {
            name: 'lib',
            location: locationPath + 'js/lib'
        },
        {
            name: 'js',
            location: locationPath + 'js'
        }
      /*   ,
        {
            name: 'Geocoder',
            location: locationPath + 'js/lib/L.Control.Geocoder'
        }
        {
            name: 'bootstrap',
            location: locationPath + 'js'
        }
         */
        // ,
        // {
            // name: 'dojo',
            // location: '//ajax.googleapis.com/ajax/libs/dojo/1.9.3/'
        // }
        ]
    });

    require([
        "dojo",
        "dojo/domReady",
        "esri/arcgis/Portal",
        'js/lib/AgoNewWindowConfig',
        'js/bootstrap',
        'js/lib/GeoCoder',
        'js/lib/MapHosterLeaflet',
        'js/lib/MapHosterGoogle',
        'js/lib/MapHosterArcGIS',
        'js/lib/Modal311',
        'js/lib/fsm',
        'js/lib/utils'
    // ], function(dojo, domReady, esriPortal, bootstrap, modal311) {
    ], function(dojo, domReady, esriPortal, AgoNewWindowConfig, bootstrap ) {
        console.debug('call ready');
        console.log(bootstrap);
        console.log('AgoNewWindowConfig initialization');
        AgoNewWindowConfig.showConfigDetails('MasherApp startup before modifying default settings');

        console.log("before domready, url is " + location.search);
        console.log("before domready, href is " + location.href);
        AgoNewWindowConfig.setLocationPath(location.origin + location.pathname);
        AgoNewWindowConfig.setSearch(location.search);

        if(location.search == ''){
            AgoNewWindowConfig.setInitialUserStatus(true);
            AgoNewWindowConfig.setprotocol(location.protocol);
            AgoNewWindowConfig.sethost(location.host);
            AgoNewWindowConfig.sethostport(location.port);
            AgoNewWindowConfig.setReferrerId(-99);
        }
        else{
            AgoNewWindowConfig.setprotocol(location.protocol);
            AgoNewWindowConfig.sethost(location.host);
            AgoNewWindowConfig.sethostport(location.port);
            var referrerId = AgoNewWindowConfig.getReferrerIdFromUrl(); // sets id in config object
            var referrerName = AgoNewWindowConfig.getReferrerNameFromUrl(); // sets id in config object
            // AgoNewWindowConfig.setUserId(referrerId);
            AgoNewWindowConfig.setInitialUserStatus(false);
            var channel = AgoNewWindowConfig.getChannelFromUrl();
            if(channel != ''){
              AgoNewWindowConfig.setChannel(channel);
              AgoNewWindowConfig.setNameChannelAccepted(true);
            }
            AgoNewWindowConfig.setStartupView(false, false);
            console.log("AGONEWWINDOWCONFIG.SETSTARTUPVIEW")
        }
        // console.log("userId " + AgoNewWindowConfig.getUserId() + " referrerId " + AgoNewWindowConfig.getReferrerId());
        console.log("is Initial User ? " + AgoNewWindowConfig.getInitialUserStatus());
        AgoNewWindowConfig.sethref(location.href);
        AgoNewWindowConfig.sethostport(location.port);

        AgoNewWindowConfig.showConfigDetails('MasherApp startup after modifying default settings');
        domReady(function () {
            var portal, portalUrl = document.location.protocol + '//www.arcgis.com';
            portal = new esri.arcgis.Portal(portalUrl);
            var portalForSearch = portal;
            console.info('start the bootstrapper');
            console.debug(bootstrap);
            //readyForSearchGrid(portal);
            // readyForSearchGridMap(portal);
            bootstrap.start(portalForSearch);
        });
    });

}).call(this);
