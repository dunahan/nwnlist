var NWNList = angular.module('NWNList', ["ngSanitize"]);

NWNList.controller('ServerListCtrl', ['$scope', '$http', '$filter', '$interval', '$window', function($scope, $http, $filter, $interval, $window) {
  $scope.products = {};
  $scope.activeOrdering = "-active_player_count";
  $scope.activeProduct = "NWN2";
  $scope.selectedGameType = null;
  $scope.selectedCategoryName = "All";
  $scope.nwn2 = true;
  $scope.nwn1 = false;
  $scope.searchTerm = "";
  $scope.categories = {
    "0": "Action",
    "1": "Story",
    "2": "Story Lite",
    "3": "Roleplay",
    "4": "Team",
    "5": "Melee",
    "6": "Arena",
    "7": "Social",
    "8": "Alternative",
    "9": "PW Action",
    "10": "PW Story",
    "11": "Solo",
    "12": "Tech Support"
  }


  $scope.changeActiveProduct = function(product) {
    if (product == 'NWN2') {
      $scope.nwn2 = true;
      $scope.nwn1 = false;
      $scope.activeProduct = "NWN2";
    } else {
      $scope.nwn1 = true;
      $scope.nwn2 = false;
      $scope.activeProduct = "NWN1";
    }
  };

  $scope.refresh = function () {  
    $http.get('/products').success(function(data, status, headers, config) {
      angular.forEach(data, function(product, key){
        $scope.products[product] = {};
        $scope.products[product].name = product;
        $scope.refreshServers(product);
      });
    }).error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  };

  $scope.refreshServers = function(product) {
    $http.get('/count/' + product).success(function(data, status, headers, config) {
      $scope.products[product].count = data[0];
    }).error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
    $http.get('/servers/' + product).success(function(data, status, headers, config) {
      angular.forEach(data, function(server, key){
        server["active_player_count"] = parseInt(server["active_player_count"]);
        if (server["module_url"] && (server["module_url"].indexOf("www") == 0)) {
          server["module_url"] = "http://" + server["module_url"];
        }
      });
      $scope.products[product].servers = data;
    }).error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  $scope.setSelectedCategory = function(cat) {
    if (cat == "all") {
      $scope.selectedGameType = null;
      $scope.selectedCategoryName = "All";
    } else {
      $scope.selectedGameType = cat;
      $scope.selectedCategoryName = $scope.categories[cat];
    }
  }

  $scope.linkOut = function (url){
    $window.open(url);
  }

  $scope.refresh();

  $scope.refresher = $interval(function() {
    $scope.refreshServers($scope.activeProduct);
  }, 60000);

}]);