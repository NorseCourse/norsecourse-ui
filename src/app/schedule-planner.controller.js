(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name norseCourse.controller:schedulePlannerController
     * @description
     *
     * Controller for the schedule planner tab of the NorseCourse app
     *
     */
    angular.module('norseCourse').controller('schedulePlannerController', function($scope, norseCourseService, schedulesService) {
        $scope.expanded = 'form';
        $scope.requiredCourses = schedulesService.getRequiredCourses();
        $scope.preferredCourses = schedulesService.getPreferredCourses();
        $scope.requiredGenEds = schedulesService.getRequiredGenEds();
        $scope.preferredGenEds = schedulesService.getPreferredGenEds();
        $scope.results = [];
        $scope.currentSchedule = [];
        $scope.currentScheduleIndex = -1;
        $scope.savedSchedules = schedulesService.getSavedSchedules();
        $scope.currentSavedSchedule = [];
        $scope.currentSavedScheduleIndex = -1;

        /**
         * @ngdoc method
         * @name toggleExpanded
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Expands of collapses a section, collapsing the previously expanded section
         *
         * @param {string} section - name of the section expand/collapse
         */
        $scope.toggleExpanded = function(section) {
            if ($scope.expanded === section) {
                $scope.expanded = null;
            } else {
                $scope.expanded = section;
            }
        };

        /**
         * @ngdoc method
         * @name courseQuery
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Queries for courses, to be used by an autocomplete
         *
         * @param {string} queryText - the text to query for
         * @returns {Promise} a promise which is resolved by the query results
         */
        $scope.courseQuery = function(queryText) {
            var types = ['course'];
            return norseCourseService.autocompleteQuery(queryText, types);
        };

        /**
         * @ngdoc method
         * @name genEdQuery
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Queries for gen eds, to be used by an autocomplete
         *
         * @param {string} queryText - the text to query for
         * @returns {Promise} a promise which is resolved by the query results
         */
        $scope.genEdQuery = function(queryText) {
            var types = ['gen ed'];
            return norseCourseService.autocompleteQuery(queryText, types);
        };

        /**
         * @ngdoc method
         * @name getSchedules
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Requests schedules for the current schedule preferences, storing the results in $scope.results
         *
         */
        $scope.getSchedules = function() {
            norseCourseService.getSchedules(
                schedulesService.getRequiredCourses(),
                schedulesService.getPreferredCourses(),
                schedulesService.getRequiredGenEds(),
                schedulesService.getPreferredGenEds()).then(function(data) {
                    $scope.results = data;
                    $scope.currentScheduleIndex = 0;
                    $scope.loadSchedule(data[0].schedule);
                    if ($scope.expanded !== 'results') {
                        $scope.toggleExpanded('results');
                    }
                });
        };

        /**
         * @ngdoc method
         * @name loadSchedule
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Loads the section data for a s specific schedule, storing them in $scope.currentSchedule
         *
         * @param {number[]} sectionIds - the array of section ids for the sections in the schedule
         */
        $scope.loadSchedule = function(sectionIds) {
            var schedule = [];
            $scope.currentSchedule = schedule;
            angular.forEach(sectionIds, function(sectionId) {
                norseCourseService.getSection(sectionId).then(function(section) {
                    schedule.push(section);
                }, function() {
                    console.log('Failed to load section', sectionId);
                });
            });
        };

        /**
         * @ngdoc method
         * @name loadNextSchedule
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Loads the next schedule from $scope.results
         *
         */
        $scope.loadNextSchedule = function() {
            if ($scope.currentScheduleIndex < $scope.results.length - 1) {
                $scope.currentScheduleIndex++;
                var schedule = $scope.results[$scope.currentScheduleIndex];
                $scope.loadSchedule(schedule.schedule);
            }
        };

        /**
         * @ngdoc method
         * @name loadPreviousSchedule
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Loads the previous schedule from $scope.results
         *
         */
        $scope.loadPreviousSchedule = function() {
            if ($scope.currentScheduleIndex > 0) {
                $scope.currentScheduleIndex--;
                var schedule = $scope.results[$scope.currentScheduleIndex];
                $scope.loadSchedule(schedule.schedule);
            }
        };

        /**
         * @ngdoc method
         * @name loadSavedSchedule
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Loads the section data for a s specific schedule, storing them in $scope.currentSavedSchedule
         *
         * @param {number[]} sectionIds - the array of section ids for the sections in the schedule
         */
        $scope.loadSavedSchedule = function(sectionIds) {
            var schedule = [];
            $scope.currentSavedSchedule = schedule;
            angular.forEach(sectionIds, function(sectionId) {
                norseCourseService.getSection(sectionId).then(function(section) {
                    schedule.push(section);
                }, function() {
                    console.log('Failed to load section', sectionId);
                });
            });
        };

        /**
         * @ngdoc method
         * @name loadNextSavedSchedule
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Loads the next schedule from $scope.savedSchedules
         *
         */
        $scope.loadNextSavedSchedule = function() {
            if ($scope.currentSavedScheduleIndex < $scope.savedSchedules.length - 1) {
                $scope.currentSavedScheduleIndex++;
                var schedule = $scope.savedSchedules[$scope.currentSavedScheduleIndex];
                $scope.loadSavedSchedule(schedule);
            }
        };

        /**
         * @ngdoc method
         * @name loadPreviousSavedSchedule
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Loads the previous schedule from $scope.savedSchedules
         *
         */
        $scope.loadPreviousSavedSchedule = function() {
            if ($scope.currentSavedScheduleIndex > 0) {
                $scope.currentSavedScheduleIndex--;
                var schedule = $scope.savedSchedules[$scope.currentSavedScheduleIndex];
                $scope.loadSavedSchedule(schedule);
            }
        };
        
        /**
         * @ngdoc formatTime
         * @name formatTime
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Converts a string from 24-hour format to am/pm format
         *
         * @param {string} s - 24-hour formatted time string
         * @return {string} am/pm formatted time string
         */
        $scope.formatTime = function(s) {
            var hours = Number(s.substr(0, 2));
            var minutes = Number(s.substr(3, 2));
            var am = true;
            if (hours > 11) {
                am = false;
            }
            if (hours > 12) {
                hours -= 12;
            }
            minutes = '0' + minutes.toString();
            minutes = minutes.substr(minutes.length - 2, 2);
            return '' + hours + ':' + minutes + ' ' + (am ? 'am' : 'pm');
        };

        /**
         * @ngdoc method
         * @name saveSchedule
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Saves the current schedule
         *
         */
        $scope.saveSchedule = function() {
            var schedule = $scope.results[$scope.currentScheduleIndex].schedule;
            console.log(schedule);
            schedulesService.saveSchedule(schedule);
            if ($scope.savedSchedules.length === 1) {
                $scope.currentSavedScheduleIndex = 0;
                $scope.loadSavedSchedule($scope.savedSchedules[0]);
            }
        };

        /**
         * @ngdoc method
         * @name removeSavedSchedule
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * Removes the current saved schedule from the saved schedules
         *
         */
        $scope.removeSavedSchedule = function() {
            var schedule = $scope.savedSchedules[$scope.currentSavedScheduleIndex];
            schedulesService.removeSavedSchedule(schedule);
            if ($scope.savedSchedules.length === 0) {
                $scope.currentSavedSchedule = [];
                $scope.currentSavedScheduleIndex = -1;
            } else if ($scope.currentSavedScheduleIndex === 0) {
                $scope.loadSavedSchedule($scope.savedSchedules[0]);
            } else {
                $scope.loadPreviousSavedSchedule();
            }
        };

        /**
         * @ngdoc
         * @name scheduleSaved
         * @methodOf norseCourse.controller:schedulePlannerController
         * @description
         *
         * checks if the current schedule is saved
         *
         * @returns {boolean} true if the schedule is saved
         */
        $scope.scheduleSaved = function() {
            var schedule = $scope.results[$scope.currentScheduleIndex].schedule;
            return schedulesService.hasSavedSchedule(schedule);
        };

    });
})();
