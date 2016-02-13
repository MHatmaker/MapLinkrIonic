/*global define */
/*global console */
/*global document */
/*global alert */
/*global location */

define(function () {
    'use strict';
    var selectedMapType = 'arcgis',
        bootstrapFunction = function (angular, ionic, AppController, MasherCtrl, TabsCtrl, AgoNewWindowConfig,
            EmailCtrl, MapCtrl, MapHosterLeaflet, MapHosterGoogle, MapHosterArcGIS) {
            "use strict";
            var init = function (portalForSearch) {
                // var App = angular.module('app', ['ui.bootstrap']);
                console.debug('bootstrap init method');

                // var App = angular.module("app", ['ngRoute', 'ngGrid', 'ui.bootstrap', 'ui.bootstrap.transition', 'ui.bootstrap.collapse', 'ui.bootstrap.accordion', 'ui.bootstrap.modal'])

                var eventDct = {
                    'client-MapXtntEvent' : null,
                    'client-MapClickEvent' : null,
                    'client-NewMapPosition' : null
                },

                    mapRestUrlToType = {
                        'Leaflet': 'leaflet',
                        'GoogleMap' : 'google',
                        'ArcGIS' : 'arcgis'
                    },

                    isNewAgoWindow,
                    maphost,
                    $inj,
                    serv,
                    gmquery,
                    searchService,

                    googleQueryDct = {'query' : null, 'rootScope': null},

                    App = angular.module("app", ['ionic', 'ngRoute', 'ui.bootstrap', 'ngGrid', 'ui.router'])

                    .config(['$routeProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider', '$compile',
                    // .config(['$routeProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider',
                            function ($routeProvider, $locationProvider, $urlRouterProvider, $stateProvider) {
                            console.debug('App module route provider');

                            $routeProvider.
                                when('/', {
                                    templateUrl : 'www/partials/SystemSelector.html',
                                    // templateUrl: '/',
                                    controller : App.MasherCtrl,
                                    reloadOnSearch: true
                                }).
                                when('/partials/agonewwindow/:id',  {
                                    templateUrl: function (params) {
                                        console.log("when string is " + '/partials/agonewwindow/:id');
                                        console.log("params = " + params.id);
                                        console.log("prepare to return " + '/www/partials/agonewwindow' + params.id);
                                        return 'www/partials/agonewwindow' + params.id;
                                    },
                                    controller: App.MasherCtrl,
                                    reloadOnSearch: true
                                }).
                                when('/www/partials/:id',  {
                                    templateUrl: function (params) {
                                        console.log("when string is " + '/www/partials/:id');
                                        console.log(" params.id : " +  params.id);
                                        console.log("prepare to return " + '/www/partials/' + params.id);
                                        return '/www/partials/' + params.id;
                                    },
                                    controller: App.MapCtrl,
                                    reloadOnSearch: true,
                                    disableCache: true
                                }).
                                when('/templates/:id',  {
                                    templateUrl: function (params) {
                                        console.log("when string is " + '/templates/:id');
                                        console.log(" params.id : " +  params.id);
                                        console.log("prepare to return " + '/templates/' + params.id);
                                        return '/templates/' + params.id;
                                    },
                                    controller: App.DestWndSetupCtrl,
                                    reloadOnSearch: true
                                }).
                                when('/contact', {
                                    controller: EmailCtrl
                                }).
                                otherwise({
                                    redirectTo: '/'
                                });

                            $locationProvider.html5Mode(true);
                            console.debug('Here we are at the end of routeProvider logic');

                        }
                        ]).


                    factory("CurrentWebMapIdService", function () {
                        var currentWebMapId = "fooWebMapId";
                        return {
                            setCurrentWebMapId : function (newId) { currentWebMapId = newId; },
                            getCurrentWebMapId : function () { return currentWebMapId; }
                        };
                    }).
                    factory("CurrentMapTypeService", function () {
                        var mapTypes = {
                            'leaflet': MapHosterLeaflet,
                            'google' : MapHosterGoogle,
                            'arcgis' : MapHosterArcGIS
                        },

                            mapRestUrl = {
                                'leaflet': 'Leaflet',
                                'google' : 'GoogleMap',
                                'arcgis' : 'ArcGIS'
                            },

                            currentMapType = 'arcgis',
                            previousMapType = 'arcgis',

                            getMapTypes = function () {
                                var values = Object.keys(mapTypes).map(function (key) {
                                    return {'type' : key, 'mph' : mapTypes[key]};
                                });
                                return values;

                                // var mapTypeValues = [];
                                // for (var key in mapTypes){
                                    // mapTypeValues.push(mapTypes[key]);
                                // return mapTypes;
                            },
                            getMapType = function () {
                                return mapTypes[currentMapType];
                            },
                            getMapTypeKey = function () {
                                return selectedMapType;
                            },
                            getMapRestUrl = function () {
                                return mapRestUrl[selectedMapType];
                            },
                            setMapType = function (mpt) {
                                previousMapType = currentMapType;
                                selectedMapType = mpt;
                                currentMapType = mpt;
                                console.log("selectedMapType set to " + selectedMapType);
                            },
                            getPreviousMapType = function () {
                                return mapTypes[previousMapType];
                            },
                            getSelectedMapType = function () {
                                console.log("getSelectedMapType : " + selectedMapType);
                                return mapTypes[selectedMapType];
                            };
                        return {
                            getMapTypes: getMapTypes,
                            getCurrentMapType : getMapType,
                            setCurrentMapType : setMapType,
                            getPreviousMapType : getPreviousMapType,
                            getSelectedMapType : getSelectedMapType,
                            getMapTypeKey : getMapTypeKey,
                            getMapRestUrl : getMapRestUrl
                        };
                    }).


                    factory("StompEventHandlerService", function () {
                        var getEventDct = function () {
                            return eventDct;
                        },

                            addEvent = function (evt, handler) {
                                eventDct[evt] = handler;
                            },

                            getHandler = function (evt) {
                                return eventDct[evt];
                            };
                        return {
                            getEventDct : getEventDct,
                            addEvent : addEvent,
                            getHandler : getHandler
                        };
                    }).

                    factory("GoogleQueryService", function ($rootScope) {
                        googleQueryDct.rootScope = $rootScope;
                        var getRootScope = function () {
                            return googleQueryDct.rootScope;
                        },
                            getQueryDestinationDialogScope = function (mapsys) {
                                var elemID = mapsys === 'google' ? 'DestWndDialogGoogle' : 'DestWndDialogArcGIS',
                                    e = document.getElementById(elemID),
                                    scope = angular.element(e).scope();
                                return scope;
                            },

                            setDialogVisibility = function (tf) {
                                var e = document.getElementById('Verbage'),
                                    scope = angular.element(e).scope(),
                                    previousVisibility = scope.VerbVis;
                                scope.VerbVis = tf ? 'flex' : 'none';
                                if (tf === false) {
                                    angular.element(e).css({'display' : 'none'});
                                }
                                return previousVisibility;
                            },

                            getQueryDct = function () {
                                return googleQueryDct;
                            },
                            setQuery = function (q) {
                                // alert('setQuery' + q);
                                googleQueryDct.query = q;
                            };
                        return {
                            getQueryDct: getQueryDct,
                            setQuery : setQuery,
                            getQueryDestinationDialogScope : getQueryDestinationDialogScope,
                            setDialogVisibility : setDialogVisibility,
                            getRootScope : getRootScope
                        };
                    }).

                    factory("LinkrService", function ($rootScope) {
                        var lnkrdiv = document.getElementsByClassName('lnkrclass')[0],
                            scope = angular.element(lnkrdiv).scope(),
                            getLinkrScope,
                            hideLinkr;

                        getLinkrScope = function () {
                            return scope;
                        };
                        hideLinkr = function () {
                            var data = {'visibility' : 'none'};

                            scope.$emit('displayLinkerEvent', data);
                        };

                        return {getLinkrScope: getLinkrScope, hideLinkr: hideLinkr};
                    }).

                    factory("ControllerService", function ($rootScope) {
                        var getController = function () {
                            return MapCtrl;
                        };

                        return {getController: getController};
                    });

                App.directive('autoFocus', function ($timeout) {
                    return {
                        restrict: 'AC',
                        link: function (locscope, locelement) {
                            console.log("directive autoFocus");
                            $timeout(function () {
                                locelement[0].focus();
                            }, 0);
                        }
                    };
                });
                App.directive('ngEnter', function () {
                    return function (scope, element, attrs) {
                        element.bind("keydown keypress", function (event) {
                            if (event.which === 13) {
                                scope.$apply(function () {
                                    scope.$eval(attrs.ngEnter);
                                });

                                event.preventDefault();
                            }
                        });
                    };
                });

                function getUserName($http, opts) {
                    $http({method: 'GET', url: '/username'}).
                        success(function (data, status, headers, config) {
                            // this callback will be called asynchronously
                            // when the response is available.
                            console.log('AppController getUserName: ', data.name);
                            // AgoNewWindowConfig.setUserId(data.id );
                            if (opts.uname) {
                                AgoNewWindowConfig.setUserName(data.name);
                            }
                            // alert('got user name ' + data.name);
                            if (opts.uid) {
                                AgoNewWindowConfig.setUserId(data.id);
                            }
                            if (opts.refId === -99) {
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


                AppController.start(App, portalForSearch);
                // need to bootstrap angular since we wait for dojo/DOM to load
                console.log("ready for angular.bootstrap");
                var $inj = angular.bootstrap(document.body, App); //[ionic'app']);
                console.log("ready fo AppController.start");
                // AppController.start(App, portalForSearch);
                // var $inj = angular.injector(App); //['app']),
                var
                    $http = $inj.get('$http'),
                    referrerId = AgoNewWindowConfig.getReferrerId(),
                    urlUserName;

                console.log("Check if referrerId is -99");
                if (referrerId === -99) {
                    getUserName($http, {uname : true, uid : true, refId : referrerId === -99});
                } else {
                    urlUserName = AgoNewWindowConfig.getUserNameFromUrl();
                  // AgoNewWindowConfig.getReferrerIdFromUrl();
                    if (urlUserName) {
                        getUserName($http, {uname : false, uid : true, refId : referrerId === -99});
                    } else {
                        getUserName($http, {uname : true, uid : true, refId : referrerId === -99});
                    }
                }

                console.log("url is " + location.search);
                isNewAgoWindow = AgoNewWindowConfig.testUrlArgs();
                AgoNewWindowConfig.setDestinationPreference('New Pop-up Window');
                if (isNewAgoWindow) {
                    maphost = AgoNewWindowConfig.maphost();
                    console.log('maphost : ' + maphost);

                    $inj = angular.injector(['app']);
                    serv = $inj.get('CurrentMapTypeService');
                    serv.setCurrentMapType(mapRestUrlToType[maphost]);
                    console.log('maptype' + mapRestUrlToType[maphost]);

                    if (maphost === 'GoogleMap') {
                        gmquery = AgoNewWindowConfig.getQueryFromUrl();
                        searchService = $inj.get('GoogleQueryService');
                        searchService.setQuery(gmquery);
                    }

                    MasherCtrl.startMapSystem();
                    TabsCtrl.forceMapSystem(maphost);
                    AgoNewWindowConfig.setHideWebSiteOnStartup(true);
                    // SpaCtrl.hideWebsite();
                }
                return App;
            };

        };

    console.debug('bootstrap setup method');
    return [
        'angular',
        // 'ngAnimate',
        'lib/ionic/js/ionic.bundle',
        'controllers/AppController',
        'controllers/MasherCtrl',
        'controllers/TabsCtrl',
        'lib/AgoNewWindowConfig',
        'controllers/EmailCtrl',
    //        'controllers/SpaCtrl',
        'controllers/MapCtrl',
    //        'lib/GeoCoder',
        'lib/MapHosterLeaflet',
        'lib/MapHosterGoogle',
        'lib/MapHosterArcGIS',
        bootstrapFunction
    ];
});

//            { start: init},
//     return ['lib/bootstrap', bootstrapFunction];
// }

// }).call(this);
