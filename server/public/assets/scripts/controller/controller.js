var myApp = angular.module('myApp');

myApp.controller('UserController', ['$scope', 'alertFactory', 'socket','$location', function($scope, alertFactory, socket,$location) {
    console.log('user controller');
    //vars
    var counter;
    var flashes = 20;
    $scope.alertInfo;
    $scope.alertHappening = false;
    var mySocket = socket.socket;
    $scope.baseUrl = $location.host();
    console.log($scope.baseUrl)
    //functions
    $scope.flashAlert = function(flashClass, func){
        counter ++;
        var el = angular.element('body')
        el.toggleClass(flashClass);
        if (counter < flashes) {
            setTimeout(func, 2000);
        }
        else if( counter >=flashes) {
            if (el.hasClass(flashClass)) {
                el.removeClass(flashClass);
                $scope.$apply(function(){
                    $scope.alertHappening = false;
                });
                counter = 0;
            }
            else {
                $scope.$apply(function(){
                    $scope.alertHappening = false;
                });
                counter = 0;

            }
        }

    };
    $scope.extreme = function(){
        $scope.flashAlert('extreme',$scope.extreme);
    };
    $scope.severe = function(){
        $scope.flashAlert('severe', $scope.severe);
    };
    $scope.moderate = function(){
        $scope.flashAlert('moderate', $scope.moderate);
    };
    $scope.minor = function(){
        $scope.flashAlert('minor', $scope.minor);
    };
    $scope.unknown = function(){
        $scope.flashAlert('unknown', $scope.unknown);
    };
    $scope.alertCases = function(alert) {
        counter = 0;
        $scope.$apply(function(){
            $scope.alertHappening = true;
        });
        if (alert.status == "Actual" || alert.status=="Test" || alert.status =="Exercise") {
            switch (alert.severity) {
                case "Extreme":
                    $scope.extreme();
                    break;
                case "Severe":
                    $scope.severe();
                    break;
                case "Moderate":
                    $scope.moderate();
                    break;
                case "Minor":
                    $scope.minor();
                    break;
                case "Unknown":
                    $scope.minor();
                    break;
            }
        }
    };
    $scope.startSocketPing = function(){
        mySocket.emit('stayConnected');
    }



    //sockets
    mySocket.on('keepConnected', function(data){
        console.log('keeping connection');
        setTimeout(function(){
            mySocket.emit('stayConnected');
        },10000);
    });

    mySocket.on('userAlert', function(data){
        console.log(data.alert);
        $scope.alertInfo = data.alert;
        console.log($scope.alertInfo)
        $scope.alertCases($scope.alertInfo);
        setTimeout(function(){
            mySocket.emit('alertOver', {data: 'alert is over'});
            console.log('sent alertOve event');
        },3000);
    })

    //initial functions
    $scope.startSocketPing();

}]);

myApp.controller('AdminController', ['$scope','alertFactory', 'socket', function($scope, alertFactory, socket) {
    console.log('admin controller');


    //variables
    var mySocket = socket.socket;
    $scope.lastUpdated;
    $scope.sentAlert = false;
    console.log(alertFactory.customAlert, alertFactory.generalAlert);
    $scope.severityOptions = ['Extreme', 'Severe', 'Moderate', 'Minor', 'Unknown'];
    $scope.certaintyOptions = ['Observed', 'Likely', 'Possible', 'Unlikely', 'Unknown'];
    $scope.statusOptions = ['Actual', 'Exercise', 'System', 'Test', 'Draft']

    //socket events

    mySocket.on('removeAlert', function(){
        setTimeout(function() {
            $scope.$apply(function () {
                $scope.sentAlert = false;
                var el = angular.element('.alertButtons')
                el.prop('disabled', false);
                $scope.reset();




            })
        },40000);
    });

    mySocket.on('keepConnected', function(){
        console.log('keeping connection');
        setTimeout(function(){mySocket.emit('stayConnected')},10000);
    });



    //functions

    $scope.startSocketPing = function(){
        mySocket.emit('stayConnected');
    }

    $scope.dateFunction = function(){
        var d = new Date();
        return d
    }

    $scope.createCustomAlert = function(){
        $scope.alertObject = alertFactory.customAlert;
        console.log($scope.alertObject, 'has been created');

    };
    $scope.sendCustomAlert = function(alertObject){
        alertObject.sent = true;
        mySocket.emit('adminAlert', {alertInfo: alertObject });
        $scope.sentAlert = true;
        var el = angular.element('.alertButtons')
        el.prop('disabled', true);

    };

    $scope.sendGeneralAlert = function(){
        alertFactory.generalAlert.sent = true;
        mySocket.emit('adminAlert', {alertInfo: alertFactory.generalAlert});
        $scope.sentAlert = true;
        var el = angular.element('.alertButtons')
        el.prop('disabled', true);

    };

    $scope.reset = function(form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.alertInfo = angular.copy($scope.master);
    };

    // init
    $scope.lastUpdated = $scope.dateFunction()
    $scope.startSocketPing();

}]);

myApp.factory('alertFactory', function(){

    var customAlert = {
        category : "", status: "", urgency : "", severity : "", certainty : "", sender : "", headline : "", instructions : "", sent : false
    };
    var generalAlert = {
        category : "General", status : "Actual", urgency : "Some", severity : "Extreme", certainty : "The Most Certain", sender : "Administrator", headline : "Get out of here", instructions : "RUNNNNN!!!!!", sent : false
    };
    return {
        customAlert : customAlert,
        generalAlert : generalAlert
    }

});

myApp.factory('socket', ['$location','$window', function($location){
    var baseUrl = $location.host();
    console.log('window.location ' + window.location.hostname);
    console.log('base url' + baseUrl);
    var socket = io.connect('https://'+baseUrl+':5000', {secure: true});

    return {
        socket: socket
    }

}])


