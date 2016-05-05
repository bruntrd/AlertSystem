var myApp = angular.module('myApp', ['ngRoute']);

var appControllers=angular.module('appControllers',[]);

myApp.config(['$routeProvider', function($routeProvider){
    $routeProvider.
    when('/user', {
        templateUrl: "/assets/views/routes/user.html",
        controller: "UserController"
        }).
    when('/admin', {
        templateUrl: "/assets/views/routes/admin.html",
        controller: "AdminController"
    }).
    otherwise({
        redirectTo: "/user"
    });
}]);