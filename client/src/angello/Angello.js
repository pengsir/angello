var myModule = angular.module('Angello',
    [
        'ngRoute',
        'ngAnimate',
        'firebase',
        'Angello.Common',
        'Angello.Dashboard',
        'Angello.Login',
        'Angello.Storyboard',
        'Angello.User'
    ]);

myModule.config(function ($routeProvider) {
    var getCurrentUser = function (AuthService, $location) {
        return AuthService.getCurrentUser().then(function (user) {
            if (!user) $location.path('/login');
        });
    };

    $routeProvider.
        when('/', {
            templateUrl: 'src/angello/storyboard/tmpl/storyboard.html',
            controller: 'StoryboardCtrl',
            resolve: {
                currentUser: getCurrentUser
            }
        }).
        when('/dashboard', {
            templateUrl: 'src/angello/dashboard/tmpl/dashboard.html',
            controller: 'DashboardCtrl',
            resolve: {
                currentUser: getCurrentUser
            }
        }).
        when('/users', {
            templateUrl: 'src/angello/user/tmpl/users.html',
            controller: 'UsersCtrl',
            resolve: {
                currentUser: getCurrentUser
            }
        }).
        when('/users/:userId', {
            templateUrl: 'src/angello/user/tmpl/user.html',
            controller: 'UserCtrl',
            resolve: {
                currentUser: getCurrentUser,
                user: function ($routeParams, UsersService) {
                    var userId = $routeParams['userId'];
                    return UsersService.fetch(userId);
                },
                stories: function (StoriesService) {
                    return StoriesService.find();
                }
            }
        }).
        when('/login', {templateUrl: 'src/angello/login/tmpl/login.html', controller: 'LoginCtrl'}).
        otherwise({redirectTo: '/'});
});

myModule.run(function ($rootScope, LoadingService) {
    $rootScope.$on('$routeChangeStart', function (e, curr, prev) {
        LoadingService.setLoading(true);
    });

    $rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
        LoadingService.setLoading(false);
    });
});

myModule.value('STORY_STATUSES', [
    {name: 'To Do'},
    {name: 'In Progress'},
    {name: 'Code Review'},
    {name: 'QA Review'},
    {name: 'Verified'}
]);

myModule.value('STORY_TYPES', [
    {name: 'Feature'},
    {name: 'Enhancement'},
    {name: 'Bug'},
    {name: 'Spike'}
]);

myModule.constant('ENDPOINT_URI', 'https://angello.firebaseio.com/');
myModule.constant('Firebase', window.Firebase);


