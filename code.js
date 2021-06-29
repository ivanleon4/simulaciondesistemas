const canvas = document.getElementById('canvas');
const plot = document.querySelector(".plot");
const context = canvas.getContext("2d");
// COLORES
const colorCanvas = "#00000";
const colorRect = "#1951ff";
const colorArc = " #ff0505 ";
const div = 4;
const margen = 10;
const cuadras = 10;
// Fcunion para crear un plot
function crearPlot(plot, lista1, lista2, titulo){
  let data = [{
    x: lista1,
    y: lista2,
    type: "scratter",
    mode: "lines",
    marker: {
      color: " #ff0000 ",
    }
  }]
  let layout = {
    title: titulo
  };
  Plotly.newPlot(plot, data, layout);
}
// Funciones para crear rectangulos y circulos
function crearRect(x, y, width, height, color){
  context.fillStyle = color? color : colorRect;
  context.beginPath();
  context.rect(x, y, width, height);
  context.fill();
  context.closePath();
}
function crearArc(x, y, radius, startAngle, endAngle, color){
  context.fillStyle = color? color : colorArc;
  context.beginPath();
  context.arc(x, y, radius, startAngle, endAngle);
  context.fill();
  context.closePath();
}
const ladoPorCuadra =  (canvas.width - margen*(1+cuadras))/cuadras;
// Funcion para traducir las cuadras al canvas 0 => cuadras-1
function coordenadasEnGrid(coordenada){
  return ((margen/2) + (ladoPorCuadra + margen) * coordenada );
}

crearPlot(plot, [0], [0],  "Probabilidad en cada Iteracion");
function renderBorracho(){

  //Dibujo de toda la manzana en base a las cuadras
  for (let i=0; i<cuadras; i++){
    for (let j=0; j<cuadras; j++){
      crearRect(
        (margen + ladoPorCuadra)*j + margen,
       (margen + ladoPorCuadra)*i + margen,
        ladoPorCuadra,
         ladoPorCuadra);
    }
  }
  let actualX = 5;
  let actualY = 5;
  let listaCoordenadas = [{x: actualX, y:   actualY}];
  for (let i=0; i<10; i++){
    direccion = Math.floor(Math.random() * 4);
    switch (direccion) {
      case 0: // arriba
        actualY -= 1;
        break;
      case 1: // derecha
        actualX += 1;
        break;
      case 2: // abajo
        actualY += 1;
        break;
      case 3: // izquierda
        actualX -= 1;
        break;
    }
    listaCoordenadas.push(
      {
        x: actualX,
        y: actualY
      }
    )
  }
  let i = 0;
  let intervalo = setInterval(()=>{
    try{
      crearArc(
        coordenadasEnGrid(listaCoordenadas[i].x),
        coordenadasEnGrid(listaCoordenadas[i].y),
        10, 0, Math.PI*2, colorArc);
      i++;
    }
    catch(e){
      clearInterval(intervalo);
    }
  }, 10);
  // evaluacion de exito
  let aDosCalles = [
    {x: 4, y: 4},
    {x: 5, y: 3},
    {x: 6, y: 4},
    {x: 7, y: 5},
    {x: 6, y: 6},
    {x: 5, y: 7},
    {x: 4, y: 6},
    {x: 3, y: 5}
  ]
  const ultimaPosicion = listaCoordenadas[listaCoordenadas.length - 1];
  let success = false;
  for (coor of aDosCalles) {
    if ((coor.x == ultimaPosicion.x) && (coor.y == ultimaPosicion.y)){
      success = true;
      break;
    }
  }
  return success;
}
// configurar el evento del boton
const boton = document.getElementById("btn");
boton.addEventListener("click", (event)=>{
  event.target.setAttribute("disabled", "true");
  let maximo = 40;
  let count = 0;
  let success = 0;
  let failed = 0;
  let listaProbabilidades = [];
  let listaCuenta = [];

  ////
  const inter = setInterval(()=>{
    if (count >= maximo) {
      clearInterval(inter);
      const cont = document.querySelector(".cont");
      cont.textContent = `La probabilidad de que termine su recorrido a dos calles de donde lo empezo es de: ${(success/count)*100} %`;
      event.target.removeAttribute("disabled");
      crearPlot(plot, listaCuenta, listaProbabilidades, "Probabilidad en cada Iteración");
    }
    // Limpiamos el canvas
    context.beginPath();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fill();
    context.closePath()
    let exito = renderBorracho();
    exito? success++ : failed++;
    count++;
    // Calculamos la probabilidad
    listaProbabilidades.push(Math.round((success/count)*1000)/10);
    listaCuenta.push(count);
  }, 250);
  ///
})
