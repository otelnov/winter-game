angular.module('game')
	.controller('GameOverController', function ($scope, $state) {
		$scope.score = $state.params.score;
	});