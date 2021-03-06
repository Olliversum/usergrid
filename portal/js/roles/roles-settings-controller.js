'use strict'

AppServices.Controllers.controller('RolesSettingsCtrl', ['ug', '$scope', '$rootScope', '$location',
  function (ug, $scope, $rootScope, $location) {

    $scope.settingsSelected = 'active';
    $scope.hasSettings = false;
    var init = function(){
      if (!$rootScope.selectedRole) {
        $location.path('/roles');
        return;
      } else {
        $scope.permissions = {};
        $scope.permissions.path = '';
        if($scope.permissions){
          $scope.permissions.getPerm = false;
          $scope.permissions.postPerm = false;
          $scope.permissions.putPerm = false;
          $scope.permissions.deletePerm = false;
        }
        $scope.role = $rootScope.selectedRole.clone();
        $scope.getPermissions();
        $scope.applyScope();
      }
    };
    $scope.$on('role-selection-changed',function(){
      init();
    });
    $scope.$on('permission-update-received', function(event) {
      $scope.getPermissions();
    });

    $scope.$on('role-selection-changed', function() {
      $scope.getPermissions();
    });
    $scope.addRolePermissionDialog = function(modalId){
      if ($scope.permissions.path) {
        var permission = $scope.createPermission(null,null,$scope.permissions.path,$scope.permissions);
        var name =  $scope.role._data.name;
        ug.newRolePermission(permission, name);
        $scope.hideModal(modalId);
        init();

      } else {
        $rootScope.$broadcast('alert', 'error', 'You must specify a name for the permission.');
      }
    };

    $scope.deleteRolePermissionDialog = function(modalId){
      var name =  $scope.role._data.name;
      var permissions = $scope.role.permissions;
      for (var i=0;i<permissions.length;i++) {
        if (permissions[i].checked) {
          ug.deleteRolePermission(permissions[i].perm, name);
        }
      }
      $scope.hideModal(modalId)
    };

    $scope.getPermissions = function() {
      $rootScope.selectedRole.getPermissions(function(err, data){
        $scope.role.permissions = $rootScope.selectedRole.permissions.clone();
        $scope.permissionsSelected = false;
        if (err) {
          $rootScope.$broadcast('alert', 'error', 'error getting permissions');
        } else {
          $scope.hasSettings = data.data.length;
          $scope.applyScope();
        }
      });
    }
    $scope.updateInactivity = function() {
      $rootScope.selectedRole._data.inactivity = $scope.role._data.inactivity;
      $rootScope.selectedRole.save(function (err, data) {
        if (err) {
          $rootScope.$broadcast('alert', 'error', 'error saving inactivity value');
        } else {
          $rootScope.$broadcast('alert', 'success', 'inactivity value was updated');
          init();
        }

      });
    };


    init();
  }]);