var ElementUtils = (function(){
	return{
		hasClassName : function(element,className){
			if(element && className){
				if(element.className.indexOf(className) != -1){
					return true;
				}
				return false;
			}
		},
		getSiblings : function(parent, current){
			if( parent && current){
				var r = [];
				var sib = parent.firstChild;
				for ( ; sib; sib= sib.nextSibling ) 
				   if (sib.nodeType == 1 && sib != current)
					  r.push( sib );        
				return r;
			}
			return null;
		},
		addAttribute :function(element,attrName,attrVal){
			if(element && attrName && attrVal){
				var att = document.createAttribute(attrName);       
				att.value = attrVal;                           
				element.setAttributeNode(att); 
			}
		},
		createElement :function(nodeName,attrObj){
			var elem =null;
			if(nodeName){
				elem = document.createElement(nodeName);
			}
			if(attrObj){
				for(var attr in attrObj){
					if(attr === "id" || attr === "name" || attr === "type" ){
						elem[attr]=attrObj[attr];
					}else if(attr ==="attr"){
						addAttribute(elem,attr,attrObj[attr]);
					}else if(attr === "class"){
					}
				}
			}
			return elem;
		}

	}
	
 })();
 
 var data ={
   ImageLibrary:[
	{
		"Name":"Cats",
		"Images":[
			{
				"url":"images/cats/1.jpg",
				"isActive":true
			},
			{
				"url":"images/cats/2.jpg",
				"isActive":true
			},
			{
				"url":"images/cats/3.jpg",
				"isActive":true
			},
			{
				"url":"images/cats/4.jpg",
				"isActive":true
			}			
		]
	},
	{
		"Name":"Dogs",
		"Images":[
			{
				"url":"images/dogs/1.jpg",
				"isActive":true
			},
			{
				"url":"images/dogs/2.jpg",
				"isActive":true
			},
			{
				"url":"images/dogs/3.jpg",
				"isActive":true
			},
			{
				"url":"images/dogs/4.jpg",
				"isActive":true
			}			
		]
	}
   ]
 };
 
 var optionsToLibrary ={
     "data":data,
	 "thumbnailsSize":150,
	 "imageEditorStageSize":400,
	 "additionalActions":{
		"test":function(stage){
			alert('test');
		}
	 }
  };

 
 //Library viewer js
 (function(options){
    var imageEditorWrapper = null;
	var imagesWrapper = null;
	var defActions ={
		"Rotate":function(stage){
			
			var c=stage.firstChild;
			var img = c.nextSibling;
			var ctx=c.getContext("2d");
			
			ctx.clearRect(0,0,c.width,c.height);
			ctx.save();
						
			ctx.translate(c.width,0);
			ctx.rotate(90*Math.PI/180);
			ctx.drawImage(img,0,0,c.width,c.height);
			
		},
		"Scale":function(stage){
		    var stageWrapper=  stage.parentNode;
			var c=stage.firstChild;
			var img = c.nextSibling;
			var ctx=c.getContext("2d");
			var scaleImg = img.nextSibling;
			
			ctx.clearRect(0,0,c.width,c.height);
			ctx.save();
			
			stageWrapper.style.width=scaleImg.width+'px';
			stageWrapper.style.height=scaleImg.height+'px';
			
			c.width=scaleImg.width;
			c.height=scaleImg.height;
			
			ctx.drawImage(scaleImg,0,0,c.width,c.height);
		}	
	};
    var showImagesInLibrary=function(evt){
		var src = evt.srcElement || evt.target;
		if(src.className){
			var nodeType = src.nodeType ;
			if(nodeType === 1){
				var wrapper = src.parentNode;
				var siblings = ElementUtils.getSiblings(wrapper.parentNode,wrapper);
				if(siblings){
					for(var i=0;i<siblings.length;i++){
						var sib= siblings[i];
						if( ElementUtils.hasClassName(sib,'selected') ){
							sib.className = sib.className.replace('selected',''); 
						}
					}
				}
				if( !ElementUtils.hasClassName(wrapper,'selected') ){
					wrapper.className = wrapper.className+' selected'; 
				}
				var category = wrapper.getAttribute("cat");
				showCurrentLibraryImages(category);
		}
		
		}
	}
	
	var showCurrentLibraryImages = function(categoryName){
		var data = options.data;
		var currentLibName = categoryName+'ImageLibrary';
		var currentImageLibrary = document.getElementById(currentLibName);
		if(!currentImageLibrary){
			var catLibrary =  ElementUtils.createElement("div",{"id":currentLibName,});
			imagesWrapper.appendChild(catLibrary);
			createLibraryImages(options,currentLibName);
			currentImageLibrary = catLibrary;
		}
		
		
		var siblings = ElementUtils.getSiblings(currentImageLibrary.parentNode,currentImageLibrary);
		if(siblings){
			for(var i=0;i<siblings.length;i++){
				var sib= siblings[i];
				sib.style.display='none';
			}
		}
		currentImageLibrary.style.display="block";
	}
	
	var createLibraryThumbnails = function(options){
	
	    var data = options.data;
		var myLibrary =  ElementUtils.createElement("div",{"id":"myLibrary"});
		imageEditorWrapper.appendChild(myLibrary);
		var thumbNailImageMaxCount = 3;
		
		for(var i=0;i<data.ImageLibrary.length;i++){
			var library = data.ImageLibrary[i];
			var libraryWrapper =  ElementUtils.createElement("div");
			libraryWrapper.className="libraryWrap";
			ElementUtils.addAttribute(libraryWrapper,"cat",library.Name);
					
			var activeCount =0;
			for(var j=0;j<library.Images.length;j++){
				var imageData = library.Images[j];
				var className ='sImg';
				var imgSize =0;
				if( j === 0){
					className="bImg";
					var totalSize = options.thumbnailsSize;
					imgSize = 2* (totalSize/thumbNailImageMaxCount);
				}else{
					imgSize = totalSize/thumbNailImageMaxCount;
				}
				
				if(imageData.isActive){
					var image =  document.createElement("img");
					image.src=imageData.url;
					image.width=imgSize;
					image.height=imgSize;
					image.className=className;
					libraryWrapper.appendChild(image);
					myLibrary.appendChild(libraryWrapper);
					activeCount++;
				}
				if(activeCount === 3){
					var clrDiv =  document.createElement("div");
					clrDiv.className='clr';
					libraryWrapper.appendChild(clrDiv);
					myLibrary.appendChild(libraryWrapper);
					break;
				}
			}
		}
		
	};
	
	var createActions = function(options){
		var stageActionDiv =  document.createElement("div");
		stageActionDiv.className="stageAction";
		var actionArr =[];
		if(defActions){
			for(var action in defActions){
				actionArr.push(action);
			}
		}
		
		if(options.additionalActions){
				for(var action in options.additionalActions){
					actionArr.push(action);
				}
		}
		
		if(actionArr && actionArr.length>0){
			for(var i=0;i<actionArr.length;i++){
				var action = actionArr[i];
				var input =  document.createElement("input");
				input.type="button";
				input.name=action;
				input.value=action;
				ElementUtils.addAttribute(input,'action',action);
				stageActionDiv.appendChild(input);
			}
		}
		return stageActionDiv;
	};
	
	var createLibraryImages = function(data,currLibName){
		var data = options.data;
		var imgSize = options.imageEditorStageSize;
		
		var lib = document.getElementById(currLibName);
		
		for(var i=0;i<data.ImageLibrary.length;i++){
			var library = data.ImageLibrary[i];
			
			if( currLibName !== library.Name+'ImageLibrary'){
				continue;
			}
			for(var j=0;j<library.Images.length;j++){
				var libraryWrapper =  document.createElement("div");
				libraryWrapper.className="stageWrapper";
				var imageData = library.Images[j];
				var stageDiv =  document.createElement("div");
				stageDiv.className="stage";		
				if(imageData.isActive){
					var convas =  document.createElement("canvas");
					//image.src=imageData.url;
					convas.width=imgSize;
					convas.height=imgSize;
					stageDiv.appendChild(convas);
					
					var image =  document.createElement("img");
					image.src=imageData.url;
					image.width=imgSize;
					image.height=imgSize;
					stageDiv.appendChild(image);
					image.style.display="none";
					
					var image =  document.createElement("img");
					image.src=imageData.url;
					image.width=imgSize+100;
					image.height=imgSize+100;
					stageDiv.appendChild(image);
					image.style.display="none";
										
					libraryWrapper.appendChild(stageDiv);
					
					var ctx = convas.getContext("2d");
					ctx.drawImage(image,0,0,imgSize,imgSize);
																				
					libraryWrapper.appendChild(createActions(options));
					lib.appendChild(libraryWrapper);
				}
				
			}
		}
		
	};
	
	var initializeImageEditor = function(){
		var imageEditor =  document.createElement("div");
		//TODO: name should be unique
		imageEditor.id="imageEditor";
		document.body.appendChild(imageEditor);
		imageEditorWrapper = imageEditor;		
	};
	
	var initializeImageWrapper = function(){
		var imageEditor =  document.createElement("div");
		//TODO: name should be unique
		imageEditor.id="imagesWrapper";
		imageEditorWrapper.appendChild(imageEditor);
        imagesWrapper = imageEditor;		
	};
	
	initializeImageEditor();
	createLibraryThumbnails(options);
	initializeImageWrapper();
	document.getElementById("myLibrary").addEventListener("click",showImagesInLibrary);
	var test=function(evt){
		var src= evt.srcElement|| evt.target;
		var action = src.getAttribute('action');
		if(defActions){
			if(defActions[action]){
				defActions[action](src.parentNode.previousSibling);
			}
		}
	};
	document.getElementById("imagesWrapper").addEventListener("click",test);
    
 })(optionsToLibrary);
 
 