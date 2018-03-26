

ableApp.config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'/*,
            animationIn : 'fadeIn',
            animationIn : 'fadeOut'*/
        });
    });

ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-fadeIn.html","<div class=\"ui-notification animated fadeIn\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);

ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-fadeInLeft.html","<div class=\"ui-notification animated fadeInLeft\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);

ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-fadeInRight.html","<div class=\"ui-notification animated fadeInRight\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);

ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-fadeInUp.html","<div class=\"ui-notification animated fadeInUp\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-fadeInDown.html","<div class=\"ui-notification animated fadeInDown\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-bounceIn.html","<div class=\"ui-notification animated bounceIn\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-bounceInLeft.html","<div class=\"ui-notification animated bounceInLeft\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-bounceInRight.html","<div class=\"ui-notification animated bounceInRight\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-bounceInUp.html","<div class=\"ui-notification animated bounceInUp\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-rotateInDownRight.html","<div class=\"ui-notification animated rotateInDownRight\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-rotateIn.html","<div class=\"ui-notification animated rotateIn\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-flipInX.html","<div class=\"ui-notification animated flipInX\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);
ableApp.run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-ui-notification-flipInY.html","<div class=\"ui-notification animated flipInY\"><h3 ng-show=\"title\" ng-bind-html=\"title\"></h3><div class=\"message\" ng-bind-html=\"message\"></div></div>");
}]);