/*global define */
/*global require */
/*global domReady */
/*global esri */

// var portalForSearch;

(function () {
    'use strict';
    var locationPath = "/";

    // define('angular', function () {
    //     if (angular) {
    //         return angular;
    //     }
    //     return {};
    // });

    require({
        async: true,
        //aliases: [['text', '/text']],
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
        // "dojo",
        // "dojo/domReady",
        "esri/arcgis/Portal",
		'ready',
        'js/lib/AgoNewWindowConfig',
        'js/bootstrap'
//        'js/lib/GeoCoder',
        // 'js/lib/MapHosterLeaflet',
        // 'js/lib/MapHosterGoogle',
        // 'js/lib/MapHosterArcGIS',
        // 'js/lib/Modal311',
        // 'js/lib/fsm',
        // 'js/lib/utils'
    // ], function(dojo, domReady, esriPortal, bootstrap, modal311) {
    ], function (esriPortal, ready, AgoNewWindowConfig, bootstrap) {
        var referrerId,
            referrerName,
            channel;
        console.debug('call ready with bootstrap and AgoNewWindowConfig objects');
        console.log(bootstrap);
        console.log(AgoNewWindowConfig);
        console.log('AgoNewWindowConfig initialization');

		AgoNewWindowConfig.showConfigDetails('MasherApp startup before modifying default settings');

        console.log("before domready, url is " + location.search);
        console.log("before domready, href is " + location.href);
        AgoNewWindowConfig.setLocationPath(location.origin + location.pathname);
        AgoNewWindowConfig.setSearch(location.search);

        if (location.search === '') {
            AgoNewWindowConfig.setInitialUserStatus(true);
            AgoNewWindowConfig.setprotocol(location.protocol);
            AgoNewWindowConfig.sethost(location.host);
            AgoNewWindowConfig.sethostport(location.port);
            AgoNewWindowConfig.setReferrerId(-99);
        } else {
            AgoNewWindowConfig.setprotocol(location.protocol);
            AgoNewWindowConfig.sethost(location.host);
            AgoNewWindowConfig.sethostport(location.port);
            referrerId = AgoNewWindowConfig.getFromUrl(); // sets id in config object
            referrerName = AgoNewWindowConfig.getReferrerNameFromUrl(); // sets id in config object
            // AgoNewWindowConfig.setUserId();
            AgoNewWindowConfig.setInitialUserStatus(false);
            channel = AgoNewWindowConfig.getChannelFromUrl();
            if (channel !== '') {
                AgoNewWindowConfig.setChannel(channel);
                AgoNewWindowConfig.setNameChannelAccepted(true);
            }
            AgoNewWindowConfig.setStartupView(false, false);
            console.log("AGONEWWINDOWCONFIG.SETSTARTUPVIEW");
        }
        // console.log("userId " + AgoNewWindowConfig.getUserId() + "  " + AgoNewWindowConfig.getReferrerId());
        console.log("is Initial User ? " + AgoNewWindowConfig.getInitialUserStatus());
        AgoNewWindowConfig.sethref(location.href);
        AgoNewWindowConfig.sethostport(location.port);

        AgoNewWindowConfig.showConfigDetails('MasherApp startup after modifying default settings');
        ready(function () {
            var portal, portalForSearch, portalUrl = document.location.protocol + '//www.arcgis.com';
            portal = new esriPortal.Portal(portalUrl);
            portalForSearch = portal;
            console.info('start the bootstrapper');
            console.debug(bootstrap);
            //readyForSearchGrid(portal);
            // readyForSearchGridMap(portal);
            bootstrap.start(portalForSearch);
        });
    });

}).call(this);
