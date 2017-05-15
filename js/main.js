			var assets = [];
			var tableroJuego1 = [];
			var filaSearch = [];
			var celdaSeleccion = 0;
			var aciertosCelda = 0;
			var game =
			{
				juego1: function()
				{
					render.preload(); 
					var tablero = document.createElement("table");
					for (fila=0; fila<10; fila++)
					{
						var tr = document.createElement("tr");
						var arrayFila = [];
						for (columna=0; columna<10; columna++)
						{
							var valor = Math.floor((Math.random() * 6));
							arrayFila.push(valor);
							var td = document.createElement("td");
							td.setAttribute("data-celdaPremio","0");
							td.setAttribute("data-celdaSeleccion","0");
							var divImg = document.createElement("div");
							var imgTemp = render.getImagen("spriteSheet1",valor);
							divImg.setAttribute("data-id",valor);
							divImg.style.background = "url(" + imgTemp.src + ")"
							divImg.style.backgroundPosition = imgTemp.style.backgroundPosition;
							divImg.style.height = imgTemp.style.height;
							divImg.style.width = imgTemp.style.width;
							td.appendChild(divImg);
							td.setAttribute("onclick","game.checkJuegos1(this)");
							tr.appendChild(td);
						}
						tableroJuego1.push(arrayFila);
						tablero.appendChild(tr);
					}
					document.getElementById("juego").appendChild(tablero);

					salir = false;
					// Calculamos la fila o columna a buscar
					do 
					{
						// Elegimos aleatoriamente horizontal o vertical
						var horiz_vert = Math.floor((Math.random() * 2) + 1);

						// Vertical
						if (horiz_vert == 1)
						{
							// Calculamos un valor donde empezara a contar la fila
							var valor = Math.floor((Math.random() * 10));

							// Si el valor calculado mas 6 (tamaño de fila/columna a buscar) es menor que 10 significa que se esta dentro del tablero
							if ((valor + 6)<=10)
							{
								// Ya sabemos a que altura del tablero empezamos
								var yIni = valor;

								// Ahora necesitamos saber que columna sera
								var posX = Math.floor((Math.random() * 10));

								for (cont=yIni;cont<yIni+6;cont++)
								{
									var yy = ["Y",cont];
									var xx = ["X",posX];
									filaSearch.push(new Array(tableroJuego1[cont][posX], yy, xx));
									var padre = document.getElementById("juego");
									var tablaHija = padre.children[0];
									var tr = tablaHija.children[cont];
									var td = tr.children[posX];
									td.setAttribute("data-celdaPremio","1");
									console.log(td);
								}
								// salimos
								salir = true;
							}
						}
						if (horiz_vert == 2)
						{
							var valor = Math.floor((Math.random() * 10));
							if ((valor + 6)<=10)
							{
								var xIni = valor;
								var posY = Math.floor((Math.random() * 10));
								for (cont=xIni;cont<xIni+6;cont++)
								{
									var yy = ["Y",posY];
									var xx = ["X",cont];
									filaSearch.push(new Array(tableroJuego1[posY][cont], xx, yy));
									var padre = document.getElementById("juego");
									var tablaHija = padre.children[0];
									var tr = tablaHija.children[posY];
									var td = tr.children[cont];
									td.setAttribute("data-celdaPremio","1");
									console.log(td);
								}
								salir = true;
							}
						}
					}
					while (salir == false)

					// Pintamos la fila a buscar
					var filaBuscar = document.createElement("table");
					var tr = document.createElement("tr");
					var fs = filaSearch.length;
					for (arrayCont=0; arrayCont<fs; arrayCont++)
					{
						var v = filaSearch[arrayCont][0];
						var td = document.createElement("td");
						var divImg = document.createElement("div"); 
						var imgTemp = render.getImagen("spriteSheet1",v);
						divImg.setAttribute("data-id",v);
						divImg.style.background = "url(" + imgTemp.src + ")"
						divImg.style.backgroundPosition = imgTemp.style.backgroundPosition;
						divImg.style.height = imgTemp.style.height;
						divImg.style.width = imgTemp.style.width;
						td.appendChild(divImg);
						tr.appendChild(td);
					}
					filaBuscar.appendChild(tr);
					document.getElementById("buscar").appendChild(filaBuscar);
				},
				checkJuegos1: function(obj)
				{
					console.log(obj);
					if (obj.getAttribute("data-celdaSeleccion") == 0)
					{
						if (celdaSeleccion<6)
						{
							obj.setAttribute("data-celdaSeleccion","1");
							obj.classList.add('seleccion');	
							celdaSeleccion++;	
							var val = obj.children[0];
							render.audio(val.getAttribute("data-id"));
						}
						if (celdaSeleccion == 6)
						{
							var padre = document.getElementById("juego");
							var tablaHija = padre.children[0];
							var tr = tablaHija.children;
							var ltr = tr.length;
							for (contTR=0;contTR<ltr;contTR++)
							{
								var td = tr[contTR].children;	
								var ltd = td.length;
								for (contTD=0;contTD<ltd;contTD++)
								{
									var celda = tr[contTR].children[contTD];
									if (celda.getAttribute("data-celdaSeleccion") == 1 && celda.getAttribute("data-celdaPremio") == 1)
									{
										aciertosCelda++;
									}
								}
							}
							if (aciertosCelda == 6)
							{
								document.getElementById("mensaje").innerHTML = "ACIERTO";
								return false;
							}
							else
							{
								document.getElementById("mensaje").innerHTML = "FALLO";
								return false;
							}
						}
					}
					else
					{
						obj.setAttribute("data-celdaSeleccion","0");
						obj.classList.remove('seleccion');		
						celdaSeleccion--;
						var val = obj.children[0];
						render.audio(val.getAttribute("data-id"));
					}
				}
			}

			var render =
			{
				preload: function()
				{
					render.cargarImagen("spriteSheet1","assets/spriteSheetAnimal.png");
				},
				audio: function(au)
				{
					console.log(au);
					if (au == 0) { var audio = new Audio('audio/conejo.mp3'); audio.volumen = 1; }
					if (au == 1) { var audio = new Audio('audio/cerdo.mp3');  audio.volumen = 0.5; }
					if (au == 2) { var audio = new Audio('audio/mono.mp3'); audio.volumen = 1; }
					if (au == 3) { var audio = new Audio('audio/gato.mp3');  audio.volumen = 0.5;}
					if (au == 4) { var audio = new Audio('audio/gallina.mp3'); audio.volumen = 1;}
					if (au == 5) { var audio = new Audio('audio/cabra.mp3');  audio.volumen = 1;}
					
					audio.pause();
					audio.currentTime = 0;
					audio.play();
				},
				cargarImagen: function(id, imagen)
				{
					var img = new Image();
					img.src = imagen;
					var arr = [id, img];
					assets.push(arr);
				},
				getImagen: function(id, valor)
				{
					var l = assets.length;
					if (l !== undefined)
					{
						var img;
						for (cont=0;cont<l;cont++)
						{
							if (id == assets[cont][0])
							{
								img = assets[cont][1];
								if (valor == 0)
								{
									img.style.backgroundPosition = "4px -2px";	
								}
								if (valor == 1)
								{
									img.style.backgroundPosition = "-37px -2px";	
								}
								if (valor == 2)
								{
									img.style.backgroundPosition = "-80px -2px";	
								}
								if (valor == 3)
								{
									img.style.backgroundPosition = "4px -55px";	
								}
								if (valor == 4)
								{
									img.style.backgroundPosition = "-37px -55px";	
								}
								if (valor == 5)
								{
									img.style.backgroundPosition = "-80px -55px";	
								}
								img.style.backgroundRepeat = "no-repeat";
								img.style.height = "50px";
								img.style.width = "50px";
								return img;
							}
						}
					}
				}
			}
			window.onload = ready;

			function ready()
			{
				var tablero = game.juego1();
			}
