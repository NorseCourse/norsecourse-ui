
/**
 *@ngdoc controller
 *@name norseCourse.controller:courseList
 *@description
 *
 *Displays a list of courses in a grid tile formation.
 *
 */


(function() {
    'user strict';
    angular.module('norseCourse').controller('courseListController', function($scope,$mdDialog, $mdMedia, schedulesService,norseCourseService) {

	$scope.icon = 'add_circle_outline';
	$scope.formatBody = null;
//**********************************Everything for dialog*******************///
	$scope.status = '  ';
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
	
	$scope.courseDialog = function(obj,ev) {
	    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
	    $mdDialog.show({
		controller: DialogController,
		closeto: ev,
		templateUrl: 'views/app/course-dialog.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose: true,
		escapeToClose: true,
		fullscreen: useFullScreen,
		locals: {info: obj.info}//, //pass the obj object into directive scope.
		//scope: $scope
	    });
	    
	    
	    $scope.$watch(function() {
		return $mdMedia('xs') || $mdMedia('sm');
	    }, function(wantsFullScreen) {
		$scope.customFullscreen = (wantsFullScreen === true);
	    });
	    
	};
	
	function DialogController($scope, $mdDialog,info) {
	    $scope.info = info;
	    $scope.secIds = [];
	    angular.forEach(info.section, function(data){
		$scope.secIds.push(data.id);
	    });
	    
	    $scope.hide = function() {
		$mdDialog.cancel();
	    };
	    
	    $scope.cancel = function() {
		$mdDialog.hide();
	    };
	    
	    $scope.answer = function() {
		$mdDialog.hide();   //some problems with closing the dailog
		
	    };
	}
	//********************************************** done with dialog*************///
	$scope.searchGenEd = function(data){
	    console.log(data);
	    var genEd = {
		'type':'genEd',
		'display':'gen ed',
		'data':data
	    };
	    $scope.$parent.loading = 'indeterminate';
	    $scope.$parent.matchingCourses = [];
	    
	    //console.log('find',newValue,oldValue);
	    norseCourseService.queryApi(genEd).then(function(data){
		
		$scope.$parent.matchingCourses = data;
		$scope.$parent.loading = null;
	    });
	    //$scope.$parent.matchingCourses= ;
	    //console.log($scope.$parent.matchingCourses);
	};

	$scope.addToSchedule = function(courseSection,required){
	    var course = {
		'type':'course',
		'display':'course',
		'data':courseSection.info.course,
	    };
	    console.log('add to Schedule',course);
	    if (required === 1){
		schedulesService.addRequiredCourse(course);  	
	    }
	    else if (required === 0) {
		schedulesService.addPreferredCourse(course);  
	    }
	};
    });
})();
