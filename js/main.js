const audioFiles = ['audio/conejo.mp3', 'audio/cerdo.mp3', 'audio/mono.mp3', 'audio/gato.mp3', 'audio/gallina.mp3', 'audio/cabra.mp3'];
let assets = [];
let tableroJuego1 = [];
let filaSearch = [];
let celdaSeleccion = 0;
let aciertosCelda = 0;

let game = {
  juego: () => {
	render.preload();
    let tablero = el.create('table');
    for (let fila = 0; fila < 10; fila++) {
      let tr = el.create('tr');
      let arrayFila = [];
      for (let columna = 0; columna < 10; columna++) {
		let valor = Math.floor(Math.random() * 6);
        arrayFila.push(valor);
		let td = el.create('td');
		el.setAttr(td, [{'data-celdaPremio': '0'}, {'data-celdaSeleccion': '0'}])
        let divImg = el.create('div');
		let imgTemp = render.getImagen('spriteSheet1', valor);
		el.setAttr(divImg, [{'data-id': valor}]);
        divImg.style.background = `url(${imgTemp.src})`;
        divImg.style.backgroundPosition = imgTemp.style.backgroundPosition;
        divImg.style.height = imgTemp.style.height;
        divImg.style.width = imgTemp.style.width;
		td.appendChild(divImg);
		el.setAttr(td, [{'onclick': 'game.checkGames(this)'}]);
        tr.appendChild(td);
      }
      tableroJuego1.push(arrayFila);
      tablero.appendChild(tr);
    }
    document.getElementById('juego').appendChild(tablero);

    let salir = false;
    // Calculamos la fila o columna a buscar
    do {
      // Elegimos aleatoriamente horizontal o vertical
      let horiz_vert = Math.floor(Math.random() * 2 + 1);

      // Vertical
      if (horiz_vert == 1) {
        // Calculamos un valor donde empezara a contar la fila
        let valor = Math.floor(Math.random() * 10);

        // Si el valor calculado mas 6 (tamaño de fila/columna a buscar) es menor que 10 significa que se esta dentro del tablero
        if (valor + 6 <= 10) {
          // Ya sabemos a que altura del tablero empezamos
          let yIni = valor;

          // Ahora necesitamos saber que columna sera
          let posX = Math.floor(Math.random() * 10);

          for (let cont = yIni; cont < yIni + 6; cont++) {
            let yy = ['Y', cont];
            let xx = ['X', posX];
            filaSearch.push(new Array(tableroJuego1[cont][posX], yy, xx));
            let padre = document.getElementById('juego');
            let tablaHija = padre.children[0];
            let tr = tablaHija.children[cont];
			let td = tr.children[posX];
			el.setAttr(td, [{'data-celdaPremio': '1'}]);
          }
          // salimos
          salir = true;
        }
      }
      if (horiz_vert == 2) {
        let valor = Math.floor(Math.random() * 10);
        if (valor + 6 <= 10) {
          let xIni = valor;
          let posY = Math.floor(Math.random() * 10);
          for (let cont = xIni; cont < xIni + 6; cont++) {
            let yy = ['Y', posY];
            let xx = ['X', cont];
            filaSearch.push(new Array(tableroJuego1[posY][cont], xx, yy));
            let padre = document.getElementById('juego');
            let tablaHija = padre.children[0];
            let tr = tablaHija.children[posY];
			let td = tr.children[cont];
			el.setAttr(td, [{'data-celdaPremio': '1'}]);
          }
          salir = true;
        }
      }
    } while (salir == false);

    // Pintamos la fila a buscar
    let filaBuscar = el.create('table');
    let tr = el.create('tr');
    let fs = filaSearch.length;
    for (let arrayCont = 0; arrayCont < fs; arrayCont++) {
      let v = filaSearch[arrayCont][0];
      let td = el.create('td');
      let divImg = el.create('div');
	  let imgTemp = render.getImagen('spriteSheet1', v);
	  el.setAttr(divImg, [{'data-id': v}]);
      divImg.style.background = `url(${imgTemp.src})`;
      divImg.style.backgroundPosition = imgTemp.style.backgroundPosition;
      divImg.style.height = imgTemp.style.height;
      divImg.style.width = imgTemp.style.width;
      td.appendChild(divImg);
      tr.appendChild(td);
    }
    filaBuscar.appendChild(tr);
    document.getElementById('buscar').appendChild(filaBuscar);
  },
  checkGames: obj => {
    if (obj.getAttribute('data-celdaSeleccion') == 0) {
      if (celdaSeleccion < 6) {
		el.setAttr(obj, [{'data-celdaSeleccion': '1'}]);
        obj.classList.add('seleccion');
        celdaSeleccion++;
        let val = obj.children[0];
        render.audio(val.getAttribute('data-id'));
      }
      if (celdaSeleccion == 6) {
        let padre = document.getElementById('juego');
        let tablaHija = padre.children[0];
        let tr = tablaHija.children;
        let ltr = tr.length;
        for (let contTR = 0; contTR < ltr; contTR++) {
          let td = tr[contTR].children;
          let ltd = td.length;
          for (let contTD = 0; contTD < ltd; contTD++) {
            let celda = tr[contTR].children[contTD];
            if (celda.getAttribute('data-celdaSeleccion') == 1 && celda.getAttribute('data-celdaPremio') == 1) {
              aciertosCelda++;
            }
          }
		}
        if (aciertosCelda == 6) {
          document.getElementById('mensaje').innerHTML = 'ACIERTO';
          return false;
        } else {
          document.getElementById('mensaje').innerHTML = 'FALLO';
          return false;
        }
      }
    } else {
	  el.setAttr(obj, [{'data-celdaSeleccion': '0'}]);
      obj.classList.remove('seleccion');
      celdaSeleccion--;
      render.audio(obj.children[0].getAttribute('data-id'));
    }
  }
};

let el = {
	create: type => document.createElement(type),
	setAttr: (el, arr) => arr.map(data => { debugger; el.setAttribute(Object.keys(data)[0], Object.values(data)[0]);})
};

let render = {
  preload: () => render.cargarImagen('spriteSheet1', 'assets/spriteSheetAnimal.png'),
  audio: au => {
	let audio = new Audio(audioFiles[au]);
	audio.volumen = 1;
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  },
  cargarImagen: (id, imagen) => {
    let img = new Image();
    img.src = imagen;
    let arr = [id, img];
    assets.push(arr);
  },
  getImagen: (id, valor) => {
    let assetsLength = assets.length;
    if (assetsLength !== undefined) {
	  let img;
      for (let cont = 0; cont < assetsLength; cont++) {
        if (id == assets[cont][0]) {
          img = assets[cont][1];
          if (valor == 0) img.style.backgroundPosition = '4px -2px';
		  if (valor == 1) img.style.backgroundPosition = '-37px -2px';
          if (valor == 2) img.style.backgroundPosition = '-80px -2px';
          if (valor == 3) img.style.backgroundPosition = '4px -55px';
          if (valor == 4) img.style.backgroundPosition = '-37px -55px';
          if (valor == 5) img.style.backgroundPosition = '-80px -55px';
          img.style.backgroundRepeat = 'no-repeat';
          img.style.height = '50px';
          img.style.width = '50px';
          return img;
        }
      }
    }
  }
};
window.onload = () => game.juego();
