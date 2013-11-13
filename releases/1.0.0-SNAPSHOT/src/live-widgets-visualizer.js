LiveWidgets.addWidget({
	name: "live-widgets-visualizer",
	model: {

	},
	controller: {
		handleMessage: function (message, channel, id) {
			console.warn("Live Widgets Visualizer", arguments);
			this.model.activeNodes = this.model.activeNodes || {};
			this.model.activeNodes[id] = {
				life: 1,
				broadcast: arguments
			};
		},
		drawConnections: function () {
			this.model.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
			this.model.ctx.fillStyle = "#0099FF";
			this.model.ctx.strokeStyle = "#0099FF";
			function getPosition(element) {
			    var xPosition = 0;
			    var yPosition = 0;
  
			    while(element) {
			        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			        element = element.offsetParent;
			    }
			    return { x: xPosition, y: yPosition };
			}
			var domElements = document.getElementsByTagName('*');
			// if (domElements.length == this.domSize) {
			// 	return false;
			// }
			// this.domSize = domElements.length;
			var relationships = [];
			for (var el = 0, len = domElements.length; el < len; el += 1) {
				if (domElements[el].getAttribute('data-widget')) {
					if (domElements[el].getAttribute('data-outlets')) {
						// domElements[el].setAttribute('data-outlet', this.model.group);						
					}
					else
					{
						domElements[el].setAttribute('data-outlets', "visualizer");
					}
					var groups = domElements[el].getAttribute('data-group');
					if (groups != null) {
						groups = groups.split("|");
					}
					// for (var i = 0, ilen = groups.length; i < ilen; i += 1) {
					// 	
					// }
					// domElements[el].style.border="3px dotted #0099FF";
					var position = getPosition(domElements[el]);
					if (position.x > 0 || position.y > 0)
					{
						if (groups != null) {
							relationships.push({
								id: domElements[el].getAttribute('data-widget-id'),
								position: {
									x: position.x + (domElements[el].offsetWidth/2),
									y: position.y + (domElements[el].offsetHeight/2)
								},
								groups: groups
							});

						}
						
					}
					

				}
			}
			var relationshipMap = {};

			for (var i = 0, ilen = relationships.length; i < ilen; i += 1)
			{

				for (var j = 0, jlen = relationships[i].groups.length; j < jlen; j += 1)
				{
					relationshipMap[relationships[i].groups[j]] = relationshipMap[relationships[i].groups[j]] || [];
					relationshipMap[relationships[i].groups[j]].push(relationships[i]);
				}	
			}			
			
			for (var relationship in relationshipMap) {
				if (relationshipMap.hasOwnProperty(relationship))
				{

					for (var jlen = 0, j = relationshipMap[relationship].length - 1; j != jlen; j -= 1)
					{

						for (var i = 0, ilen = relationshipMap[relationship].length; i < ilen; i += 1)
						{
							if (this.model.activeNodes && (this.model.activeNodes[relationshipMap[relationship][i].id] || this.model.activeNodes[relationshipMap[relationship][j].id])) {
								if (this.model.activeNodes[relationshipMap[relationship][i].id]) {
									this.model.activeNodes[relationshipMap[relationship][i].id].life -= 0.003
									if (this.model.activeNodes[relationshipMap[relationship][i].id].life < 0) {
										delete this.model.activeNodes[relationshipMap[relationship][i].id];
									}
									else
									{

										// console.log("rgba(" + (this.model.activeNodes[relationshipMap[relationship][i].id].life * 255) + ",0,0,255);");
										this.model.ctx.strokeStyle = "rgba(" +
									((Math.floor(this.model.activeNodes[relationshipMap[relationship][i].id].life * 255))) +
										"," +
										"0"+
										"," +
										"0"+
										", " + 
									 (((this.model.activeNodes[relationshipMap[relationship][i].id].life))) +
									 ")"//"#FF0099";
																	// this.model.ctx.lineWidth = 2;
																	
									}
								}
								if (this.model.activeNodes[relationshipMap[relationship][j].id]) {
									this.model.activeNodes[relationshipMap[relationship][j].id].life -= 0.003
									if (this.model.activeNodes[relationshipMap[relationship][j].id].life < 0) {
										delete this.model.activeNodes[relationshipMap[relationship][j].id];
									}
									else
									{
										// this.model.ctx.strokeStyle = "rgba(0," + Math.floor(this.model.activeNodes[relationshipMap[relationship][i].id].life * 153) + "," + Math.floor(this.model.activeNodes[relationshipMap[relationship][i].id].life * 255) + ",1.0)"//"#FF0099";
									this.model.ctx.fillStyle = "rgba(" +
									((Math.floor(this.model.activeNodes[relationshipMap[relationship][j].id].life * 255))) +
									"," +
										"0"+
									"," +
										"0"+
									 ", " +
									 (((this.model.activeNodes[relationshipMap[relationship][j].id].life))) +
									 ")";
																// this.model.ctx.lineWidth = 1;
									}
								}
								// this.model.ctx.strokeStyle = "#FF99FF";
								

						
								var distX = relationshipMap[relationship][j].position.x - relationshipMap[relationship][i].position.x;
								var distY = relationshipMap[relationship][j].position.y - relationshipMap[relationship][i].position.y;
						
								this.model.ctx.beginPath();
								this.model.ctx.moveTo(relationshipMap[relationship][j].position.x, relationshipMap[relationship][j].position.y);


								this.model.ctx.bezierCurveTo(
									relationshipMap[relationship][j].position.x - (distX/2), relationshipMap[relationship][j].position.y,

									relationshipMap[relationship][j].position.x  - (distX/2), relationshipMap[relationship][j].position.y - (distY/2),

									relationshipMap[relationship][i].position.x, relationshipMap[relationship][i].position.y	
								);

								this.model.ctx.stroke();
						
								this.model.ctx.beginPath();
								this.model.ctx.moveTo(relationshipMap[relationship][j].position.x, relationshipMap[relationship][j].position.y);
								this.model.ctx.arc(relationshipMap[relationship][j].position.x, relationshipMap[relationship][j].position.y, 5, 0, 2 * Math.PI, false);
								this.model.ctx.fill();
							
								this.model.ctx.beginPath();
								this.model.ctx.moveTo(relationshipMap[relationship][i].position.x, relationshipMap[relationship][i].position.y);
								this.model.ctx.arc(relationshipMap[relationship][i].position.x, relationshipMap[relationship][i].position.y, Math.abs((Math.sin(distX/distY)*25)), 0, 2 * Math.PI, false);
								this.model.ctx.fill();
							}
							else
							{
								this.model.ctx.strokeStyle = "rgba(0,0,0, .5)";
								this.model.ctx.fillStyle = "rgba(0,0,0, 0.2)";
							}
							// this.model.ctx.lineTo(relationshipMap[relationship][j].position.x - (distX/4) + (Math.sin(distY) * 4), relationshipMap[relationship][j].position.y - (distY/3) + (Math.sin(distY) * 4));
							// this.model.ctx.lineTo(relationshipMap[relationship][j].position.x - (distX/2) - (distX/4) + (Math.sin(distY) * 4), relationshipMap[relationship][j].position.y - (distY) + (distY/3));
							// this.model.ctx.lineTo(relationshipMap[relationship][i].position.x, relationshipMap[relationship][i].position.y);




							// relationship.groups
						}	
					}
					
					// this.model.ctx.beginPath();
					// this.model.ctx.moveTo(position.x, position.y);
					// this.model.ctx.arc(position.x + (domElements[el].offsetWidth/2), position.y + (domElements[el].offsetHeight/2), 10, 0, 2 * Math.PI, false);
					// this.model.ctx.fill();
				}
			}
			
		}
	},
	constructor: function () {

		setTimeout(function () {
			var canvas = document.createElement("canvas");
		
		
		
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		

			document.getElementsByTagName("body")[0].appendChild(canvas);
			console.log("live widgets visualizer", canvas);		
		
					// canvas.style.backgroundColor = "#FAFAFA";
		
			canvas.style.position = "absolute";
			canvas.style.top = "0px";
			canvas.style.bottom = "0px";
			canvas.style.left = "0px";
			canvas.style.right = "0px";
			canvas.style.zIndex = "10000";
			canvas.style.pointerEvents = "none";
			canvas.style.opacity=".3"
			

			
			// canvas.style.background="#FFF";

			this.model.ctx = canvas.getContext("2d");
	        // this.model.ctx.shadowColor = '#000000';
	        // this.model.ctx.shadowBlur = 4;
		// this.model.ctx.lineWidth = 14;
			setInterval(this.controller.drawConnections, 120);
		}.bind(this), 10);

	},
	reinit: function () {
		
	}
});