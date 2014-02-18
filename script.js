var platform='iOS';
//var platform='pc';
//var platform='Android';
var dist_scroll=30;
var scroll_band=200;
var scroll_velocity=20;
var auto_scroll=true;

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
                                  Gustavo:{name:'Gustavo',bonos:['Bono10','Bono11','Bono12']},
                                  Einstein:{name:'Einstein',bonos:['Bono21','Bono22','Bono23']},
                                  Edison:{name:'Edison',bonos:['Bono24','Bono26']},
                                  Newton:{name:'Newton',bonos:['Bono27','Bono28','Bono29']},
                                  Pons:{name:'Ponss',bonos:['Bono120','Bono121','Bono122']}
                                  };
                $scope.sin_operario=['Bono sin 1','Bono sin 2','Bono sin 3']
                $scope.drag_over=function(bono,oper_dst)
                    {
                    	$scope.oper_dst=oper_dst;
                    };
                $scope.drop=function(bono)
                    {
                    	if ($scope.oper_dst!=$scope.oper_src  )
                    	{
							    //$scope.operarios[$scope.oper_src].bonos=remove_from_list($scope.operarios[$scope.oper_src].bonos,bono)	;
							    if ($scope.oper_src !='sin_operario')
							    {
							    	remove_from_list($scope.operarios[$scope.oper_src].bonos,bono)	; 
							    }
							    else {
							    	console.log($scope.sin_operario);
							    	remove_from_list($scope.sin_operario,bono);
							    }  
							    if ($scope.oper_dst!='sin_operario')
							    {
							    	$scope.operarios[$scope.oper_dst].bonos.push(bono);
							    }
							    else {
							    	$scope.sin_operario.push(bono);
							    }
							    $scope.$apply();
                    	}
                    	
                    };
                $scope.drag_start=function(bono,oper_src)
                    {
                    	$scope.oper_src=oper_src;
                    	$scope.oper_dst=oper_src;
                    };
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
              scope.dragging='waiting';
              function mouseup() {
	                element.css({
	                     border: '1px solid green',
	                     top:"0px",
	                     left:"0px"
	                });
	                if (scope.dragging=='dragging')
	                {
              	   		scope.drop(element[0].attributes.name_bono.value);
              	   	}
              	   	else {
              	   		
              	   	}
	                $document.unbind(move, mousemove);
	                $document.unbind(stop, mouseup);
	                scope.dragging='no-dragging';
              }
              function mousemove(event) {
              	   if (scope.dragging=='dragging'){
              	   	      event.preventDefault();
			                element.myy = event.pageY - element.startY;
			                element.myx = event.pageX - element.startX;
                         var maxLeft=element[0].offsetParent.offsetParent.offsetWidth-element[0].offsetParent.offsetWidth-element[0].offsetParent.offsetLeft;    
			                var css_val={
			                  top: element.myy + 'px',
			                  //left: element.myx + 'px'
			                  left:  Math.min(element.myx,maxLeft) + 'px'
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
			                if(auto_scroll){
			                	var h;
			                    var screeny;
			                    if (platform == 'pc')
			                    {
			                    	h=screen.height;
			                    	screeny=event.screenY;
			                    }
			                    else {
			                    	h=screen.width;
			                    	screeny=event.touches[0].clientY;
			                    }
			                    if (screeny<= scroll_band)
			                    {
			                    	element[0].offsetParent.offsetParent.scrollTop-=scroll_velocity;
			                    }
			                    if (screeny >= h-scroll_band)
			                    {
			                    	element[0].offsetParent.offsetParent.scrollTop+=scroll_velocity;
			                    }
			                }
		              } 
		              else if(scope.dragging=='waiting' && !inside(event.pageX,event.pageY,element.initPageX-dist_scroll,element.initPageY-dist_scroll,element.initPageX+dist_scroll,element.initPageY+dist_scroll)) {
                          $document.unbind(move, mousemove);
	                		 $document.unbind(stop, mouseup);		
	                		 scope.dragging='no-dragging';              	
	                		 element.css({
	                     			border: '1px solid orange',
	                     			top:"0px",
	                     			left:"0px"
	                		});  
		              }
              }  
              
              // Prevent default dragging of selected content
              //event.preventDefault();
              $document.on(move, mousemove);
				 $document.on(stop, mouseup);
				 element.initPageX=event.pageX;
				 element.initPageY=event.pageY;
              setTimeout(function(){
              	    if(scope.dragging=='waiting')
              	    {           	    	    
              	    	    scope.dragging='dragging';
				              element.myx=0;
				              element.myy=0;
				              element.startX = event.pageX - element.myx;
				              element.startY = event.pageY - element.myy;

				              
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
             },1000); 
          }
      });
 
  
    }
  }).
  directive('dropZone', function($document) {
    return function(scope, element, attr) {
        scope.drop_zones.push(element);  
  
    }
  });
  