angular.module('game')
	.controller('GameController', function ($scope, $interval, $timeout, $window, $state) {
		var moveLeft;
		var moveRight;
		var moveUp;
		var moveDown;
		var stopPlayer = false;
		var doc = angular.element(document);

		function random(min, max) {
			var rand = min - 0.5 + Math.random() * (max - min + 1);
			return Math.round(rand);
		}

		$scope.windowHeight = $window.innerHeight - 44;
		$scope.windowWidth = $window.innerWidth;
		$scope.windowPadding = 0;
		if ($scope.windowWidth > 700) {
			$scope.windowPadding = ($scope.windowWidth - 700) / 2;
			$scope.windowWidth = 700;
		}

		var sectorNum = 3;
		var maxHoles = 20;

		$scope.playerHeight = Math.round($scope.windowHeight * 7 / 100);
		$scope.playerWidth = Math.round($scope.windowWidth * 7 / 100);
		$scope.playerTop = Math.round($scope.windowHeight - $scope.playerHeight - 60);
		$scope.playerLeft = Math.round($scope.windowWidth / 2 - $scope.playerWidth / 2);

		var maxPlayerTop = 0;
		var maxPlayerDown = $scope.windowHeight - $scope.playerHeight;
		var maxPlayerLeft = 0;
		var maxPlayerRight = $scope.windowWidth - $scope.playerWidth;

		function movePlayer() {
			if (!stopPlayer) {
				if (moveLeft && $scope.playerLeft > maxPlayerLeft) {
					$scope.playerLeft -= 4;
				}
				if (moveRight && $scope.playerLeft < maxPlayerRight) {
					$scope.playerLeft += 4;
				}
				if (moveUp && $scope.playerTop > maxPlayerTop) {
					$scope.playerTop -= 4;
				}
				if (moveDown && $scope.playerTop < maxPlayerDown) {
					$scope.playerTop += 4;
				}
				$timeout(movePlayer, 10);
			}
		}

		movePlayer();

		var keydown = function (e) {
			if (e.keyCode === 37) {
				moveLeft = true;
			}

			if (e.keyCode === 39) {
				moveRight = true;
			}

			if (e.keyCode === 38) {
				moveUp = true;
			}

			if (e.keyCode === 40) {
				moveDown = true;
			}
		};

		var keyup = function (e) {
			if (e.keyCode === 37) {
				moveLeft = false;
			}

			if (e.keyCode === 39) {
				moveRight = false;
			}

			if (e.keyCode === 38) {
				moveUp = false;
			}

			if (e.keyCode === 40) {
				moveDown = false;
			}
		};

		doc.on('keydown', keydown);
		$scope.$on('$destroy', function () {
			doc.off('keydown', keydown);
		});

		doc.on('keyup', keyup);
		$scope.$on('$destroy', function () {
			doc.off('keyup', keyup);
		});

		$scope.onRelease = function () {
			moveLeft = false;
			moveRight = false;
		};

		$scope.onTouch = function (e) {
			moveLeft = false;
			moveRight = false;
			if (e.gesture.center.pageX < ($scope.windowWidth / 2) + 1) {
				moveLeft = true;
			} else {
				moveRight = true;
			}
		};


		$scope.holes = [];
		$scope.score = 0;

		function generateHole(i, range) {
			var hs = random($scope.playerWidth / 2, $scope.playerWidth * 2);
			var hole = {};
			hole.holeHeight = hs;
			hole.holeWidth = hs;
			hole.holeLeft = random(range.from, range.to - hole.holeWidth);
			hole.holeTop = -random(hole.holeHeight, $scope.windowHeight + hole.holeHeight);
			$scope.holes[i] = hole;
		}

		function addHole(range) {
			var hs = random($scope.playerWidth / 2, $scope.playerWidth * 2);
			var hole = {};
			hole.holeHeight = hs;
			hole.holeWidth = hs;
			hole.holeLeft = random(range.from, range.to - hole.holeWidth);
			hole.holeTop = -random(hole.holeHeight, $scope.windowHeight + hole.holeHeight);
			$scope.holes.push(hole);
		}

		function addHoles(n) {
			var sectorSize = ($scope.windowWidth + 5) / 3;
			var sectorArray = [];

			for (var k = 0; k < sectorNum; k++) {
				sectorArray.push({
					from: Math.round(sectorSize * k),
					to: Math.round(sectorSize * k + sectorSize - 5)
				});
			}

			var ran;
			for (var i = 0; i < n; i++) {
				var randomSector = random(0, sectorArray.length - 1);
				if (ran == randomSector) {
					randomSector = random(0, sectorArray.length - 1);
				}
				ran = randomSector;
				generateHole(i, sectorArray[randomSector]);
			}

			var hi = $interval(function () {
				angular.forEach($scope.holes, function (hole, index) {
					if (hole.holeTop < $scope.windowHeight) {
						hole.holeTop++;
						if (hole.holeTop >= $scope.playerTop - hole.holeHeight && hole.holeTop < $scope.playerTop + $scope.playerHeight) {
							if (hole.holeLeft > $scope.playerLeft - hole.holeWidth + 1 && hole.holeLeft < $scope.playerLeft + $scope.playerWidth - 1) {
								$interval.cancel(hi);
								stopPlayer = true;
								return $state.go('game.game-over', {score: $scope.score});
							}
						}
					} else {
						if (index % 2 == 0) {
							$scope.score++;
						}
						generateHole(index, sectorArray[random(0, sectorArray.length - 1)]);
						if (index == n - 1 && index <= maxHoles) {
							addHole(sectorArray[random(0, sectorArray.length - 1)])
						}
					}
				});
			}, 5);
		}

		addHoles(7);

	});