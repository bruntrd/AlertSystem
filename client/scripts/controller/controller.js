var myApp = angular.module('myApp');

myApp.controller('UserController', ['$scope', 'alertFactory', 'socket', function($scope, alertFactory, socket) {
    console.log('user controller');
    //vars
    var counter;
    var flashes = 20;
    $scope.alertInfo;
    $scope.alertHappening = false;
    var mySocket = socket.socket;

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
        if (alert.status == "Actual") {
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
                case "unknown":
                    $scope.minor();
                    break;
            }
        }
    };
    $scope.startSocketPing = function(){
        mySocket.emit('client');
    }



    //sockets
    mySocket.on('keepConnected', function(data){
        console.log('keeping connection');
        setTimeout(function(){mySocket.emit('stayConnected')},10000);
    });

    mySocket.on('userAlert', function(data){
        console.log(data.alert);
        $scope.alertInfo = data.alert;
        console.log($scope.alertInfo)
        $scope.alertCases($scope.alertInfo);
        setTimeout(function(){mySocket.emit('alertOver', {data: 'alert is over'})},30000);
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
        $scope.$apply(function() {
            $scope.sentAlert = false;
            var el = angular.element('.alertButtons')
            el.prop('disabled', false);


        })
    });

    mySocket.on('keepConnected', function(){
        console.log('keeping connection');
        setTimeout(function(){mySocket.emit('stayConnected')},10000);
    });



    //functions

    $scope.startSocketPing = function(){
        mySocket.emit('client');
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
        $scope.alertObject = alertFactory.customAlert;
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

myApp.factory('socket', function(){
    var socket = io.connect('http://localhost:5000');

    return {
        socket: socket
    }

})


