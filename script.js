var platform='iOS';
//var platform='pc';
//var platform='Android';

function inside(x,y,xmin,ymin,width,height)
{
	var xmax=xmin+width;
   var ymax=ymin+height;
	result= x>=xmin && y>=ymin && x<=xmax && y<=ymax;
	return result;
}

function remove_from_list(l,val)
{

   for(var i =0;i<l.length;i++)
   {
   	    if (l[i]==val)
   	    {
   	    	l.splice(i,1);
   	    }
   }
}



angular.module('dragModule', [])
.controller('operariosController', ['$scope' , function($scope){ // function referenced by the drop target

                $scope.dragging='no-dragging';
                $scope.drop_zones=[];
                $scope.operarios={
                                  Pepe:{name:'Pepe',bonos:['Bono1','Bono2','Bono3']},
                                  Ramon:{name:'Ramon',bonos:['Bono4','Bono6']},
                                  Jesus:{name:'Jesus',bonos:['Bono7','Bono8','Bono9']},
                                  Gustavo:{name:'Gustavo',bonos:['Bono10','Bono11','Bono12']}
                                  };
                $scope.drag_over=function(bono,oper_dst)
                    {
                    	$scope.oper_dst=oper_dst;
                    };
                $scope.drop=function(bono)
                    {
                    	if ($scope.oper_dst!=$scope.oper_src  )
                    	{
							    //$scope.operarios[$scope.oper_src].bonos=remove_from_list($scope.operarios[$scope.oper_src].bonos,bono)	;
							    remove_from_list($scope.operarios[$scope.oper_src].bonos,bono)	;   
							    $scope.operarios[$scope.oper_dst].bonos.push(bono);
							    $scope.$apply();
                    	}
                    	
                    };
                $scope.drag_start=function(bono,oper_src)
                    {
                    	$scope.oper_src=oper_src;
                    	$scope.oper_dst=oper_src;
                    };
                $scope.remove_item=function(){
                        $scope.operarios['Pepe']['bonos'].splice(1,1);
                }
                
}]).
  directive('myDraggable', function($document) {
    return function(scope, element, attr) {
      element.startX=0;
      element.startY=0;
      element.myx=0;
      element.myy=0;
      //var startX = 0, startY = 0, x = 0, y = 0;
      
      var start='';
      var stop='';
      var move='';
      if (platform=='iOS')
      {
          start='touchstart';
          stop='touchend';
          move='touchmove';
      }
      if (platform=='Android')
      {
          start='touchstart';
          stop='touchend';
          move='touchmove';
      }
      if (platform=='pc')
      {
          start='mousedown';
          stop='mouseup';
          move='mousemove';
      }      
 
      element.on(start, function	(event) {
          if(scope.dragging=='no-dragging')
          {
              scope.dragging='dragging';
              function mouseup() {
	                element.css({
	                     border: '1px solid green',
	                     top:"0px",
	                     left:"0px"
	                });
              	   scope.drop(element[0].attributes.name_bono.value);
	                $document.unbind(move, mousemove);
	                $document.unbind(stop, mouseup);
	                scope.dragging='no-dragging';
              }
              function mousemove(event) {
	                element.myy = event.pageY - element.startY;
	                element.myx = event.pageX - element.startX;
	                var css_val={
	                  top: element.myy + 'px',
	                  left:  element.myx + 'px'
	                };
	                element.css(css_val);
	                for(dz in scope.drop_zones)
	                {
	                	var d=scope.drop_zones[dz][0];
	                	if (inside(event.pageX,event.pageY,d.offsetLeft,d.offsetTop,d.offsetWidth,d.offsetHeight))
	                	{
	                		scope.drag_over(element[0].attributes.name_bono.value,scope.drop_zones[dz][0].attributes.id2.value);
	                	}
	                }
              }
                     
              // Prevent default dragging of selected content
              event.preventDefault();
              element.myx=0;
              element.myy=0;
              element.startX = event.pageX - element.myx;
              element.startY = event.pageY - element.myy;
              $document.on(move, mousemove);
              $document.on(stop, mouseup);
              
              for(dz in scope.drop_zones)
              {
	             	var d=scope.drop_zones[dz][0];
	             	if (inside(event.pageX,event.pageY,d.offsetLeft,d.offsetTop,d.offsetWidth,d.offsetHeight))
	             	{
	             		scope.drag_start(element[0].attributes.name_bono.value,scope.drop_zones[dz][0].attributes.id2.value);
	             	}
              }

              element.css({
                    border: '5px solid green'
              });
              
          }
      });
 
  
    }
  }).
  directive('dropZone', function($document) {
    return function(scope, element, attr) {
        scope.drop_zones.push(element);  
  
    }
  });
  