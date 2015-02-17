angular.module('game', ['ionic'])

	.run(function ($ionicPlatform) {
		$ionicPlatform.ready(function () {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			}
			if (window.StatusBar) {
				StatusBar.styleDefault();
			}
		})
	})

	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('game', {
				abstract: true,
				views: {
					'@': {
						//templateUrl: "templates/game.html"
						template: '<ui-view></ui-view>'
					}
				}
			})
			.state('game.start', {
				url: '/start',
				templateUrl: "templates/start.html"
			})
			.state('game.play', {
				url: '/play',
				templateUrl: 'templates/play.html',
				controller: 'GameController'
			})
			.state('game.game-over', {
				url: '/game-over/:score',
				templateUrl: 'templates/game-over.html',
				controller: 'GameOverController'
			});

		$urlRouterProvider.otherwise('/start');

	});
