angular.module("opendataSidebar").
	component("opendataSidebar" , {
		templateUrl : "/opendata/app/sidebar/sidebar.html",
    // transclude: true,
  	// bindings : {},
    
		controller : "opendatatSidebarController"
	})
  

	.directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                bindings: {},
                transclude: true,
                require : "^?opendataSidebar",
               link: function(scope, element, attrs , opendataSidebar) {
                  var model = $parse(attrs.fileModel);
                  var modelSetter = model.assign;
                  element.bind('change', function(){
                     scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                        opendataSidebar.filename = element[0].files[0].name;
                     });

                      var f = this.file;

        var fd = new FormData();
            fd.append('file', f);
            

            var selected = this.columns.filter(function(column) {
              return column.checked;
            }).map(function(column) {
              return column.name;
            });
            fd.append('columns', selected);

            // opendataSidebarService.upload(fd , "/opendata/fileupload");
            console.log(fd);
            console.log(fd.get('file'));
            $http.post("/opendata/fileupload" , fd ,{
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(response){
                

                  if(response['status']){
                    allData.push({
                      data       : response['data'],
                      file_index : count,
                      filename   : self.filename
                    });

                    allChartTable.push({
                      file_index : count,
                      filename   : self.filename,
                      data       : []
                    });
                  
                    $rootScope.drawData();

                    self.collapse_menu(); // collapse menu when user upload file success
                   
                  
                    $rootScope.addFile(self.filename);
                    count+=1;
                  }else{
                    alert(response['error']);
                  }
               })
            
               .error(function(){
                  // return 1
               });
               console.log("####################################################################################################")
               console.log(self.filename)

                    //  var r = new FileReader();
                    // r.onload = function(e) {
                    //   var contents = e.target.result;
                    //   contents = contents.split(/\n/);
                    //   scope.$apply(function() {
                    //     opendataSidebar.columns = contents[0].split(',').map(function(column) {
                    //       return { name: column, checked: false };
                    //     })
                    //   })
                    // };
                        
                    r.readAsText(element[0].files[0]);
                  });
               }
            };
         }]);