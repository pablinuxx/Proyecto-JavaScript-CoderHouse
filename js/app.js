const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const fragment = document.createDocumentFragment()
let carrito = {}


//Una vez cargada la pagina
$(document).ready(() => {
    //Recorro mi archivo .json de productos
    fechData()
    //Si el localStorage tiene informacion la guardo en mi Carrito
    if(localStorage.getItem('carrito')) {
        Parseo 
        carrito = JSON.parse(localStorage.getItem('carrito'))               
        //Llamo a funcion que PintaCarrito
        pintarCarrito()
        //Funcion que cambia de numero cada vez que se agre/quita productos
        pintarCantidad(carrito) 
    }
})
//Asigo funcion
cards.addEventListener('click', e => {
    addCarrto(e)
})
//Asigo funcion
items.addEventListener('click', e => {
    btnAccion(e)
})

//Funcion para leer archivo de productos
const fechData = async () => {
    //Try o Catch por si hay errores
    try {
        const res = await fetch('js/productos.json')  
        const data = await res.json()
        pintarCards(data)

    } catch (error) {
        console.log(error);
    }
}

//Dibujo Cards con lo obtenido del Fetch
const pintarCards = data => {
     data.forEach( producto =>{
         templateCard.querySelector('h5').textContent = producto.title
         templateCard.querySelector('p').textContent = producto.precio
         templateCard.querySelector('img').setAttribute('src', producto.img)
         templateCard.querySelector('.btnComprar').dataset.id = producto.id

         const clone = templateCard.cloneNode(true)
         fragment.appendChild(clone)
     })
     cards.appendChild(fragment)

}
//Funcion aagregarCarrito al presionar BtnComprar
const addCarrto = e =>{
    
    if (e.target.classList.contains('btnComprar')) {        
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
//Cargo en el carrito el producto seleccionado y pinto cantidad
const setCarrito = objeto =>{
    const producto = {
        id: objeto.querySelector('.btnComprar').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1        
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
    pintarCantidad(carrito)
}
//Pinto carrito en el yemplate HTML 
const pintarCarrito = ()=> {    
    items.innerHTML= ``
    Object.values(carrito).forEach(producto =>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btnSumar').dataset.id = producto.id
        templateCarrito.querySelector('.btnRestar').dataset.id = producto.id
        templateCarrito.querySelector('.precio').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
        
    })
    items.appendChild(fragment)
    pintarFooter()
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

//Funcion que muestra el total y las cantidades
const pintarFooter = ()=> {
    footer.innerHTML= ``
    if(Object.keys(carrito).length === 0 ) {
        footer.innerHTML= `
        <th scope="row" colspan="5">Carrito vacio - comience a comprar</th>
        `
        return
        }
        const nCantidades = Object.values(carrito).reduce( (acc, { cantidad }) => acc + cantidad,0 )
        const nTotal = Object.values(carrito).reduce( (acc, { cantidad,precio }) => acc + cantidad*precio,0 )
        templateFooter.querySelectorAll('td')[0].textContent = nCantidades
        templateFooter.querySelector('span').textContent = nTotal

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)


    //Funcion al apretar VaciarCarrito
    btnVaciar = document.getElementById('vaciar-carrito')
   btnVaciar.addEventListener('click', () => {
      
       carrito = {}
       pintarCarrito()
       pintarCantidad(carrito)
   })
   

}
//Asigno acciones en cada boton de sumar y restar. Si es 0 lo borro
 const btnAccion = e =>{
     if (e.target.classList.contains('btnSumar')) {      
         const producto = carrito[e.target.dataset.id]
         producto.cantidad ++
         carrito[e.target.dataset.id] = { ...producto }
         pintarCarrito()         
     }
     if (e.target.classList.contains('btnRestar')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad --
        if(producto.cantidad === 0 ){
            delete carrito[e.target.dataset.id]
        }   
        pintarCarrito()
        pintarCantidad(carrito)
     }
     e.stopPropagation()
 }
 
//PreLoader
function counter() {
    var count = setInterval(function () {
      var c = parseInt($(".counter").text());
      $(".counter").text((++c).toString());
      if (c == 100) {
        clearInterval(count);
        $(".counter").addClass("hide");
        $(".preloader").addClass("active");
      }
    }, 60);
  }
  
  counter();
  
//TimerCountDown
$("#contador").countdown({
    date: "04/01/2021 00:00:00",
    offset: -3,
    day: "Day",
    days: "Dias",
    hour: "Hora",
    hours: "Horas",
    minute: "Minuto",
    minutes: "Minutos",
    second: "Segundo",
    seconds: "Segundos",
  });
  
  //Funcion de Ajax para obtener la informacion de la API
//Ajax
let xhttp = new XMLHttpRequest();
xhttp.open(
  "GET",
  "https://randomuser.me/api/?results=4&nat=ES&inc=name,email,picture"
);
xhttp.send();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let datosx = JSON.parse(this.responseText);
    const datos = datosx.results;
    pintarTestimonios(datos);
  }

  //Funcion que pinta los testimonios obtenidos de la API
  function pintarTestimonios(datos) {
    const testimonios = document.querySelector("#testimonios");
    for (let item of datos) {
      testimonios.innerHTML += `
      <div class="col-3 justify-content-between>
    <div class="card" >
  <img class="card-img-top" src=${item.picture.thumbnail} style="width:50%" class="img-thumbnail">
  <div class="card-body">
    <h5 class="card-title">${item.name.first}  ${item.name.last}</h5>
    <q class="card-text font-italic">The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</q>
    <strong class="py5">${item.email}</strong>
  </div>
</div>    
</div>
    `;
    }
  }
};
//Pinto Cantidad en el icono de Cantidad
function pintarCantidad(carrito){
    circulo = document.getElementById('circulo-cantidad');
   cantidad = Object.keys(carrito).length
    circulo.textContent = cantidad
 
}