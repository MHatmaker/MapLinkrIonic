
/*global define */

define([
    //'angular  ',
    // 'lib/ionic/js/angular/angular-animate',
    'controllers/MasherCtrl',
    'controllers/TabsCtrl',
    'controllers/SPACtrl',
    'controllers/PositionViewCtrl',
    'controllers/MapCtrl',
    'controllers/VerbageCtrl',
    'controllers/WebSiteDescriptionCtrl',
    'controllers/SearcherCtrlGrp',
    'controllers/SearcherCtrlMap',
    'controllers/StompSetupCtrl',
    'controllers/DestWndSetupCtrl',
    'controllers/TransmitNewUrlCtrl',
    'controllers/EmailCtrl',
    'controllers/GoogleSearchDirective',
    'lib/GeoCoder',
    'lib/AgoNewWindowConfig'
    // '$http'
],
    function (MasherCtrl, TabsCtrl, SPACtrl, PositionViewCtrl, MapCtrl, VerbageCtrl,
        WebSiteDescriptionCtrl,
        SearcherCtrlGrp, SearcherCtrlMap, StompSetupCtrl, DestWndSetupCtrl, TransmitNewUrlCtrl,
        EmailCtrl, GoogleSearchDirective, GeoCoder, AgoNewWindowConfig, $http) {
        "use strict";
        console.debug('AppController define');

        function AppController($scope, $injector) {
            console.log("AppController empty block");
        }
/*
        function getUserId($http) {
            $http({method: 'GET', url: '/userid'}).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available.
                    console.log('userid: ', data.id);
                    AgoNewWindowConfig.setUserId(data.id);
                    var refId = AgoNewWindowConfig.getReferrerId();
                    if (refId === -99) {
                        AgoNewWindowConfig.setReferrerId(data.id);
                    }
                }).
                error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    console.log('Oops and error', data);
                    alert('Oops' + data.name);
                });
        }
*/
        function init(App, portalForSearch) {
            console.log('AppController init');
            console.debug(App);
            // var cb = App._configBlocks;
            // var cb0 = cb[0];
            // console.debug(cb0);
            // var cb01 = cb0[0];
            // console.debug(cb01);
            //
            // var $inj = cb01; //App._configBlocks[0][0],
            // var $inj = angular.injector(App); //['app']),
            //     $http = $inj.get('$http'),
            //     referrerId = AgoNewWindowConfig.getReferrerId(),
            //     urlUserName;

            // console.log("Check if referrerId is -99");
            // if (referrerId === -99) {
            //     getUserName($http, {uname : true, uid : true, refId : referrerId === -99});
            // } else {
            //     urlUserName = AgoNewWindowConfig.getUserNameFromUrl();
            //     // AgoNewWindowConfig.getReferrerIdFromUrl();
            //     if (urlUserName) {
            //         getUserName($http, {uname : false, uid : true, refId : referrerId === -99});
            //     } else {
            //         getUserName($http, {uname : true, uid : true, refId : referrerId === -99});
            //     }
            //
            // }


            WebSiteDescriptionCtrl.start(App);
            MasherCtrl.start(App);
            TabsCtrl.start(App);
            SPACtrl.start(App);
            PositionViewCtrl.start(App);
            // MapCtrl.start(App);

            VerbageCtrl.start(App);
            SearcherCtrlGrp.start(App, portalForSearch);
            SearcherCtrlMap.start(App, portalForSearch);
            if (StompSetupCtrl.isInitialized() === false) {
                StompSetupCtrl.start(App);
            }
            if (DestWndSetupCtrl.isInitialized() === false) {
                DestWndSetupCtrl.start(App);
            }
            TransmitNewUrlCtrl.start(App);
            EmailCtrl.start(App);
            GoogleSearchDirective.start(App);
            // LinkerDisplayDirective.start(App);
            // MapMaximizerDirective.start(App);
            MapCtrl.start(App);
            GeoCoder.start(App, $http);


            return AppController;
        }

        return { start: init };

    });
