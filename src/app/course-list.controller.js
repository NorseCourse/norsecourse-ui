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
	    console.log(obj);
	    console.log(ev)
	    $mdDialog.show({
		controller: DialogController,
		templateUrl: 'views/app/course-dialog.html',
		parent: angular.element(document.body),
		targetEvent: ev,
		clickOutsideToClose:true,
		fullscreen: useFullScreen,
		locals: {obje: obj}, //pass the obj object into directive scope.
		scope: $scope
	    })
		.then(function(answer) {
		    $scope.status = 'You said the information was "' + answer + '".';
		}, function() {
		    $scope.status = 'You cancelled the dialog.';
		});
	    
	    
	    
	    $scope.$watch(function() {
		return $mdMedia('xs') || $mdMedia('sm');
	    }, function(wantsFullScreen) {
		$scope.customFullscreen = (wantsFullScreen === true);
	    });
	    
	};
	
	function DialogController($scope, $mdDialog,obje) {
	    $scope.obj = obje;
	    //$scope.baz = locals.three;
	    //$scope.foo = 'fooooo';
	    $scope.hide = function() {
		console.log(baz);
		$mdDialog.hide();
	    };
	    
	    $scope.cancel = function() {
		$mdDialog.cancel();
	    };
	    
	    $scope.answer = function(answer) {
		$mdDialog.hide(answer);
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
	    console.log('add to Schedule',courseSection);
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
